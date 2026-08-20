import { AppStateData, User, Material, Assignment, Submission, Grade, BabProgress, ClassRoom, Reflection } from '../types';
import { INITIAL_USERS, INITIAL_CLASSES, INITIAL_MATERIALS, INITIAL_ASSIGNMENTS, INITIAL_SUBMISSIONS, INITIAL_GRADES, INITIAL_REFLECTIONS, TEACHER_AVATAR_IMAGE } from '../data/seedData';
import { firebaseService } from './firebase';

const STORAGE_KEYS = {
  APP_DATA: 'lms_pai_professional_v3',
  GAS_URL: 'lms_pai_gas_url',
  CURRENT_USER: 'lms_pai_current_user',
};

class ApiService {
  private gasUrl: string = '';

  constructor() {
    this.loadGasUrl();
    // Initialize cloud firestore database
    firebaseService.initializeDatabase().catch((e) => {
      console.log('Firebase init status:', e);
    });
  }

  public getGasUrl(): string {
    return this.gasUrl || localStorage.getItem(STORAGE_KEYS.GAS_URL) || '';
  }

  public setGasUrl(url: string): void {
    this.gasUrl = url.trim();
    if (this.gasUrl) {
      localStorage.setItem(STORAGE_KEYS.GAS_URL, this.gasUrl);
    } else {
      localStorage.removeItem(STORAGE_KEYS.GAS_URL);
    }
  }

  private loadGasUrl(): void {
    const saved = localStorage.getItem(STORAGE_KEYS.GAS_URL);
    if (saved) this.gasUrl = saved;
  }

  // Get local or cached data
  public getLocalData(): AppStateData {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_DATA);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const users: User[] = Array.isArray(parsed.users) && parsed.users.length ? parsed.users : INITIAL_USERS;
        
        // Ensure teacher initial name is migrated
        users.forEach((u) => {
          if (u.Role === 'Guru' && u.Nama.includes('Imran')) {
            u.Nama = 'IMEL, S.Pd, Gr.';
            u.Email = 'imel68@guru.smp.belajar.id';
            u.Avatar = u.Avatar || TEACHER_AVATAR_IMAGE;
          }
        });

        const classes: ClassRoom[] = Array.isArray(parsed.classes) && parsed.classes.length ? parsed.classes : INITIAL_CLASSES;
        classes.forEach((c) => {
          if (c.Wali_Kelas && c.Wali_Kelas.includes('Imran')) {
            c.Wali_Kelas = 'IMEL, S.Pd, Gr.';
          }
        });

        const state: AppStateData = {
          users,
          classes,
          materials: Array.isArray(parsed.materials) && parsed.materials.length ? parsed.materials : INITIAL_MATERIALS,
          assignments: Array.isArray(parsed.assignments) && parsed.assignments.length ? parsed.assignments : INITIAL_ASSIGNMENTS,
          submissions: Array.isArray(parsed.submissions) ? parsed.submissions : INITIAL_SUBMISSIONS,
          grades: Array.isArray(parsed.grades) ? parsed.grades : INITIAL_GRADES,
          reflections: Array.isArray(parsed.reflections) ? parsed.reflections : INITIAL_REFLECTIONS,
        };

