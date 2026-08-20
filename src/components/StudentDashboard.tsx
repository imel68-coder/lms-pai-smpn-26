import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Send, 
  ExternalLink, 
  Award, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  ChevronRight, 
  Download, 
  Upload, 
  Sparkles, 
  FileCheck, 
  ShieldCheck, 
  MessageSquare, 
  Video, 
  HardDrive,
  Layers,
  GraduationCap
} from 'lucide-react';
import { 
  User, 
  Material, 
  Assignment, 
  Submission, 
  Grade, 
  BabProgress, 
  MaterialContent, 
  AspekPAI,
  Reflection
} from '../types';
import { ASPEK_PAI_LIST } from '../data/gasCode';
import { MediaEmbedViewer } from './MediaEmbedViewer';
import { StudentReflectionSection } from './StudentReflectionSection';

interface StudentDashboardProps {
  student: User;
  materials: Material[];
  assignments: Assignment[];
  submissions: Submission[];
  grades: Grade[];
  reflections?: Reflection[];
  progression: Record<number, BabProgress>;
  onSubmitAssignment: (payload: {
    ID_Assignment: string;
    ID_Student: string;
    Link_Tugas: string;
    Catatan_Siswa?: string;
  }) => Promise<void>;
  onSaveReflection?: (payload: {
    ID_Material: string;
    ID_Student: string;
    Poin_Penting?: string;
    Kesimpulan: string;
    Hal_Disukai?: string;
    Pertanyaan_Siswa?: string;
  }) => Promise<void>;
  activeView: 'dashboard' | 'gradebook';
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  materials,
  assignments,
  submissions,
  grades,
  reflections = [],
  progression,
  onSubmitAssignment,
  onSaveReflection,
  activeView,
}) => {
  // Filter materials and assignments accessible to this student's class (or 'Semua Kelas')
  const studentMaterials = React.useMemo(() => {
    return materials.filter(
      (m) => !m.Target_Kelas || m.Target_Kelas === 'Semua Kelas' || m.Target_Kelas === 'Semua' || m.Target_Kelas === student.Kelas
    );
  }, [materials, student.Kelas]);

  const studentAssignments = React.useMemo(() => {
    return assignments.filter(
      (a) => !a.Target_Kelas || a.Target_Kelas === 'Semua Kelas' || a.Target_Kelas === 'Semua' || a.Target_Kelas === student.Kelas
    );
  }, [assignments, student.Kelas]);

  // Selected Bab
  const babNumbers: number[] = Array.from(new Set<number>(materials.map((m) => Number(m.Bab)))).sort((a: number, b: number) => a - b);
  const [selectedBab, setSelectedBab] = useState<number>(babNumbers[0] || 1);

  // Selected Material ID (defaults to first material in selected Bab)
  const materialsInBab = studentMaterials.filter((m) => Number(m.Bab) === selectedBab);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    materialsInBab[0]?.ID_Material || studentMaterials[0]?.ID_Material || 'MAT-01'
  );

  // Active Material object
  const currentMaterial =
    studentMaterials.find((m) => m.ID_Material === selectedMaterialId) ||
    materialsInBab[0] ||
    studentMaterials[0];

  // Assignments associated with current Material
  const currentAssignments = studentAssignments.filter(
    (a) => String(a.ID_Material) === String(currentMaterial?.ID_Material)
  );

  // Submission Form State for active selected assignment
  const [activeTaskToSubmit, setActiveTaskToSubmit] = useState<Assignment | null>(null);
  const [taskAnswer, setTaskAnswer] = useState<string>('');
  const [studentNotes, setStudentNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Parse current material content
  let parsedContent: MaterialContent = { ringkasan: '', poinPenting: [] };
  if (currentMaterial) {
    try {
      parsedContent = JSON.parse(currentMaterial.Konten);
    } catch {
      parsedContent = { ringkasan: currentMaterial.Konten, poinPenting: [] };
    }
  }

  // Handle assignment submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTaskToSubmit) return;

    if (!taskAnswer.trim()) {
      alert('Silakan tulis jawaban atau lampirkan link tugas Anda terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccessMsg(null);

    await onSubmitAssignment({
      ID_Assignment: activeTaskToSubmit.ID_Assignment,
      ID_Student: student.ID_User,
      Link_Tugas: taskAnswer.trim(),
      Catatan_Siswa: studentNotes.trim(),
    });

    setIsSubmitting(false);
    setSubmitSuccessMsg('Tugas PAI berhasil dikirim ke guru pengampu!');
    setTaskAnswer('');
    setStudentNotes('');
    setTimeout(() => {
      setActiveTaskToSubmit(null);
      setSubmitSuccessMsg(null);
    }, 1500);
  };

  // Student global stats
  const studentSubmissions = submissions.filter((s) => String(s.ID_Student) === String(student.ID_User));
  const studentGrades = grades.filter((g) => String(g.ID_Student) === String(student.ID_User));
  const avgScore =
    studentGrades.length > 0
      ? Math.round(studentGrades.reduce((acc, curr) => acc + Number(curr.Nilai || 0), 0) / studentGrades.length)
      : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Student Profile & Progress Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={student.Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={student.Nama}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-emerald-400/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-400 text-emerald-950">
                  Kelas {student.Kelas}
                </span>
                {(student.NIS || student.NISN) && (
                  <span className="text-xs text-emerald-200 font-mono">
                    NIS: {student.NIS || student.NISN}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight mt-1 text-white">
                {student.Nama}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80">
                Pendidikan Agama Islam & Budi Pekerti • Pembelajaran Berbasis Kelas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/50">
              <p className="text-[10px] text-emerald-300 font-medium">Materi Kelas</p>
              <p className="text-lg font-black text-white">{studentMaterials.length}</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/50">
              <p className="text-[10px] text-emerald-300 font-medium">Tugas Selesai</p>
              <p className="text-lg font-black text-white">{studentSubmissions.length} / {studentAssignments.length}</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/50">
              <p className="text-[10px] text-amber-300 font-medium">Rata-rata Nilai</p>
              <p className="text-lg font-black text-amber-300">{avgScore > 0 ? avgScore : '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: MATERI & TUGAS PEMBELAJARAN PAI */}
      {/* ========================================================================= */}
      {activeView === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (4 cols): Bab & Materials Navigation List */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Bab Selector Pills */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                Pilih Bab Pembelajaran PAI
              </h3>

              <div className="space-y-1.5">
                {babNumbers.map((bNum) => {
                  const bMaterials = studentMaterials.filter((m) => Number(m.Bab) === bNum);
                  const firstMat = bMaterials[0] || materials.find((m) => Number(m.Bab) === bNum);
                  const isSelected = selectedBab === bNum;

                  return (
                    <button
                      key={bNum}
                      onClick={() => {
                        setSelectedBab(bNum);
                        if (bMaterials.length > 0) {
                          setSelectedMaterialId(bMaterials[0].ID_Material);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-emerald-800 text-white shadow-md'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isSelected
                              ? 'bg-emerald-700 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {bNum}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold truncate">
                            {firstMat?.Judul_Bab.replace(/^Bab \d+:\s*/, '') || `Bab ${bNum}`}
                          </p>
                          <p className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                            {bMaterials.length} Materi Pembelajaran
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-0.5' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of Materials inside the selected Bab */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Materi di Bab {selectedBab}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {materialsInBab.length} Topik
                </span>
              </div>

              <div className="space-y-2">
                {materialsInBab.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Belum ada materi untuk kelas ini di Bab {selectedBab}.
                  </p>
                ) : (
                  materialsInBab.map((mat) => {
                    const isCurrent = currentMaterial?.ID_Material === mat.ID_Material;
                    const tasksForMat = studentAssignments.filter((a) => String(a.ID_Material) === String(mat.ID_Material));

                    return (
                      <button
                        key={mat.ID_Material}
                        onClick={() => setSelectedMaterialId(mat.ID_Material)}
                        className={`w-full text-left p-3 rounded-2xl transition-all border ${
                          isCurrent
                            ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50/70 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-emerald-800">
                            {mat.Aspek_PAI}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {(() => {
                              try {
                                const p = JSON.parse(mat.Konten);
                                const vCount = p.videoList?.length || (mat.Video_Url ? 1 : 0);
                                if (vCount > 1) {
                                  return (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                                      {vCount} Video
                                    </span>
                                  );
                                }
                              } catch {}
                              return null;
                            })()}
                            {tasksForMat.length > 0 && (
                              <span className="text-[10px] font-semibold text-slate-500">
                                {tasksForMat.length} Tugas
                              </span>
                            )}
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-2">
                          {mat.Judul_Materi || mat.Judul_Bab}
                        </h4>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Right Column (8 cols): Active Material Content & Task Section */}
          <div className="lg:col-span-8 space-y-6">
            
            {currentMaterial ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                
                {/* Material Header */}
                <div className="p-6 border-b border-slate-200 bg-slate-50/80">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Bab {currentMaterial.Bab} • {currentMaterial.Aspek_PAI}
                    </span>
                    {currentMaterial.Target_Kelas && currentMaterial.Target_Kelas !== 'Semua Kelas' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                        🎯 Khusus Kelas {currentMaterial.Target_Kelas}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {currentMaterial.Judul_Materi || currentMaterial.Judul_Bab}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {currentMaterial.Judul_Bab}
                  </p>

                  {currentMaterial.Target_Kompetensi && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Target Capaian Pembelajaran:</strong> {currentMaterial.Target_Kompetensi}
                      </div>
                    </div>
                  )}
                </div>

                {/* Material Body: Directly Display the Embedded Media (Google Drive / YouTube / PDF) */}
                <div className="p-6 space-y-5 text-slate-800 text-xs sm:text-sm leading-relaxed">
                  
                  {/* Media Embeds (Direct Interactive Google Drive Viewer & YouTube Video Player) */}
                  <MediaEmbedViewer
                    videoUrl={currentMaterial.Video_Url || parsedContent.videoUrl}
                    videoTitle={parsedContent.videoTitle || currentMaterial.Judul_Materi}
                    videoList={parsedContent.videoList}
                    pdfUrl={currentMaterial.Pdf_Url || parsedContent.pdfUrl}
                    pdfName={currentMaterial.Pdf_Nama || parsedContent.pdfName}
                    googleDriveLink={currentMaterial.Drive_Url || parsedContent.googleDriveLink}
                    googleDriveTitle={currentMaterial.Drive_Nama || parsedContent.googleDriveTitle || currentMaterial.Judul_Materi}
                  />

                  {/* Catatan / Pesan Guru jika ada */}
                  {parsedContent.catatanGuru && (
                    <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-900 block mb-0.5">Pesan & Instruksi Guru Pengampu:</strong>
                        <p className="text-amber-800 leading-relaxed">{parsedContent.catatanGuru}</p>
                      </div>
                    </div>
                  )}

                  {/* Refleksi Peserta Didik (Poin-poin penting & Kesimpulan) */}
                  <StudentReflectionSection
                    materialId={currentMaterial.ID_Material}
                    studentId={student.ID_User}
                    materialTitle={currentMaterial.Judul_Materi || currentMaterial.Judul_Bab}
                    existingReflection={reflections.find(
                      (r) => String(r.ID_Material) === String(currentMaterial.ID_Material) && String(r.ID_Student) === String(student.ID_User)
                    )}
                    onSaveReflection={async (payload) => {
                      if (onSaveReflection) {
                        await onSaveReflection(payload);
                      }
                    }}
                  />

                </div>

                {/* Associated Assignments Section */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-700" />
                      <span>Lembar Kerja (LKPD) & Penugasan Materi ({currentAssignments.length})</span>
                    </h3>
                  </div>

                  {currentAssignments.length === 0 ? (
                    <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                      Tidak ada tugas khusus pada materi ini. Silakan tonton video dan pelajari materi presentasi Google Drive di atas.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentAssignments.map((task) => {
                        const sub = submissions.find(
                          (s) => String(s.ID_Assignment) === String(task.ID_Assignment) && String(s.ID_Student) === String(student.ID_User)
                        );
                        const gr = sub ? grades.find((g) => String(g.ID_Submission) === String(sub.ID_Submission)) : undefined;

                        return (
                          <div
                            key={task.ID_Assignment}
                            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                    {task.Kategori}
                                  </span>
                                  <span className="text-[11px] text-slate-400">
                                    Bobot: {task.Bobot_Nilai || 20}% • Batas: {task.Deadline || 'Fleksibel'}
                                  </span>
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm">
                                  {task.Judul_Tugas}
                                </h4>
                              </div>

                              {/* Status Badge */}
                              <div>
                                {gr ? (
                                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5" />
                                    <span>Nilai: {gr.Nilai}</span>
                                  </span>
                                ) : sub ? (
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Terkirim (Menunggu Penilaian)</span>
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>Belum Dikumpulkan</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {task.Deskripsi_Tugas}
                            </p>

                            {/* Task Attachments if available */}
                            {(task.Lampiran_PDF || task.Lampiran_Drive) && (
                              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                                {task.Lampiran_PDF && (
                                  <a
                                    href={task.Lampiran_PDF}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold flex items-center gap-1.5 transition-all"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Unduh LKPD (PDF)</span>
                                  </a>
                                )}
                                {task.Lampiran_Drive && (
                                  <a
                                    href={task.Lampiran_Drive}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold flex items-center gap-1.5 transition-all"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Buka Template Google Docs</span>
                                  </a>
                                )}
                              </div>
                            )}

                            {/* Feedback from teacher if graded */}
                            {gr && gr.Catatan_Guru && (
                              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-0.5">
                                <span className="font-bold text-emerald-900 block">
                                  💬 Ulasan & Catatan Guru ({gr.Nama_Penilai || 'Guru PAI'}):
                                </span>
                                <p className="italic">"{gr.Catatan_Guru}"</p>
                              </div>
                            )}

                            {/* Submission Button or Details */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              {sub ? (
                                <div className="text-[11px] text-slate-500 font-mono">
                                  Dikirim: {sub.Tanggal_Kirim}
                                </div>
                              ) : (
                                <div className="text-[11px] text-slate-400">
                                  {task.Petunjuk_Pengerjaan || 'Kirimkan tugas Anda tepat waktu.'}
                                </div>
                              )}

                              <button
                                onClick={() => {
                                  setActiveTaskToSubmit(task);
                                  setTaskAnswer(sub?.Link_Tugas || '');
                                  setStudentNotes(sub?.Catatan_Siswa || '');
                                }}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                  sub
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                                }`}
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{sub ? 'Kirim Ulang Jawaban' : 'Kumpulkan Tugas'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
                <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-700">Pilih topik materi pembelajaran di sebelah kiri.</p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: BUKU NILAI SAYA (STUDENT GRADEBOOK) */}
      {/* ========================================================================= */}
      {activeView === 'gradebook' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <span>Buku Nilai & Evaluasi Prestasi Belajar Siswa</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rekapitulasi seluruh tugas PAI, perolehan skor dan catatan ulasan guru pengampu.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Rata-rata Nilai</p>
                <p className="text-2xl font-black text-emerald-950">{avgScore > 0 ? avgScore : '-'}</p>
                <span className="text-[10px] font-semibold text-emerald-700">
                  {avgScore >= 75 ? '✓ TUNTAS (KKTP 75)' : avgScore > 0 ? 'Remedial' : 'Belum Ada Nilai'}
                </span>
              </div>
            </div>

            {/* List of Tasks and Student's Grades */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Tugas / LKPD PAI</th>
                    <th className="py-3 px-4">Materi Terkait</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Nilai</th>
                    <th className="py-3 px-4">Catatan & Masukan Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {studentAssignments.map((task, idx) => {
                    const mat = materials.find((m) => String(m.ID_Material) === String(task.ID_Material));
                    const sub = submissions.find(
                      (s) => String(s.ID_Assignment) === String(task.ID_Assignment) && String(s.ID_Student) === String(student.ID_User)
                    );
                    const gr = sub ? grades.find((g) => String(g.ID_Submission) === String(sub.ID_Submission)) : undefined;

                    return (
                      <tr key={task.ID_Assignment} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center font-mono text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {task.Judul_Tugas}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          Bab {mat?.Bab}: {mat?.Judul_Materi || mat?.Judul_Bab || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {gr ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              ✓ Dinilai
                            </span>
                          ) : sub ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                              ⏱ Dikirim
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              Belum Dikirim
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {gr ? (
                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                                gr.Nilai >= 85
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : gr.Nilai >= 75
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {gr.Nilai}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 italic">
                          {gr?.Catatan_Guru || (sub ? 'Menunggu koreksi guru pengampu...' : '-')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SUBMISSION FORM SISWA */}
      {/* ========================================================================= */}
      {activeTaskToSubmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">Pengumpulan Tugas PAI</h3>
              </div>
              <button
                onClick={() => setActiveTaskToSubmit(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  {activeTaskToSubmit.Kategori}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  {activeTaskToSubmit.Judul_Tugas}
                </h4>
                <p className="text-[11px] text-slate-500">{activeTaskToSubmit.Deskripsi_Tugas}</p>
              </div>

              {submitSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{submitSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Tautan Jawaban / Teks Tugas <span className="text-rose-500">*</span>:
                </label>
                <textarea
                  value={taskAnswer}
                  onChange={(e) => setTaskAnswer(e.target.value)}
                  placeholder="Ketik jawaban tugas atau cantumkan tautan Google Drive / Docs / Video YouTube Anda di sini..."
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 Tips: Jika melampirkan Google Drive, pastikan izin akses tautan diatur ke "Siapa saja yang memiliki link" (Anyone with the link).
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Catatan untuk Guru (Opsional):
                </label>
                <input
                  type="text"
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="Contoh: Mohon koreksi pada bacaan mad jaiz munfashil di ayat ke-2..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTaskToSubmit(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirimkan Sekarang'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
