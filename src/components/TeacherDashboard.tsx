import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Award, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Eye, 
  Download, 
  Sparkles, 
  FileSpreadsheet, 
  X, 
  Save, 
  Layers, 
  Video, 
  HardDrive, 
  HelpCircle,
  School,
  Printer,
  ChevronRight,
  ShieldCheck,
  Bookmark,
  Calendar,
  ListVideo
} from 'lucide-react';
import { 
  User, 
  Material, 
  Assignment, 
  Submission, 
  Grade, 
  ClassRoom, 
  MaterialContent, 
  AspekPAI, 
  KategoriTugas,
  Reflection
} from '../types';
import { ASPEK_PAI_LIST, KATEGORI_TUGAS_OPTIONS } from '../data/gasCode';
import { apiService } from '../services/apiService';
import { MediaEmbedViewer } from './MediaEmbedViewer';
import { ClassManagementTab } from './ClassManagementTab';
import { ReflectionManagementTab } from './ReflectionManagementTab';
import { TeacherProfileModal } from './TeacherProfileModal';

interface TeacherDashboardProps {
  currentUser: User;
  users: User[];
  classes: ClassRoom[];
  materials: Material[];
  assignments: Assignment[];
  submissions: Submission[];
  grades: Grade[];
  reflections?: Reflection[];
  onSaveMaterial: (material: Material) => Promise<void>;
  onDeleteMaterial: (materialId: string) => Promise<void>;
  onSaveAssignment: (assignment: Assignment) => Promise<void>;
  onDeleteAssignment: (assignmentId: string) => Promise<void>;
  onSaveGrade: (gradePayload: {
    ID_Submission: string;
    ID_Student: string;
    ID_Assignment: string;
    Nilai: number;
    Catatan_Guru: string;
    Nama_Penilai?: string;
  }) => Promise<void>;
  onSaveClass: (classRoom: ClassRoom) => Promise<void>;
  onDeleteClass: (classId: string) => Promise<void>;
  onSaveUser: (user: User) => Promise<void>;
  onSaveBatchUsers?: (newUsers: User[]) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onDeleteAllStudents?: (targetClass?: string) => Promise<void>;
  onRespondReflection?: (reflectionId: string, tanggapan: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  users,
  classes,
  materials,
  assignments,
  submissions,
  grades,
  reflections = [],
  onSaveMaterial,
  onDeleteMaterial,
  onSaveAssignment,
  onDeleteAssignment,
  onSaveGrade,
  onSaveClass,
  onDeleteClass,
  onSaveUser,
  onSaveBatchUsers,
  onDeleteUser,
  onDeleteAllStudents,
  onRespondReflection,
  showToast,
}) => {
  // Navigation Tabs: 'kelas' | 'materi' | 'tugas' | 'refleksi' | 'penilaian'
  const [currentTab, setCurrentTab] = useState<'kelas' | 'materi' | 'tugas' | 'refleksi' | 'penilaian'>('kelas');

  // Global filters
  const [filterKelas, setFilterKelas] = useState<string>('all');
  const [filterAspek, setFilterAspek] = useState<string>('all');
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [filterBab, setFilterBab] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sub-tab under Penilaian: 'antrean' | 'bukunilai'
  const [penilaianSubTab, setPenilaianSubTab] = useState<'antrean' | 'bukunilai'>('antrean');

  // Preview Material Modal
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);

  // Profile Modal State (Ganti Foto & Data Profil Guru)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // ==========================================
  // MODAL: FORM MATERI PAI
  // ==========================================
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [matBab, setMatBab] = useState<number>(1);
  const [matJudulBab, setMatJudulBab] = useState<string>('Bab 1: Al-Qur’an dan Sunnah Sebagai Pedoman Hidup');
  const [matJudulMateri, setMatJudulMateri] = useState<string>('');
  const [matAspek, setMatAspek] = useState<AspekPAI>('Al-Qur\'an Hadis');
  const [matTargetKelas, setMatTargetKelas] = useState<string>('Semua Kelas');
  const [matKompetensi, setMatKompetensi] = useState<string>('');
  const [matCatatanGuru, setMatCatatanGuru] = useState<string>('');
  const [matVideoList, setMatVideoList] = useState<{ url: string; title: string }[]>([{ url: '', title: '' }]);
  const [matPdfUrl, setMatPdfUrl] = useState<string>('');
  const [matPdfName, setMatPdfName] = useState<string>('');
  const [matDriveLink, setMatDriveLink] = useState<string>('');
  const [matDriveTitle, setMatDriveTitle] = useState<string>('');
  const [isSavingMat, setIsSavingMat] = useState(false);

  // ==========================================
  // MODAL: FORM TUGAS / LKPD PAI
  // ==========================================
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [taskMaterialId, setTaskMaterialId] = useState<string>(materials[0]?.ID_Material || 'MAT-01');
  const [taskJudul, setTaskJudul] = useState<string>('');
  const [taskKategori, setTaskKategori] = useState<KategoriTugas>('LKPD / Tugas Mandiri');
  const [taskTargetKelas, setTaskTargetKelas] = useState<string>('Semua Kelas');
  const [taskDesc, setTaskDesc] = useState<string>('');
  const [taskGuidance, setTaskGuidance] = useState<string>('Cantumkan link tugas Google Drive / Docs atau ketik jawaban langsung.');
  const [taskWeight, setTaskWeight] = useState<number>(20);
  const [taskDeadline, setTaskDeadline] = useState<string>('2026-09-15');
  const [taskPdfUrl, setTaskPdfUrl] = useState<string>('');
  const [taskPdfName, setTaskPdfName] = useState<string>('');
  const [taskDriveLink, setTaskDriveLink] = useState<string>('');
  const [taskDriveName, setTaskDriveName] = useState<string>('');
  const [isSavingTask, setIsSavingTask] = useState(false);

  // ==========================================
  // MODAL: PENILAIAN SISWA (GRADING)
  // ==========================================
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [inputNilai, setInputNilai] = useState<number>(85);
  const [inputCatatanGuru, setInputCatatanGuru] = useState<string>('');
  const [isSavingGrade, setIsSavingGrade] = useState(false);

  // Filtered Submissions list for Grading
  const filteredSubmissions = submissions.filter((sub) => {
    const student = users.find((u) => String(u.ID_User) === String(sub.ID_Student));
    const task = assignments.find((a) => String(a.ID_Assignment) === String(sub.ID_Assignment));
    const mat = materials.find((m) => String(m.ID_Material) === String(task?.ID_Material));

    const matchesSearch =
      !searchQuery ||
      student?.Nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task?.Judul_Tugas.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBab = filterBab === 'all' || String(mat?.Bab) === filterBab;
    const matchesStatus = filterStatus === 'all' || sub.Status === filterStatus;
    const matchesKelas = filterKelas === 'all' || student?.Kelas === filterKelas;
    const matchesAspek = filterAspek === 'all' || mat?.Aspek_PAI === filterAspek;

    return matchesSearch && matchesBab && matchesStatus && matchesKelas && matchesAspek;
  });

  // Filtered Materials list
  const filteredMaterials = materials.filter((m) => {
    const matchesBab = filterBab === 'all' || String(m.Bab) === filterBab;
    const matchesAspek = filterAspek === 'all' || m.Aspek_PAI === filterAspek;
    const matchesKelas =
      filterKelas === 'all' ||
      !m.Target_Kelas ||
      m.Target_Kelas === 'Semua Kelas' ||
      m.Target_Kelas === 'Semua' ||
      m.Target_Kelas === filterKelas;
    const matchesSearch =
      !searchQuery ||
      m.Judul_Bab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.Judul_Materi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.Deskripsi_Singkat && m.Deskripsi_Singkat.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesBab && matchesAspek && matchesKelas && matchesSearch;
  });

  // Filtered Assignments list
  const filteredAssignments = assignments.filter((a) => {
    const mat = materials.find((m) => String(m.ID_Material) === String(a.ID_Material));
    const matchesBab = filterBab === 'all' || String(mat?.Bab) === filterBab;
    const matchesKategori = filterKategori === 'all' || a.Kategori === filterKategori;
    const matchesKelas =
      filterKelas === 'all' ||
      !a.Target_Kelas ||
      a.Target_Kelas === 'Semua Kelas' ||
      a.Target_Kelas === 'Semua' ||
      a.Target_Kelas === filterKelas;
    const matchesSearch =
      !searchQuery ||
      a.Judul_Tugas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.Deskripsi_Tugas.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBab && matchesKategori && matchesKelas && matchesSearch;
  });

  // Open grading modal for a submission
  const handleOpenGradingModal = (sub: Submission) => {
    setGradingSubmission(sub);
    const existingGrade = grades.find((g) => String(g.ID_Submission) === String(sub.ID_Submission));
    if (existingGrade) {
      setInputNilai(Number(existingGrade.Nilai) || 85);
      setInputCatatanGuru(existingGrade.Catatan_Guru || '');
    } else {
      setInputNilai(85);
      setInputCatatanGuru('Alhamdulillah, tugas telah dikerjakan dengan sangat baik dan rapi.');
    }
  };

  // Submit Grade
  const handleSaveGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    if (inputNilai < 0 || inputNilai > 100) {
      showToast('Nilai harus berada pada rentang 0 sampai 100!');
      return;
    }

    setIsSavingGrade(true);
    await onSaveGrade({
      ID_Submission: gradingSubmission.ID_Submission,
      ID_Student: gradingSubmission.ID_Student,
      ID_Assignment: gradingSubmission.ID_Assignment,
      Nilai: Number(inputNilai),
      Catatan_Guru: inputCatatanGuru.trim(),
      Nama_Penilai: currentUser.Nama,
    });

    setIsSavingGrade(false);
    setGradingSubmission(null);
    showToast(`Nilai ${inputNilai} berhasil disimpan!`);
  };

  // Open Material Modal
  const handleOpenMaterialModal = (mat?: Material, presetKelas?: string) => {
    if (mat) {
      setEditingMaterial(mat);
      setMatBab(Number(mat.Bab) || 1);
      setMatJudulBab(mat.Judul_Bab);
      setMatJudulMateri(mat.Judul_Materi || '');
      setMatAspek(mat.Aspek_PAI || 'Al-Qur\'an Hadis');
      setMatTargetKelas(mat.Target_Kelas || 'Semua Kelas');
      setMatKompetensi(mat.Target_Kompetensi || mat.Deskripsi_Singkat || '');

      let parsed: MaterialContent = { ringkasan: '', poinPenting: [] };
      try {
        parsed = JSON.parse(mat.Konten);
      } catch {
        parsed = { ringkasan: mat.Konten, poinPenting: [] };
      }

      setMatCatatanGuru(parsed.catatanGuru || '');
      
      // Load video list if available, or fallback to single videoUrl / mat.Video_Url
      if (parsed.videoList && Array.isArray(parsed.videoList) && parsed.videoList.length > 0) {
        setMatVideoList(parsed.videoList.map((v, idx) => ({
          url: v.url || '',
          title: v.title || `Video ${idx + 1}`,
        })));
      } else if (mat.Video_Url || parsed.videoUrl) {
        setMatVideoList([
          {
            url: mat.Video_Url || parsed.videoUrl || '',
            title: parsed.videoTitle || mat.Judul_Materi || 'Video Pembelajaran YouTube',
          },
        ]);
      } else {
        setMatVideoList([{ url: '', title: '' }]);
      }

      setMatPdfUrl(mat.Pdf_Url || parsed.pdfUrl || '');
      setMatPdfName(mat.Pdf_Nama || parsed.pdfName || '');
      setMatDriveLink(mat.Drive_Url || parsed.googleDriveLink || '');
      setMatDriveTitle(mat.Drive_Nama || parsed.googleDriveTitle || mat.Judul_Materi || '');
    } else {
      setEditingMaterial(null);
      setMatBab(1);
      setMatJudulBab('Bab 1: Al-Qur’an dan Sunnah Sebagai Pedoman Hidup');
      setMatJudulMateri('');
      setMatAspek('Al-Qur\'an Hadis');
      setMatTargetKelas(presetKelas || (filterKelas !== 'all' ? filterKelas : 'Semua Kelas'));
      setMatKompetensi('Memahami makna materi dan menerapkan dalam kehidupan sehari-hari.');
      setMatCatatanGuru('');
      setMatVideoList([{ url: '', title: '' }]);
      setMatPdfUrl('');
      setMatPdfName('');
      setMatDriveLink('');
      setMatDriveTitle('');
    }
    setIsMaterialModalOpen(true);
  };

  // Save Material Submit
  const handleSaveMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matJudulMateri.trim()) {
      showToast('Judul materi tidak boleh kosong!');
      return;
    }

    setIsSavingMat(true);

    // Clean up video list
    const cleanVideoList = matVideoList
      .map((item, idx) => ({
        url: item.url.trim(),
        title: item.title.trim() || `Video ${idx + 1}`,
      }))
      .filter((item) => item.url.length > 0);

    const contentObj: MaterialContent = {
      ringkasan: matKompetensi.trim() || matJudulMateri.trim(),
      poinPenting: [],
      catatanGuru: matCatatanGuru.trim() || undefined,
      videoList: cleanVideoList.length > 0 ? cleanVideoList : undefined,
      videoUrl: cleanVideoList[0]?.url || undefined,
      videoTitle: cleanVideoList[0]?.title || undefined,
      pdfUrl: matPdfUrl.trim() || undefined,
      pdfName: matPdfName.trim() || undefined,
      googleDriveLink: matDriveLink.trim() || undefined,
      googleDriveTitle: matDriveTitle.trim() || matJudulMateri.trim() || undefined,
    };

    const newMaterial: Material = {
      ID_Material: editingMaterial?.ID_Material || 'MAT-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      Bab: Number(matBab) || 1,
      Judul_Bab: matJudulBab.trim(),
      Judul_Materi: matJudulMateri.trim(),
      Aspek_PAI: matAspek,
      Target_Kelas: matTargetKelas,
      Konten: JSON.stringify(contentObj),
      Deskripsi_Singkat: matKompetensi.trim() || matJudulMateri.trim(),
      Target_Kompetensi: matKompetensi.trim(),
      Video_Url: cleanVideoList[0]?.url || undefined,
      Pdf_Url: matPdfUrl.trim() || undefined,
      Pdf_Nama: matPdfName.trim() || undefined,
      Drive_Url: matDriveLink.trim() || undefined,
      Drive_Nama: matDriveTitle.trim() || undefined,
      Tanggal_Dibuat: editingMaterial?.Tanggal_Dibuat || new Date().toISOString().split('T')[0],
    };

    await onSaveMaterial(newMaterial);
    setIsSavingMat(false);
    setIsMaterialModalOpen(false);
    showToast('Materi PAI berhasil disimpan!');
  };

  // Open Assignment Modal
  const handleOpenAssignmentModal = (task?: Assignment, presetKelas?: string) => {
    if (task) {
      setEditingAssignment(task);
      setTaskMaterialId(task.ID_Material || materials[0]?.ID_Material || 'MAT-01');
      setTaskJudul(task.Judul_Tugas || '');
      setTaskKategori(task.Kategori || 'LKPD / Tugas Mandiri');
      setTaskTargetKelas(task.Target_Kelas || 'Semua Kelas');
      setTaskDesc(task.Deskripsi_Tugas || '');
      setTaskGuidance(task.Petunjuk_Pengerjaan || '');
      setTaskWeight(task.Bobot_Nilai || 20);
      setTaskDeadline(task.Deadline || '2026-09-15');
      setTaskPdfUrl(task.Lampiran_PDF || '');
      setTaskPdfName(task.Lampiran_PDF_Nama || '');
      setTaskDriveLink(task.Lampiran_Drive || '');
      setTaskDriveName(task.Lampiran_Drive_Nama || '');
    } else {
      setEditingAssignment(null);
      setTaskMaterialId(materials[0]?.ID_Material || 'MAT-01');
      setTaskJudul('');
      setTaskKategori('LKPD / Tugas Mandiri');
      setTaskTargetKelas(presetKelas || (filterKelas !== 'all' ? filterKelas : 'Semua Kelas'));
      setTaskDesc('');
      setTaskGuidance('Cantumkan link Google Drive / Docs atau ketik jawaban langsung.');
      setTaskWeight(20);
      setTaskDeadline('2026-09-20');
      setTaskPdfUrl('');
      setTaskPdfName('');
      setTaskDriveLink('');
      setTaskDriveName('');
    }
    setIsAssignmentModalOpen(true);
  };

  // Save Assignment Submit
  const handleSaveAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskJudul.trim()) {
      showToast('Judul tugas tidak boleh kosong!');
      return;
    }

    setIsSavingTask(true);
    const newAssignment: Assignment = {
      ID_Assignment: editingAssignment?.ID_Assignment || 'TSK-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      ID_Material: taskMaterialId,
      Judul_Tugas: taskJudul.trim(),
      Kategori: taskKategori,
      Target_Kelas: taskTargetKelas,
      Deskripsi_Tugas: taskDesc,
      Petunjuk_Pengerjaan: taskGuidance,
      Bobot_Nilai: Number(taskWeight),
      Deadline: taskDeadline,
      Lampiran_PDF: taskPdfUrl.trim() || undefined,
      Lampiran_PDF_Nama: taskPdfName.trim() || (taskPdfUrl ? 'Lembar Kerja Peserta Didik (LKPD).pdf' : undefined),
      Lampiran_Drive: taskDriveLink.trim() || undefined,
      Lampiran_Drive_Nama: taskDriveName.trim() || (taskDriveLink ? 'Template Dokumen / LKPD' : undefined),
      Tanggal_Dibuat: editingAssignment?.Tanggal_Dibuat || new Date().toISOString().split('T')[0],
    };

    await onSaveAssignment(newAssignment);
    setIsSavingTask(false);
    setIsAssignmentModalOpen(false);
    showToast('Tugas PAI berhasil disimpan!');
  };

  // Export CSV Handler
  const handleExportCsv = (className: string) => {
    const csvContent = apiService.exportClassGradebookCsv(className, {
      users,
      classes,
      materials,
      assignments,
      submissions,
      grades,
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_Nilai_PAI_${className === 'all' ? 'Semua_Kelas' : 'Kelas_' + className}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Rekap nilai ${className === 'all' ? 'Semua Kelas' : 'Kelas ' + className} berhasil diunduh!`);
  };

  const students = users.filter((u) => u.Role === 'Siswa');
  const pendingCount = submissions.filter((s) => s.Status === 'Dikirim').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Teacher Profile */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
              <img
                src={currentUser.Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.Nama}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-emerald-400/40 shadow-lg group-hover:brightness-90 transition-all"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white">
                <Edit3 className="w-5 h-5 drop-shadow" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Guru Pengampu PAI
                </span>
                <span className="text-xs text-emerald-200">
                  SMP Negeri / Swasta
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight mt-1 text-white">
                {currentUser.Nama}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80">
                Panel Manajemen Pembelajaran, Distribusi Tugas & Buku Nilai Per Kelas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title="Perbarui nama, foto profil, dan informasi akun guru"
            >
              <Edit3 className="w-4 h-4 text-amber-300" />
              <span>Perbarui Profil & Foto</span>
            </button>

            <button
              onClick={() => handleOpenMaterialModal()}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>+ Buat Materi PAI</span>
            </button>

            <button
              onClick={() => handleOpenAssignmentModal()}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 border border-teal-500/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 text-teal-300" />
              <span>+ Buat Tugas / LKPD</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-800/60">
          <div className="bg-emerald-900/50 p-3 rounded-2xl border border-emerald-700/40">
            <p className="text-[11px] text-emerald-300 font-medium">Rombel Kelas</p>
            <p className="text-xl font-black text-white">{classes.length} Rombel</p>
          </div>
          <div className="bg-emerald-900/50 p-3 rounded-2xl border border-emerald-700/40">
            <p className="text-[11px] text-emerald-300 font-medium">Materi & Tugas PAI</p>
            <p className="text-xl font-black text-white">{materials.length} / {assignments.length}</p>
          </div>
          <div className="bg-emerald-900/50 p-3 rounded-2xl border border-emerald-700/40">
            <p className="text-[11px] text-emerald-300 font-medium">Total Siswa</p>
            <p className="text-xl font-black text-white">{students.length} Siswa</p>
          </div>
          <div className="bg-emerald-900/50 p-3 rounded-2xl border border-emerald-700/40">
            <p className="text-[11px] text-amber-300 font-medium">Perlu Dinilai</p>
            <p className="text-xl font-black text-amber-300">{pendingCount} Pengumpulan</p>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setCurrentTab('kelas')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'kelas'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Kelola Kelas & Rombel ({classes.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('materi')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'materi'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Materi Pembelajaran PAI ({materials.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('tugas')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'tugas'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Tugas & LKPD PAI ({assignments.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('refleksi')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'refleksi'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Refleksi Siswa ({reflections.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('penilaian')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'penilaian'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Penilaian & Buku Nilai Per Kelas</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: KELOLA KELAS & ROMBEL */}
      {/* ========================================================================= */}
      {currentTab === 'kelas' && (
        <ClassManagementTab
          classes={classes}
          users={users}
          materials={materials}
          assignments={assignments}
          submissions={submissions}
          grades={grades}
          onSaveClass={onSaveClass}
          onDeleteClass={onDeleteClass}
          onSaveUser={onSaveUser}
          onSaveBatchUsers={onSaveBatchUsers}
          onDeleteUser={onDeleteUser}
          onDeleteAllStudents={onDeleteAllStudents}
          onOpenCreateMaterialForClass={(className) => {
            handleOpenMaterialModal(undefined, className);
            setCurrentTab('materi');
          }}
          onOpenCreateAssignmentForClass={(className) => {
            handleOpenAssignmentModal(undefined, className);
            setCurrentTab('tugas');
          }}
          showToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KELOLA MATERI PEMBELAJARAN PAI */}
      {/* ========================================================================= */}
      {currentTab === 'materi' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari materi PAI..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 w-44 sm:w-56"
                />
              </div>

              {/* Target Kelas Filter */}
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
              >
                <option value="all">Semua Target Kelas</option>
                {classes.map((c) => (
                  <option key={c.ID_Kelas} value={c.Nama_Kelas}>
                    Kelas {c.Nama_Kelas}
                  </option>
                ))}
              </select>

              {/* Aspek PAI Filter */}
              <select
                value={filterAspek}
                onChange={(e) => setFilterAspek(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
              >
                <option value="all">Semua Aspek PAI</option>
                {ASPEK_PAI_LIST.map((asp) => (
                  <option key={asp.name} value={asp.name}>
                    {asp.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleOpenMaterialModal()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Materi PAI</span>
            </button>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">Tidak ada materi PAI yang cocok dengan filter.</p>
                <p className="text-xs mt-1">Coba ubah filter target kelas atau aspek di atas.</p>
              </div>
            ) : (
              filteredMaterials.map((mat) => {
                let parsed: MaterialContent = { ringkasan: '', poinPenting: [] };
                try {
                  parsed = JSON.parse(mat.Konten);
                } catch {
                  parsed = { ringkasan: mat.Konten, poinPenting: [] };
                }

                const relatedTasks = assignments.filter((a) => String(a.ID_Material) === String(mat.ID_Material));

                return (
                  <div
                    key={mat.ID_Material}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Bab {mat.Bab} • {mat.Aspek_PAI}
                        </span>

                        {mat.Target_Kelas && mat.Target_Kelas !== 'Semua Kelas' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                            🎯 Kelas {mat.Target_Kelas}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            🌐 Semua Kelas
                          </span>
                        )}
                      </div>

                      {/* Judul Materi */}
                      <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1.5">
                        {mat.Judul_Materi || mat.Judul_Bab}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mb-2.5">
                        {mat.Judul_Bab}
                      </p>

                      {mat.Target_Kompetensi && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          🎯 {mat.Target_Kompetensi}
                        </p>
                      )}

                      {/* Media indicators */}
                      {(() => {
                        const vCount = parsed.videoList?.length || (mat.Video_Url ? 1 : 0);
                        return (
                          <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px]">
                            {mat.Drive_Url && (
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-bold flex items-center gap-1">
                                <HardDrive className="w-3 h-3 text-blue-600" /> Google Drive
                              </span>
                            )}
                            {vCount > 0 && (
                              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold flex items-center gap-1">
                                <Video className="w-3 h-3 text-rose-600" /> {vCount > 1 ? `${vCount} Video YouTube` : 'YouTube'}
                              </span>
                            )}
                            {mat.Pdf_Url && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                                <FileText className="w-3 h-3 text-emerald-600" /> PDF
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                              {relatedTasks.length} Tugas Terkait
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setPreviewMaterial(mat)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Baca Materi</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenMaterialModal(mat)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Edit Materi"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Hapus materi "${mat.Judul_Materi || mat.Judul_Bab}"?`)) {
                              await onDeleteMaterial(mat.ID_Material);
                              showToast('Materi berhasil dihapus!');
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Hapus Materi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KELOLA TUGAS & LKPD PAI */}
      {/* ========================================================================= */}
      {currentTab === 'tugas' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari tugas / LKPD..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 w-44 sm:w-56"
                />
              </div>

              {/* Target Kelas Filter */}
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
              >
                <option value="all">Semua Target Kelas</option>
                {classes.map((c) => (
                  <option key={c.ID_Kelas} value={c.Nama_Kelas}>
                    Kelas {c.Nama_Kelas}
                  </option>
                ))}
              </select>

              {/* Kategori Filter */}
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
              >
                <option value="all">Semua Kategori Tugas</option>
                {KATEGORI_TUGAS_OPTIONS.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleOpenAssignmentModal()}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Tugas / LKPD</span>
            </button>
          </div>

          {/* Assignments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssignments.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
                <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">Tidak ada penugasan PAI ditemukan.</p>
                <p className="text-xs mt-1">Gunakan tombol "+ Buat Tugas / LKPD" untuk membuat penugasan baru.</p>
              </div>
            ) : (
              filteredAssignments.map((task) => {
                const mat = materials.find((m) => String(m.ID_Material) === String(task.ID_Material));
                const taskSubmissions = submissions.filter((s) => String(s.ID_Assignment) === String(task.ID_Assignment));
                const gradedCount = taskSubmissions.filter((s) => s.Status === 'Dinilai').length;

                return (
                  <div
                    key={task.ID_Assignment}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
                          {task.Kategori}
                        </span>

                        {task.Target_Kelas && task.Target_Kelas !== 'Semua Kelas' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                            🎯 Kelas {task.Target_Kelas}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            🌐 Semua Kelas
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1">
                        {task.Judul_Tugas}
                      </h4>
                      <p className="text-[11px] text-emerald-700 font-semibold line-clamp-1 mb-2.5">
                        Materi: {mat?.Judul_Materi || mat?.Judul_Bab || 'Materi Umum'}
                      </p>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {task.Deskripsi_Tugas}
                      </p>

                      {/* Attachments & Details */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5 text-xs mb-3">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-[11px] text-slate-400">Bobot Nilai:</span>
                          <span className="font-bold text-slate-800">{task.Bobot_Nilai || 20}%</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-[11px] text-slate-400">Tenggat Waktu:</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {task.Deadline || 'Fleksibel'}
                          </span>
                        </div>
                      </div>

                      {/* Submissions count badge */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span>Tugas Terkumpul:</span>
                        <span className="font-bold text-slate-800">
                          {taskSubmissions.length} Siswa ({gradedCount} Dinilai)
                        </span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setFilterKelas(task.Target_Kelas && task.Target_Kelas !== 'Semua Kelas' ? task.Target_Kelas : 'all');
                          setSearchQuery(task.Judul_Tugas);
                          setCurrentTab('penilaian');
                        }}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Koreksi ({taskSubmissions.length})</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenAssignmentModal(task)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Edit Tugas"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Hapus tugas "${task.Judul_Tugas}"?`)) {
                              await onDeleteAssignment(task.ID_Assignment);
                              showToast('Tugas berhasil dihapus!');
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Hapus Tugas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: REFLEKSI SISWA */}
      {/* ========================================================================= */}
      {currentTab === 'refleksi' && (
        <ReflectionManagementTab
          reflections={reflections}
          users={users}
          materials={materials}
          classes={classes}
          onRespondReflection={onRespondReflection}
          showToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PENILAIAN & BUKU NILAI PER KELAS */}
      {/* ========================================================================= */}
      {currentTab === 'penilaian' && (
        <div className="space-y-6">
          
          {/* Header Controls for Penilaian */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Buku Nilai & Pemeriksaan Tugas Siswa PAI</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Koreksi kiriman tugas siswa, berikan nilai (0-100) dan catatan ulasan, serta ekspor buku nilai per kelas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Select Kelas Dinamis */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 hidden sm:inline">Pilih Kelas:</label>
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="py-2 px-3 text-xs bg-emerald-50 border border-emerald-300 rounded-xl font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">🌐 Semua Kelas ({students.length} Siswa)</option>
                  {classes.map((c) => (
                    <option key={c.ID_Kelas} value={c.Nama_Kelas}>
                      🎯 Kelas {c.Nama_Kelas} ({students.filter((s) => s.Kelas === c.Nama_Kelas).length} Siswa)
                    </option>
                  ))}
                </select>
              </div>

              {/* Download CSV */}
              <button
                onClick={() => handleExportCsv(filterKelas)}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                title="Ekspor format CSV Spreadsheet"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor CSV</span>
              </button>
            </div>
          </div>

          {/* Sub Tabs: Antrean Koreksi vs Buku Nilai Matriks */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200">
            <button
              onClick={() => setPenilaianSubTab('antrean')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                penilaianSubTab === 'antrean'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Antrean Pengumpulan ({filteredSubmissions.length})</span>
            </button>

            <button
              onClick={() => setPenilaianSubTab('bukunilai')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                penilaianSubTab === 'bukunilai'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Buku Nilai Lengkap Kelas</span>
            </button>
          </div>

          {/* SUB-VIEW 1: ANTREAN PENGUMPULAN TUGAS */}
          {penilaianSubTab === 'antrean' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              
              {/* Search & Status Filter */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari siswa atau tugas..."
                      className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 w-48"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="py-1.5 px-3 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-700"
                  >
                    <option value="all">Semua Status</option>
                    <option value="Dikirim">Belum Dinilai (Menunggu)</option>
                    <option value="Dinilai">Sudah Dinilai</option>
                  </select>
                </div>

                <span className="text-xs text-slate-500">
                  Menampilkan {filteredSubmissions.length} pengumpulan
                </span>
              </div>

              {/* Table of submissions */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4 w-12 text-center">No</th>
                      <th className="py-3 px-4">Siswa & Kelas</th>
                      <th className="py-3 px-4">Judul Tugas</th>
                      <th className="py-3 px-4">Jawaban / Berkas Siswa</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Nilai</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                          Tidak ada kiriman tugas yang ditemukan untuk filter kelas ini.
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub, idx) => {
                        const student = users.find((u) => String(u.ID_User) === String(sub.ID_Student));
                        const task = assignments.find((a) => String(a.ID_Assignment) === String(sub.ID_Assignment));
                        const grade = grades.find((g) => String(g.ID_Submission) === String(sub.ID_Submission));

                        return (
                          <tr key={sub.ID_Submission} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 text-center text-slate-400 font-mono">
                              {idx + 1}
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={student?.Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                                  alt=""
                                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                                />
                                <div>
                                  <p className="font-bold text-slate-900 text-xs sm:text-sm">
                                    {student?.Nama || 'Siswa'}
                                  </p>
                                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    Kelas {student?.Kelas || '-'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-800 line-clamp-1 max-w-xs">
                                {task?.Judul_Tugas || 'Tugas PAI'}
                              </p>
                              <p className="text-[11px] text-slate-400">{sub.Tanggal_Kirim}</p>
                            </td>

                            <td className="py-3 px-4 max-w-xs">
                              <p className="text-xs text-slate-700 font-mono line-clamp-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                {sub.Link_Tugas}
                              </p>
                              {sub.Lampiran_File_Siswa && (
                                <span className="text-[10px] text-blue-600 font-semibold mt-1 inline-flex items-center gap-1">
                                  📎 File: {sub.Lampiran_Nama_File || 'Berkas Lampiran'}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-center">
                              {sub.Status === 'Dinilai' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  ✓ Dinilai
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                  ⏱ Perlu Dinilai
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-center">
                              {grade ? (
                                <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  {grade.Nilai}
                                </span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleOpenGradingModal(sub)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                  sub.Status === 'Dinilai'
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                                }`}
                              >
                                {sub.Status === 'Dinilai' ? 'Ubah Nilai' : 'Beri Nilai'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: BUKU NILAI LENGKAP KELAS (GRADEBOOK MATRIX) */}
          {penilaianSubTab === 'bukunilai' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Matriks Buku Nilai: {filterKelas === 'all' ? 'Seluruh Siswa (Semua Kelas)' : `Kelas ${filterKelas}`}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Standar Kriteria Ketercapaian Tujuan Pembelajaran (KKTP): 75
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Rekap Nilai</span>
                </button>
              </div>

              {/* Gradebook Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4 w-10 text-center">No</th>
                      <th className="py-3 px-4 min-w-[160px]">Nama Siswa</th>
                      <th className="py-3 px-4">Kelas</th>
                      {assignments
                        .filter((a) => filterKelas === 'all' || !a.Target_Kelas || a.Target_Kelas === 'Semua Kelas' || a.Target_Kelas === filterKelas)
                        .map((task) => (
                          <th key={task.ID_Assignment} className="py-3 px-3 text-center min-w-[120px]">
                            <span className="block truncate max-w-[120px]" title={task.Judul_Tugas}>
                              {task.Judul_Tugas}
                            </span>
                            <span className="text-[10px] font-normal text-slate-400">({task.Bobot_Nilai || 0}%)</span>
                          </th>
                        ))}
                      <th className="py-3 px-4 text-center bg-emerald-50 text-emerald-950 font-black">
                        Rata-rata
                      </th>
                      <th className="py-3 px-4 text-center">Status KKTP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {students
                      .filter((std) => filterKelas === 'all' || std.Kelas === filterKelas)
                      .map((std, idx) => {
                        const classTasks = assignments.filter(
                          (a) => filterKelas === 'all' || !a.Target_Kelas || a.Target_Kelas === 'Semua Kelas' || a.Target_Kelas === filterKelas
                        );

                        const studentGrades = classTasks.map((task) => {
                          const sub = submissions.find(
                            (s) => String(s.ID_Student) === String(std.ID_User) && String(s.ID_Assignment) === String(task.ID_Assignment)
                          );
                          if (!sub) return null;
                          const gr = grades.find((g) => String(g.ID_Submission) === String(sub.ID_Submission));
                          return gr ? gr.Nilai : null;
                        });

                        const numericScores = studentGrades.filter((s): s is number => s !== null);
                        const avg =
                          numericScores.length > 0
                            ? Math.round(numericScores.reduce((a, b) => a + b, 0) / numericScores.length)
                            : 0;

                        return (
                          <tr key={std.ID_User} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 text-center font-mono text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {std.Nama}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                                {std.Kelas}
                              </span>
                            </td>

                            {classTasks.map((task, tIdx) => {
                              const score = studentGrades[tIdx];
                              return (
                                <td key={task.ID_Assignment} className="py-3 px-3 text-center">
                                  {score !== null ? (
                                    <span
                                      className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                                        score >= 85
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : score >= 75
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}
                                    >
                                      {score}
                                    </span>
                                  ) : (
                                    <span className="text-slate-300 text-xs">-</span>
                                  )}
                                </td>
                              );
                            })}

                            <td className="py-3 px-4 text-center font-black text-sm bg-emerald-50/60 text-emerald-950">
                              {avg > 0 ? avg : '-'}
                            </td>

                            <td className="py-3 px-4 text-center">
                              {avg >= 75 ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  TUNTAS
                                </span>
                              ) : avg > 0 ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  REMEDIAL
                                </span>
                              ) : (
                                <span className="text-slate-400 text-xs">Belum Ada Nilai</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PREVIEW BACA MATERI PAI */}
      {/* ========================================================================= */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  {previewMaterial.Aspek_PAI} • Bab {previewMaterial.Bab}
                </span>
                <h3 className="font-extrabold text-base sm:text-lg">
                  {previewMaterial.Judul_Materi || previewMaterial.Judul_Bab}
                </h3>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm leading-relaxed">
              {(() => {
                let parsed: MaterialContent = { ringkasan: '', poinPenting: [] };
                try {
                  parsed = JSON.parse(previewMaterial.Konten);
                } catch {
                  parsed = { ringkasan: previewMaterial.Konten, poinPenting: [] };
                }

                return (
                  <div className="space-y-5">
                    {previewMaterial.Target_Kompetensi && (
                      <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <strong>Target Capaian Pembelajaran:</strong> {previewMaterial.Target_Kompetensi}
                        </div>
                      </div>
                    )}

                    {/* Direct Media Embed (Google Drive & YouTube) */}
                    <MediaEmbedViewer
                      videoUrl={previewMaterial.Video_Url || parsed.videoUrl}
                      videoTitle={parsed.videoTitle || previewMaterial.Judul_Materi}
                      videoList={parsed.videoList}
                      pdfUrl={previewMaterial.Pdf_Url || parsed.pdfUrl}
                      pdfName={previewMaterial.Pdf_Nama || parsed.pdfName}
                      googleDriveLink={previewMaterial.Drive_Url || parsed.googleDriveLink}
                      googleDriveTitle={previewMaterial.Drive_Nama || parsed.googleDriveTitle || previewMaterial.Judul_Materi}
                    />

                    {parsed.catatanGuru && (
                      <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs">
                        <strong>Pesan Guru Pengampu:</strong> {parsed.catatanGuru}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT MATERI PAI */}
      {/* ========================================================================= */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">
                  {editingMaterial ? 'Edit Materi PAI' : 'Buat Materi PAI Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsMaterialModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterialSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Bab:</label>
                  <select
                    value={matBab}
                    onChange={(e) => setMatBab(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((b) => (
                      <option key={b} value={b}>Bab {b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Aspek PAI:</label>
                  <select
                    value={matAspek}
                    onChange={(e) => setMatAspek(e.target.value as AspekPAI)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    {ASPEK_PAI_LIST.map((asp) => (
                      <option key={asp.name} value={asp.name}>{asp.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Kelas:</label>
                  <select
                    value={matTargetKelas}
                    onChange={(e) => setMatTargetKelas(e.target.value)}
                    className="w-full p-2.5 bg-purple-50 border border-purple-300 rounded-xl font-bold text-purple-950 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Semua Kelas">🌐 Semua Kelas (Terbuka)</option>
                    {classes.map((c) => (
                      <option key={c.ID_Kelas} value={c.Nama_Kelas}>
                        🎯 Khusus Kelas {c.Nama_Kelas}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Bab Lengkap:</label>
                <input
                  type="text"
                  value={matJudulBab}
                  onChange={(e) => setMatJudulBab(e.target.value)}
                  placeholder="Contoh: Bab 1: Al-Qur'an dan Sunnah Sebagai Pedoman Hidup"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Pokok Materi PAI <span className="text-rose-500">*</span>:</label>
                <input
                  type="text"
                  value={matJudulMateri}
                  onChange={(e) => setMatJudulMateri(e.target.value)}
                  placeholder="Contoh: Slide Pembahasan Materi & Video Penjelasan PAI"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Capaian Pembelajaran / Deskripsi Singkat:</label>
                <input
                  type="text"
                  value={matKompetensi}
                  onChange={(e) => setMatKompetensi(e.target.value)}
                  placeholder="Contoh: Memahami materi melalui tayangan slide dan video pembelajaran..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              {/* Media Attachments Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Sumber Belajar Media (Google Drive & YouTube)
                  </h4>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-blue-900 mb-1 flex items-center justify-between">
                    <span>🔗 Link Google Drive (Slide Presentasi PPT / Dokumen / PDF):</span>
                    <span className="text-[10px] text-blue-600 font-semibold">Langsung terbuka di siswa</span>
                  </label>
                  <input
                    type="url"
                    value={matDriveLink}
                    onChange={(e) => setMatDriveLink(e.target.value)}
                    placeholder="https://docs.google.com/presentation/... atau https://drive.google.com/..."
                    className="w-full p-2.5 bg-white border border-blue-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    💡 Rekomendasi: Masukkan link Google Slides (PPT), Google Docs, atau file PDF Google Drive. Pastikan izin akses diset "Siapa saja yang memiliki link".
                  </p>
                </div>

                {/* Dynamic Multiple YouTube Videos Section */}
                <div className="p-3.5 bg-rose-50/60 border border-rose-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-rose-950 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-rose-600" />
                      <span>🎬 Link Video YouTube ({matVideoList.length} Video):</span>
                    </label>
                    <span className="text-[10px] text-rose-700 font-semibold">
                      Bisa tambah lebih dari 1 video
                    </span>
                  </div>

                  <div className="space-y-3">
                    {matVideoList.map((vid, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white border border-rose-200 rounded-xl shadow-2xs space-y-2 relative"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-rose-900 flex items-center gap-1">
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-black">
                              {idx + 1}
                            </span>
                            <span>Video YouTube #{idx + 1}</span>
                          </span>

                          {matVideoList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setMatVideoList((prev) => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1 text-[10px] font-semibold"
                              title="Hapus video ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                              URL Video YouTube:
                            </label>
                            <input
                              type="url"
                              value={vid.url}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMatVideoList((prev) => {
                                  const next = [...prev];
                                  next[idx] = { ...next[idx], url: val };
                                  return next;
                                });
                              }}
                              placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:ring-2 focus:ring-rose-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                              Judul / Keterangan Video:
                            </label>
                            <input
                              type="text"
                              value={vid.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMatVideoList((prev) => {
                                  const next = [...prev];
                                  next[idx] = { ...next[idx], title: val };
                                  return next;
                                });
                              }}
                              placeholder={`Contoh: ${idx === 0 ? 'Pengantar Materi' : idx === 1 ? 'Praktik & Contoh Kasus' : 'Video Pembelajaran ' + (idx + 1)}`}
                              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-rose-400"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Button to add more YouTube video links */}
                  <button
                    type="button"
                    onClick={() => {
                      setMatVideoList((prev) => [
                        ...prev,
                        { url: '', title: `Video ${prev.length + 1}` },
                      ]);
                    }}
                    className="w-full py-2.5 px-3 bg-white hover:bg-rose-50 border border-dashed border-rose-300 hover:border-rose-400 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-4 h-4 text-rose-600" />
                    <span>+ Tambah Link Video YouTube Lainnya</span>
                  </button>

                  <p className="text-[10px] text-rose-900/70">
                    💡 Semua video yang ditambahkan akan dapat dipilih dan ditonton oleh siswa langsung di halaman materi dengan pemutar video interaktif.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    📄 Link Modul / PDF Tambahan (Opsional):
                  </label>
                  <input
                    type="url"
                    value={matPdfUrl}
                    onChange={(e) => setMatPdfUrl(e.target.value)}
                    placeholder="https://... / file.pdf"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pesan / Instruksi Guru untuk Siswa (Opsional):</label>
                <textarea
                  value={matCatatanGuru}
                  onChange={(e) => setMatCatatanGuru(e.target.value)}
                  placeholder="Contoh: Silakan pelajari slide presentasi dan tonton video penjelasan sampai selesai sebelum mengerjakan tugas..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingMat}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingMat ? 'Menyimpan...' : 'Simpan Materi PAI'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT TUGAS PAI */}
      {/* ========================================================================= */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-teal-900 to-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-300" />
                <h3 className="font-bold text-base">
                  {editingAssignment ? 'Edit Tugas / LKPD PAI' : 'Buat Penugasan PAI Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsAssignmentModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignmentSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Materi Terkait:</label>
                  <select
                    value={taskMaterialId}
                    onChange={(e) => setTaskMaterialId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    {materials.map((m) => (
                      <option key={m.ID_Material} value={m.ID_Material}>
                        Bab {m.Bab}: {m.Judul_Materi || m.Judul_Bab}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Tugas:</label>
                  <select
                    value={taskKategori}
                    onChange={(e) => setTaskKategori(e.target.value as KategoriTugas)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    {KATEGORI_TUGAS_OPTIONS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Kelas:</label>
                  <select
                    value={taskTargetKelas}
                    onChange={(e) => setTaskTargetKelas(e.target.value)}
                    className="w-full p-2.5 bg-purple-50 border border-purple-300 rounded-xl font-bold text-purple-950"
                  >
                    <option value="Semua Kelas">🌐 Semua Kelas (Terbuka)</option>
                    {classes.map((c) => (
                      <option key={c.ID_Kelas} value={c.Nama_Kelas}>
                        🎯 Khusus Kelas {c.Nama_Kelas}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Tugas / LKPD <span className="text-rose-500">*</span>:</label>
                <input
                  type="text"
                  value={taskJudul}
                  onChange={(e) => setTaskJudul(e.target.value)}
                  placeholder="Contoh: Tugas 1: Rekaman Tilawah Q.S. An-Nisa 59 & Analisis Tajwid"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bobot Nilai (%):</label>
                  <input
                    type="number"
                    value={taskWeight}
                    onChange={(e) => setTaskWeight(Number(e.target.value))}
                    min={5}
                    max={100}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tenggat Waktu (Deadline):</label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Tugas & Soal:</label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Jelaskan instruksi tugas yang harus dikerjakan siswa..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Petunjuk Pengumpulan Bagi Siswa:</label>
                <textarea
                  value={taskGuidance}
                  onChange={(e) => setTaskGuidance(e.target.value)}
                  placeholder="Contoh: Unggah file PDF atau cantumkan tautan Google Drive publik..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              {/* Attachments for Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lampiran File LKPD (PDF Link):</label>
                  <input
                    type="url"
                    value={taskPdfUrl}
                    onChange={(e) => setTaskPdfUrl(e.target.value)}
                    placeholder="https://.../lkpd.pdf"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Template Tugas (Google Docs / Drive):</label>
                  <input
                    type="url"
                    value={taskDriveLink}
                    onChange={(e) => setTaskDriveLink(e.target.value)}
                    placeholder="https://docs.google.com/..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignmentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingTask}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingTask ? 'Menyimpan...' : 'Simpan Tugas PAI'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FORM PENILAIAN GURU (GRADING) */}
      {/* ========================================================================= */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Penilaian Tugas Siswa</h3>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGradeSubmit} className="p-6 space-y-4 text-xs">
              {(() => {
                const std = users.find((u) => String(u.ID_User) === String(gradingSubmission.ID_Student));
                const task = assignments.find((a) => String(a.ID_Assignment) === String(gradingSubmission.ID_Assignment));

                return (
                  <>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{std?.Nama}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Kelas {std?.Kelas}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Tugas: {task?.Judul_Tugas}</p>
                    </div>

                    {/* Student Submission Content */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-700">Tautan / Jawaban Siswa:</label>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs whitespace-pre-wrap max-h-36 overflow-y-auto">
                        {gradingSubmission.Link_Tugas}
                      </div>

                      {gradingSubmission.Link_Tugas.startsWith('http') && (
                        <a
                          href={gradingSubmission.Link_Tugas.split('\n')[0]}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold hover:underline mt-1"
                        >
                          <span>Buka Tautan Tugas di Tab Baru</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Student Note */}
                    {gradingSubmission.Catatan_Siswa && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                        <strong>Catatan Siswa:</strong> "{gradingSubmission.Catatan_Siswa}"
                      </div>
                    )}

                    {/* Nilai Input */}
                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                      <div className="col-span-1">
                        <label className="block font-bold text-slate-700 mb-1">
                          Nilai (0 - 100) <span className="text-rose-500">*</span>:
                        </label>
                        <input
                          type="number"
                          value={inputNilai}
                          onChange={(e) => setInputNilai(Number(e.target.value))}
                          min={0}
                          max={100}
                          className="w-full p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl font-black text-lg text-emerald-950 text-center"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Catatan Masukan / Ulasan Guru:
                        </label>
                        <textarea
                          value={inputCatatanGuru}
                          onChange={(e) => setInputCatatanGuru(e.target.value)}
                          placeholder="Beri apresiasi atau koreksi tajwid / materi..."
                          rows={2}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setGradingSubmission(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingGrade}
                        className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingGrade ? 'Menyimpan...' : 'Simpan Nilai'}</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Edit Profile & Foto Profil Guru Pengampu */}
      {/* ========================================================================= */}
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onSaveUser={onSaveUser}
        showToast={showToast}
      />

    </div>
  );
};