        return state;
      } catch (e) {
        console.error('Failed to parse local storage data, resetting to seed data', e);
      }
    }
    const initial: AppStateData = {
      users: INITIAL_USERS,
      classes: INITIAL_CLASSES,
      materials: INITIAL_MATERIALS,
      assignments: INITIAL_ASSIGNMENTS,
      submissions: INITIAL_SUBMISSIONS,
      grades: INITIAL_GRADES,
      reflections: INITIAL_REFLECTIONS,
    };
    this.saveLocalData(initial);
    return initial;
  }

  public saveLocalData(data: AppStateData): void {
    localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(data));
  }

  public resetToDefault(): AppStateData {
    const initial: AppStateData = {
      users: INITIAL_USERS,
      classes: INITIAL_CLASSES,
      materials: INITIAL_MATERIALS,
      assignments: INITIAL_ASSIGNMENTS,
      submissions: INITIAL_SUBMISSIONS,
      grades: INITIAL_GRADES,
      reflections: INITIAL_REFLECTIONS,
    };
    this.saveLocalData(initial);
    firebaseService.seedAllData().catch(console.error);
    return initial;
  }

  // Fetch all state (from Cloud Firestore BaaS first, then GAS or local fallback)
  public async fetchAllData(): Promise<{ source: 'firestore' | 'gas' | 'local'; data: AppStateData }> {
    // 1. Try Firebase Cloud Firestore (BaaS)
    try {
      const cloudData = await firebaseService.fetchAllData();
      if (cloudData && (cloudData.users.length > 0 || cloudData.materials.length > 0)) {
        this.saveLocalData(cloudData);
        return { source: 'firestore', data: cloudData };
      }
    } catch (err) {
      console.warn('Firebase fetch fallback to other sources:', err);
    }

    // 2. Try Google Apps Script if URL provided
    const url = this.getGasUrl();
    if (url) {
      try {
        const response = await fetch(`${url}?action=getInitData`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.status === 'success' && resJson.data) {
            const rawData = resJson.data;
            const formatted: AppStateData = {
              users: Array.isArray(rawData.users) && rawData.users.length ? rawData.users : INITIAL_USERS,
              classes: Array.isArray(rawData.classes) && rawData.classes.length ? rawData.classes : INITIAL_CLASSES,
              materials: Array.isArray(rawData.materials) && rawData.materials.length ? rawData.materials : INITIAL_MATERIALS,
              assignments: Array.isArray(rawData.assignments) && rawData.assignments.length ? rawData.assignments : INITIAL_ASSIGNMENTS,
              submissions: Array.isArray(rawData.submissions) ? rawData.submissions : [],
              grades: Array.isArray(rawData.grades) ? rawData.grades : [],
              reflections: Array.isArray(rawData.reflections) ? rawData.reflections : INITIAL_REFLECTIONS,
            };
            this.saveLocalData(formatted);
            return { source: 'gas', data: formatted };
          }
        }
      } catch (err) {
        console.warn('GAS fetch failed, using local mirror:', err);
      }
    }

    // 3. Fallback to Local Storage
    return { source: 'local', data: this.getLocalData() };
  }

  // Subscribe to real-time Cloud Firestore updates
  public subscribeToRealtimeUpdates(callback: (data: AppStateData) => void): () => void {
    return firebaseService.subscribeToRealtimeUpdates((cloudData) => {
      this.saveLocalData(cloudData);
      callback(cloudData);
    });
  }

  // Calculate Student Progress across Bab
  public calculateProgress(studentId: string, data: AppStateData): Record<number, BabProgress> {
    const { users, materials, assignments, submissions, grades } = data;
    const student = users.find((u) => String(u.ID_User) === String(studentId));
    const studentKelas = student?.Kelas || '';

    // Relevant materials for this student's class
    const relevantMaterials = materials.filter(
      (m) => !m.Target_Kelas || m.Target_Kelas === 'Semua Kelas' || m.Target_Kelas === 'Semua' || m.Target_Kelas === studentKelas
    );

    // Relevant assignments for this student's class
    const relevantAssignments = assignments.filter(
      (a) => !a.Target_Kelas || a.Target_Kelas === 'Semua Kelas' || a.Target_Kelas === 'Semua' || a.Target_Kelas === studentKelas
    );

    const babNumbers: number[] = Array.from(new Set<number>(materials.map((m) => Number(m.Bab)))).sort((a: number, b: number) => a - b);

    const result: Record<number, BabProgress> = {};
    let previousBabCompleted = true;

    babNumbers.forEach((babNum) => {
      const babMaterials = relevantMaterials.filter((m) => Number(m.Bab) === babNum);
      const babMaterialIds = babMaterials.map((m) => String(m.ID_Material));

      const babAssignments = relevantAssignments.filter((a) =>
        babMaterialIds.includes(String(a.ID_Material))
      );
      const totalCount = babAssignments.length;

      const studentSubmissions = submissions.filter(
        (s) => String(s.ID_Student) === String(studentId) && babAssignments.some((a) => String(a.ID_Assignment) === String(s.ID_Assignment))
      );

      const completedCount = studentSubmissions.length;
      const isCompleted = totalCount > 0 ? completedCount >= totalCount : true;
      const isUnlocked = babNum === 1 || previousBabCompleted;

      const babAssignmentIds = babAssignments.map((a) => String(a.ID_Assignment));
      const studentBabGrades = grades.filter(
        (g) => String(g.ID_Student) === String(studentId) && babAssignmentIds.includes(String(g.ID_Assignment))
      );

      const scoreAverage =
        studentBabGrades.length > 0
          ? Math.round(studentBabGrades.reduce((acc, curr) => acc + Number(curr.Nilai || 0), 0) / studentBabGrades.length)
          : undefined;

      const firstMat = babMaterials[0] || materials.find((m) => Number(m.Bab) === babNum);
      const judul = firstMat ? firstMat.Judul_Bab.replace(/^Bab \d+:\s*/, '') : `Bab ${babNum}`;

      result[babNum] = {
        bab: babNum,
        judul,
        totalAssignments: totalCount,
        completedAssignments: completedCount,
        isUnlocked,
        isCompleted,
        scoreAverage,
      };

      previousBabCompleted = isUnlocked && isCompleted;
    });

    return result;
  }

  // Submit Assignment (Siswa)
  public async submitAssignment(payload: {
    ID_Assignment: string;
    ID_Student: string;
    Link_Tugas: string;
    Catatan_Siswa?: string;
    Lampiran_File_Siswa?: string;
    Lampiran_Nama_File?: string;
  }): Promise<{ success: boolean; submission: Submission; message: string }> {
    const data = this.getLocalData();
    const existingIndex = data.submissions.findIndex(
      (s) => String(s.ID_Assignment) === String(payload.ID_Assignment) && String(s.ID_Student) === String(payload.ID_Student)
    );

    const now = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    let updatedSubmission: Submission;

    if (existingIndex >= 0) {
      updatedSubmission = {
        ...data.submissions[existingIndex],
        Link_Tugas: payload.Link_Tugas,
        Status: 'Dikirim',
        Tanggal_Kirim: now,
        Catatan_Siswa: payload.Catatan_Siswa || data.submissions[existingIndex].Catatan_Siswa,
        Lampiran_File_Siswa: payload.Lampiran_File_Siswa || data.submissions[existingIndex].Lampiran_File_Siswa,
        Lampiran_Nama_File: payload.Lampiran_Nama_File || data.submissions[existingIndex].Lampiran_Nama_File,
      };
      data.submissions[existingIndex] = updatedSubmission;
    } else {
      updatedSubmission = {
        ID_Submission: 'SUB-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        ID_Assignment: payload.ID_Assignment,
        ID_Student: payload.ID_Student,
        Link_Tugas: payload.Link_Tugas,
        Status: 'Dikirim',
        Tanggal_Kirim: now,
        Catatan_Siswa: payload.Catatan_Siswa,
        Lampiran_File_Siswa: payload.Lampiran_File_Siswa,
        Lampiran_Nama_File: payload.Lampiran_Nama_File,
      };
      data.submissions.push(updatedSubmission);
    }

    this.saveLocalData(data);

    // Save to Cloud Firestore BaaS
    firebaseService.saveSubmission(updatedSubmission).catch(console.error);

    // Sync to GAS if configured
    const url = this.getGasUrl();
    if (url) {
      try {
        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submitAssignment',
            ...payload,
          }),
        }).catch((e) => console.log('Background GAS sync:', e));
      } catch (err) {
        console.warn('GAS POST error:', err);
      }
    }

    return {
      success: true,
      submission: updatedSubmission,
      message: 'Tugas PAI berhasil dikirim ke Guru!',
    };
  }

  // Grade Submission (Guru)
  public async saveGrade(payload: {
    ID_Submission: string;
    ID_Student: string;
    ID_Assignment: string;
    Nilai: number;
    Catatan_Guru: string;
    Nama_Penilai?: string;
  }): Promise<{ success: boolean; grade: Grade; message: string }> {
    const data = this.getLocalData();

    // Mark submission as 'Dinilai'
    const subIndex = data.submissions.findIndex((s) => String(s.ID_Submission) === String(payload.ID_Submission));
    if (subIndex >= 0) {
      data.submissions[subIndex].Status = 'Dinilai';
    }

    const existingGradeIndex = data.grades.findIndex((g) => String(g.ID_Submission) === String(payload.ID_Submission));
    let savedGrade: Grade;
    const now = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

    if (existingGradeIndex >= 0) {
      savedGrade = {
        ...data.grades[existingGradeIndex],
        Nilai: payload.Nilai,
        Catatan_Guru: payload.Catatan_Guru,
        Tanggal_Nilai: now,
        Nama_Penilai: payload.Nama_Penilai || 'IMEL, S.Pd, Gr.',
      };
      data.grades[existingGradeIndex] = savedGrade;
    } else {
      savedGrade = {
        ID_Grade: 'GRD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        ID_Submission: payload.ID_Submission,
        ID_Student: payload.ID_Student,
        ID_Assignment: payload.ID_Assignment,
        Nilai: payload.Nilai,
        Catatan_Guru: payload.Catatan_Guru,
        Tanggal_Nilai: now,
        Nama_Penilai: payload.Nama_Penilai || 'IMEL, S.Pd, Gr.',
      };
      data.grades.push(savedGrade);
    }

    this.saveLocalData(data);

    // Save to Cloud Firestore BaaS
    firebaseService.saveGrade(savedGrade, payload.ID_Submission).catch(console.error);

    // Sync to GAS
    const url = this.getGasUrl();
    if (url) {
      try {
        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'saveGrade',
            ...payload,
          }),
        }).catch((e) => console.log('Background GAS sync:', e));
      } catch (err) {
        console.warn('GAS POST sync error:', err);
      }
    }

    return {
      success: true,
      grade: savedGrade,
      message: `Nilai ${payload.Nilai} berhasil disimpan!`,
    };
  }

  // Material CRUD (Guru)
  public async saveMaterial(material: Material): Promise<Material> {
    const data = this.getLocalData();
    const index = data.materials.findIndex((m) => m.ID_Material === material.ID_Material);
    if (index >= 0) {
      data.materials[index] = material;
    } else {
      data.materials.push(material);
    }
    this.saveLocalData(data);
    firebaseService.saveMaterial(material).catch(console.error);
    return material;
  }

  public async deleteMaterial(materialId: string): Promise<boolean> {
    const data = this.getLocalData();
    data.materials = data.materials.filter((m) => m.ID_Material !== materialId);
    this.saveLocalData(data);
    firebaseService.deleteMaterial(materialId).catch(console.error);
    return true;
  }

  // Assignment CRUD (Guru)
  public async saveAssignment(assignment: Assignment): Promise<Assignment> {
    const data = this.getLocalData();
    const index = data.assignments.findIndex((a) => a.ID_Assignment === assignment.ID_Assignment);
    if (index >= 0) {
      data.assignments[index] = assignment;
    } else {
      data.assignments.push(assignment);
    }
    this.saveLocalData(data);
    firebaseService.saveAssignment(assignment).catch(console.error);
    return assignment;
  }

  public async deleteAssignment(assignmentId: string): Promise<boolean> {
    const data = this.getLocalData();
    data.assignments = data.assignments.filter((a) => a.ID_Assignment !== assignmentId);
    this.saveLocalData(data);
    firebaseService.deleteAssignment(assignmentId).catch(console.error);
    return true;
  }

  // Class CRUD (Guru)
  public async saveClass(classRoom: ClassRoom): Promise<ClassRoom> {
    const data = this.getLocalData();
    const index = data.classes.findIndex((c) => c.ID_Kelas === classRoom.ID_Kelas || c.Nama_Kelas === classRoom.Nama_Kelas);
    if (index >= 0) {
      data.classes[index] = classRoom;
    } else {
      data.classes.push(classRoom);
    }
    this.saveLocalData(data);
    firebaseService.saveClass(classRoom).catch(console.error);
    return classRoom;
  }

  public async deleteClass(classId: string): Promise<boolean> {
    const data = this.getLocalData();
    data.classes = data.classes.filter((c) => c.ID_Kelas !== classId);
    this.saveLocalData(data);
    firebaseService.deleteClass(classId).catch(console.error);
    return true;
  }

  // User CRUD (Guru / Auth)
  public async saveUser(user: User): Promise<User> {
    const data = this.getLocalData();
    const index = data.users.findIndex((u) => u.ID_User === user.ID_User);
    if (index >= 0) {
      data.users[index] = user;
    } else {
      data.users.push(user);
    }
    this.saveLocalData(data);
    firebaseService.saveUser(user).catch(console.error);
    return user;
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const data = this.getLocalData();
    data.users = data.users.filter((u) => u.ID_User !== userId);
    this.saveLocalData(data);
    firebaseService.deleteUser(userId).catch(console.error);
    return true;
  }

  // Delete All Students (Semua Siswa / Berdasarkan Rombel)
  public async deleteAllStudents(targetClass?: string): Promise<{ success: boolean; count: number }> {
    const data = this.getLocalData();
    const prevCount = data.users.length;

    if (targetClass && targetClass !== 'all') {
      data.users = data.users.filter((u) => !(u.Role === 'Siswa' && u.Kelas === targetClass));
    } else {
      data.users = data.users.filter((u) => u.Role !== 'Siswa');
    }

    const deletedCount = prevCount - data.users.length;
    this.saveLocalData(data);

    // Delete in Cloud Firestore BaaS
    firebaseService.deleteAllStudents(targetClass).catch(console.error);

    // Sync to GAS in background if configured
    const url = this.getGasUrl();
    if (url) {
      try {
        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'deleteAllStudents',
            targetClass: targetClass || 'all',
          }),
        }).catch((e) => console.log('Background GAS delete all students sync:', e));
      } catch (err) {
        console.warn('GAS POST delete all students sync error:', err);
      }
    }

    return { success: true, count: deletedCount };
  }

  // Save Batch Users (Bulk Import Siswa)
  public async saveBatchUsers(newUsers: User[]): Promise<{ success: boolean; count: number }> {
    const data = this.getLocalData();
    let count = 0;
    
    newUsers.forEach((nu) => {
      const index = data.users.findIndex(
        (u) =>
          u.ID_User === nu.ID_User ||
          (nu.NIS && u.NIS && String(u.NIS).trim() !== '' && String(u.NIS).trim() === String(nu.NIS).trim()) ||
          (nu.NISN && u.NISN && String(u.NISN).trim() !== '' && String(u.NISN).trim() === String(nu.NISN).trim()) ||
          (u.Nama.toLowerCase().trim() === nu.Nama.toLowerCase().trim() && u.Kelas === nu.Kelas)
      );

      if (index >= 0) {
        data.users[index] = {
          ...data.users[index],
          ...nu,
          NIS: nu.NIS || nu.NISN || data.users[index].NIS || data.users[index].NISN || '',
          ID_User: data.users[index].ID_User,
        };
      } else {
        data.users.push({
          ...nu,
          NIS: nu.NIS || nu.NISN || '',
        });
      }
      count++;
    });

    this.saveLocalData(data);

    // Save batch to Cloud Firestore BaaS
    firebaseService.saveBatchUsers(newUsers).catch(console.error);

    // Sync to GAS in background if configured
    const url = this.getGasUrl();
    if (url) {
      try {
        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'saveBatchUsers',
            users: newUsers,
          }),
        }).catch((e) => console.log('Background GAS batch users sync:', e));
      } catch (err) {
        console.warn('GAS POST batch users sync error:', err);
      }
    }

    return { success: true, count };
  }

  // Export Students to CSV with UTF-8 BOM
  public exportStudentsCsv(className: string, data: AppStateData): string {
    const classStudents = data.users.filter((u) => u.Role === 'Siswa' && (className === 'all' || u.Kelas === className));

    const headers = [
      'No',
      'ID Siswa',
      'Nama Siswa',
      'NIS',
      'Kelas / Rombel',
      'Role',
    ];

    const rows = classStudents.map((std, idx) => [
      idx + 1,
      std.ID_User,
      `"${(std.Nama || '').replace(/"/g, '""')}"`,
      std.NIS ? `"${std.NIS}"` : (std.NISN ? `"${std.NISN}"` : '""'),
      `"${std.Kelas || ''}"`,
      'Siswa',
    ]);

    return '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // Reflection CRUD (Siswa & Guru)
  public async saveReflection(payload: {
    ID_Material: string;
    ID_Student: string;
    Poin_Penting?: string;
    Kesimpulan: string;
    Hal_Disukai?: string;
    Pertanyaan_Siswa?: string;
  }): Promise<{ success: boolean; reflection: Reflection; message: string }> {
    const data = this.getLocalData();
    if (!data.reflections) {
      data.reflections = [];
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const existingIndex = data.reflections.findIndex(
      (r) => String(r.ID_Material) === String(payload.ID_Material) && String(r.ID_Student) === String(payload.ID_Student)
    );

    let savedRefl: Reflection;
    if (existingIndex >= 0) {
      savedRefl = {
        ...data.reflections[existingIndex],
        Poin_Penting: payload.Poin_Penting,
        Kesimpulan: payload.Kesimpulan,
        Hal_Disukai: payload.Hal_Disukai,
        Pertanyaan_Siswa: payload.Pertanyaan_Siswa,
        Tanggal_Diperbarui: now,
      };
      data.reflections[existingIndex] = savedRefl;
    } else {
      savedRefl = {
        ID_Reflection: `REFL-${Date.now().toString().slice(-6)}`,
        ID_Material: payload.ID_Material,
        ID_Student: payload.ID_Student,
        Poin_Penting: payload.Poin_Penting,
        Kesimpulan: payload.Kesimpulan,
        Hal_Disukai: payload.Hal_Disukai,
        Pertanyaan_Siswa: payload.Pertanyaan_Siswa,
        Tanggal_Dibuat: now,
      };
      data.reflections.push(savedRefl);
    }

    this.saveLocalData(data);

    // Save to Cloud Firestore BaaS
    firebaseService.saveReflection(savedRefl).catch(console.error);

    // Sync to GAS in background if configured
    const url = this.getGasUrl();
    if (url) {
      try {
        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'saveReflection',
            ...savedRefl,
          }),
        }).catch((e) => console.log('Background GAS reflection sync:', e));
      } catch (err) {
        console.warn('GAS POST reflection sync error:', err);
      }
    }

    return {
      success: true,
      reflection: savedRefl,
      message: 'Refleksi pembelajaran berhasil disimpan!',
    };
  }

  // Teacher feedback to reflection
  public async respondToReflection(reflectionId: string, tanggapanGuru: string): Promise<boolean> {
    const data = this.getLocalData();
    if (!data.reflections) data.reflections = [];
    const index = data.reflections.findIndex((r) => r.ID_Reflection === reflectionId);
    if (index >= 0) {
      data.reflections[index].Tanggapan_Guru = tanggapanGuru;
      this.saveLocalData(data);
      firebaseService.saveReflection(data.reflections[index]).catch(console.error);
      return true;
    }
    return false;
  }

  // Export Gradebook for a Specific Class to CSV
  public exportClassGradebookCsv(className: string, data: AppStateData): string {
    const classStudents = data.users.filter((u) => u.Role === 'Siswa' && (className === 'all' || u.Kelas === className));
    const classAssignments = data.assignments.filter(
      (a) => className === 'all' || !a.Target_Kelas || a.Target_Kelas === 'Semua Kelas' || a.Target_Kelas === className
    );

    const headers = [
      'No',
      'NISN',
      'Nama Siswa',
      'Kelas',
      ...classAssignments.map((a) => `"${a.Judul_Tugas.replace(/"/g, '""')} (${a.Bobot_Nilai || 0}%)"`),
      'Nilai Rata-rata',
      'Status Kelulusan',
    ];

    const rows = classStudents.map((std, idx) => {
      const studentGrades = classAssignments.map((task) => {
        const sub = data.submissions.find(
          (s) => String(s.ID_Student) === String(std.ID_User) && String(s.ID_Assignment) === String(task.ID_Assignment)
        );
        if (!sub) return 'Belum Kumpul';
        const gr = data.grades.find((g) => String(g.ID_Submission) === String(sub.ID_Submission));
        return gr ? gr.Nilai : 'Sudah Kumpul (Belum Dinilai)';
      });

      const numericScores = studentGrades.filter((s): s is number => typeof s === 'number');
      const avg =
        numericScores.length > 0
          ? Math.round(numericScores.reduce((a, b) => a + b, 0) / numericScores.length)
          : 0;

      const status = avg >= 75 ? 'TUNTAS (KKTP Terpenuhi)' : 'BELUM TUNTAS';

      return [
        idx + 1,
        std.NISN || '-',
        `"${std.Nama.replace(/"/g, '""')}"`,
        std.Kelas,
        ...studentGrades,
        avg > 0 ? avg : '-',
        status,
      ];
    });

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // Session persistence
  public getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  }

  public setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
}

export const apiService = new ApiService();
