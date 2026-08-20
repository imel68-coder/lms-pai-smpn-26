export type Role = 'Siswa' | 'Guru';

export type AspekPAI = 'Al-Qur\'an Hadis' | 'Akidah' | 'Akhlak' | 'Fikih' | 'Sejarah Kebudayaan Islam (SKI)';

export type KategoriTugas = 'LKPD / Tugas Mandiri' | 'Praktik Ibadah & Tilawah' | 'Diskusi Kelompok' | 'Proyek Aksi & Karakter' | 'Uji Kompetensi / Kuis';

export interface ClassRoom {
  ID_Kelas: string;
  Nama_Kelas: string; // e.g. "VII-A", "VII-B", "VIII-A", "IX-A"
  Tingkat: number; // 7, 8, 9
  Wali_Kelas?: string;
  Tahun_Ajaran?: string;
  Keterangan?: string;
}

export interface User {
  ID_User: string;
  Nama: string;
  Email: string;
  Password?: string;
  Role: Role;
  Kelas: string; // e.g. "VII-A", "VII-B", "Guru PAI"
  Avatar?: string;
  NIS?: string;
  NISN?: string;
}

export interface AyatDalil {
  surah: string;
  arab: string;
  arti: string;
}

export interface VideoItem {
  id?: string;
  url: string;
  title?: string;
}

export interface MaterialContent {
  ayatDalil?: AyatDalil;
  ringkasan: string;
  poinPenting: string[];
  catatanGuru?: string;
  videoUrl?: string;
  videoTitle?: string;
  videoList?: VideoItem[];
  pdfUrl?: string;
  pdfName?: string;
  googleDriveLink?: string;
  googleDriveTitle?: string;
}

export interface Material {
  ID_Material: string;
  Bab: number;
  Judul_Bab: string;
  Judul_Materi: string;
  Aspek_PAI: AspekPAI;
  Target_Kelas: string; // 'Semua Kelas' or 'VII-A', 'VII-B', etc.
  Deskripsi_Singkat?: string;
  Konten: string; // JSON string of MaterialContent or plain text
  Target_Kompetensi?: string;
  Video_Url?: string;
  Pdf_Url?: string;
  Pdf_Nama?: string;
  Drive_Url?: string;
  Drive_Nama?: string;
  Tanggal_Dibuat?: string;
}

export interface Assignment {
  ID_Assignment: string;
  ID_Material: string;
  Judul_Tugas: string;
  Kategori: KategoriTugas;
  Deskripsi_Tugas: string;
  Petunjuk_Pengerjaan?: string;
  Bobot_Nilai?: number; // percentage e.g. 20, 30
  Deadline?: string;
  Target_Kelas: string; // 'Semua Kelas' or 'VII-A', 'VII-B', etc.
  // Lampiran dari Guru
  Lampiran_PDF?: string;
  Lampiran_PDF_Nama?: string;
  Lampiran_Drive?: string;
  Lampiran_Drive_Nama?: string;
  Lampiran_Video?: string;
  Lampiran_Video_Judul?: string;
  Tanggal_Dibuat?: string;
}

export interface Submission {
  ID_Submission: string;
  ID_Assignment: string;
  ID_Student: string;
  Link_Tugas: string; // URL Link or text answer
  Catatan_Siswa?: string;
  Lampiran_File_Siswa?: string;
  Lampiran_Nama_File?: string;
  Status: 'Dikirim' | 'Dinilai';
  Tanggal_Kirim: string;
}

export interface Grade {
  ID_Grade: string;
  ID_Submission: string;
  ID_Student: string;
  ID_Assignment: string;
  Nilai: number; // 0-100
  Catatan_Guru: string;
  Tanggal_Nilai?: string;
  Nama_Penilai?: string;
}

export interface BabProgress {
  bab: number;
  judul: string;
  totalAssignments: number;
  completedAssignments: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  scoreAverage?: number;
}

export interface Reflection {
  ID_Reflection: string;
  ID_Material: string;
  ID_Student: string;
  Poin_Penting?: string; // Poin-poin penting yang dipelajari
  Kesimpulan: string; // Kesimpulan atau refleksi siswa
  Hal_Disukai?: string; // Hal paling menarik/bermanfaat
  Pertanyaan_Siswa?: string; // Hal yang masih belum dipahami/ingin ditanyakan ke guru
  Tanggapan_Guru?: string; // Komentar/apresiasi dari guru
  Tanggal_Dibuat: string;
  Tanggal_Diperbarui?: string;
}

export interface AppStateData {
  users: User[];
  classes: ClassRoom[];
  materials: Material[];
  assignments: Assignment[];
  submissions: Submission[];
  grades: Grade[];
  reflections?: Reflection[];
}

export interface GasApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}
