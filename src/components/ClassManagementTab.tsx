import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowRightLeft, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Search, 
  X, 
  Save, 
  UserPlus, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  School,
  Award,
  Upload,
  Download,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { User, ClassRoom, Material, Assignment, Submission, Grade } from '../types';
import { BulkStudentModal } from './BulkStudentModal';
import { apiService } from '../services/apiService';

interface ClassManagementTabProps {
  classes: ClassRoom[];
  users: User[];
  materials: Material[];
  assignments: Assignment[];
  submissions: Submission[];
  grades: Grade[];
  onSaveClass: (classRoom: ClassRoom) => Promise<void>;
  onDeleteClass: (classId: string) => Promise<void>;
  onSaveUser: (user: User) => Promise<void>;
  onSaveBatchUsers?: (newUsers: User[]) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onDeleteAllStudents?: (targetClass?: string) => Promise<void>;
  onOpenCreateMaterialForClass?: (className: string) => void;
  onOpenCreateAssignmentForClass?: (className: string) => void;
  showToast: (msg: string) => void;
}

export const ClassManagementTab: React.FC<ClassManagementTabProps> = ({
  classes,
  users,
  materials,
  assignments,
  submissions,
  grades,
  onSaveClass,
  onDeleteClass,
  onSaveUser,
  onSaveBatchUsers,
  onDeleteUser,
  onDeleteAllStudents,
  onOpenCreateMaterialForClass,
  onOpenCreateAssignmentForClass,
  showToast,
}) => {
  const students = users.filter((u) => u.Role === 'Siswa');

  // Active selected class for roster table ('all' or specific class name e.g. 'VII-A')
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Bulk Import / Export Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);

  // Delete All Students Modal State
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState<boolean>(false);
  const [deleteAllScope, setDeleteAllScope] = useState<string>('all');
  const [deleteAllConfirmKeyword, setDeleteAllConfirmKeyword] = useState<string>('');
  const [isDeletingAll, setIsDeletingAll] = useState<boolean>(false);

  // Class Modal State
  const [isClassModalOpen, setIsClassModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [inputNamaKelas, setInputNamaKelas] = useState<string>('');
  const [inputTingkat, setInputTingkat] = useState<number>(7);
  const [inputWaliKelas, setInputWaliKelas] = useState<string>('');
  const [inputTahunAjaran, setInputTahunAjaran] = useState<string>('2026/2027');
  const [inputKeterangan, setInputKeterangan] = useState<string>('');
  const [isSavingClass, setIsSavingClass] = useState<boolean>(false);

  // Student Modal State (Add/Edit)
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [inputStudentNama, setInputStudentNama] = useState<string>('');
  const [inputStudentNIS, setInputStudentNIS] = useState<string>('');
  const [inputStudentKelas, setInputStudentKelas] = useState<string>(classes[0]?.Nama_Kelas || 'VII-A');
  const [isSavingStudent, setIsSavingStudent] = useState<boolean>(false);

  // Transfer Student Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [transferringStudent, setTransferringStudent] = useState<User | null>(null);
  const [targetTransferClass, setTargetTransferClass] = useState<string>('');

  // Delete Confirm Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'class' | 'student';
    id: string;
    name: string;
  } | null>(null);

  // Export CSV Action
  const handleTriggerExportCsv = (targetClassName: string) => {
    const csvContent = apiService.exportStudentsCsv(targetClassName, {
      users,
      classes,
      materials,
      assignments,
      submissions,
      grades,
      reflections: [],
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileSuffix = targetClassName === 'all' ? 'Semua_Kelas' : `Kelas_${targetClassName}`;
    link.download = `Data_Roster_Siswa_PAI_${fileSuffix}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Data siswa (${targetClassName === 'all' ? 'Semua Kelas' : 'Kelas ' + targetClassName}) berhasil diekspor!`);
  };

  // Open Class Create/Edit Modal
  const handleOpenClassModal = (cls?: ClassRoom) => {
    if (cls) {
      setEditingClass(cls);
      setInputNamaKelas(cls.Nama_Kelas);
      setInputTingkat(cls.Tingkat || 7);
      setInputWaliKelas(cls.Wali_Kelas || '');
      setInputTahunAjaran(cls.Tahun_Ajaran || '2026/2027');
      setInputKeterangan(cls.Keterangan || '');
    } else {
      setEditingClass(null);
      setInputNamaKelas('');
      setInputTingkat(7);
      setInputWaliKelas('');
      setInputTahunAjaran('2026/2027');
      setInputKeterangan('');
    }
    setIsClassModalOpen(true);
  };

  // Save Class Submit
  const handleSaveClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNamaKelas.trim()) {
      showToast('Nama kelas tidak boleh kosong!');
      return;
    }

    setIsSavingClass(true);
    const newClass: ClassRoom = {
      ID_Kelas: editingClass?.ID_Kelas || 'KLS-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      Nama_Kelas: inputNamaKelas.trim().toUpperCase(),
      Tingkat: Number(inputTingkat) || 7,
      Wali_Kelas: inputWaliKelas.trim(),
      Tahun_Ajaran: inputTahunAjaran.trim(),
      Keterangan: inputKeterangan.trim(),
    };

    await onSaveClass(newClass);
    setIsSavingClass(false);
    setIsClassModalOpen(false);
  };

  // Open Student Create/Edit Modal
  const handleOpenStudentModal = (std?: User, presetKelas?: string) => {
    if (std) {
      setEditingStudent(std);
      setInputStudentNama(std.Nama);
      setInputStudentNIS(std.NIS || std.NISN || '');
      setInputStudentKelas(std.Kelas);
    } else {
      setEditingStudent(null);
      setInputStudentNama('');
      setInputStudentNIS('');
      setInputStudentKelas(presetKelas || (selectedClassFilter !== 'all' ? selectedClassFilter : (classes[0]?.Nama_Kelas || 'VII-A')));
    }
    setIsStudentModalOpen(true);
  };

  // Save Student Submit
  const handleSaveStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputStudentNama.trim()) {
      showToast('Nama siswa wajib diisi!');
      return;
    }

    setIsSavingStudent(true);
    const cleanName = inputStudentNama.trim();
    const cleanNIS = inputStudentNIS.trim();
    const generatedEmailSlug = cleanNIS || cleanName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) || 'siswa';
    const autoEmail = editingStudent?.Email || `${generatedEmailSlug}@siswa.belajar.id`;

    const newUser: User = {
      ID_User: editingStudent?.ID_User || 'USR-SISWA-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      Nama: cleanName,
      Email: autoEmail,
      NIS: cleanNIS,
      NISN: cleanNIS,
      Password: editingStudent?.Password || 'siswa123',
      Role: 'Siswa',
      Kelas: inputStudentKelas,
      Avatar: editingStudent?.Avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
    };

    await onSaveUser(newUser);
    setIsSavingStudent(false);
    setIsStudentModalOpen(false);
    showToast(`Data siswa ${cleanName} berhasil disimpan!`);
  };

  // Open Transfer Student Modal
  const handleOpenTransferModal = (std: User) => {
    setTransferringStudent(std);
    const otherClasses = classes.filter((c) => c.Nama_Kelas !== std.Kelas);
    setTargetTransferClass(otherClasses[0]?.Nama_Kelas || '');
    setIsTransferModalOpen(true);
  };

  // Execute Student Transfer
  const handleExecuteTransfer = async () => {
    if (!transferringStudent || !targetTransferClass) return;

    const updatedUser: User = {
      ...transferringStudent,
      Kelas: targetTransferClass,
    };

    await onSaveUser(updatedUser);
    showToast(`Siswa ${transferringStudent.Nama} berhasil dipindahkan ke Kelas ${targetTransferClass}!`);
    setIsTransferModalOpen(false);
    setTransferringStudent(null);
  };

  // Execute Delete Single
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'class') {
      await onDeleteClass(deleteConfirm.id);
    } else {
      await onDeleteUser(deleteConfirm.id);
    }
    setDeleteConfirm(null);
  };

  // Open Delete All Modal
  const handleOpenDeleteAllModal = (initialScope?: string) => {
    setDeleteAllScope(initialScope || (selectedClassFilter !== 'all' ? selectedClassFilter : 'all'));
    setDeleteAllConfirmKeyword('');
    setIsDeleteAllModalOpen(true);
  };

  // Execute Delete All Students
  const handleExecuteDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      if (onDeleteAllStudents) {
        await onDeleteAllStudents(deleteAllScope);
      } else {
        const targetStudents = students.filter((s) => deleteAllScope === 'all' || s.Kelas === deleteAllScope);
        for (const s of targetStudents) {
          await onDeleteUser(s.ID_User);
        }
        showToast(`Berhasil menghapus ${targetStudents.length} data siswa!`);
      }
      setIsDeleteAllModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus data siswa.');
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Affected count for Delete All Modal
  const studentsToDeleteCount = students.filter(
    (s) => deleteAllScope === 'all' || s.Kelas === deleteAllScope
  ).length;

  // Filtered student list
  const filteredStudents = students.filter((std) => {
    const matchesClass = selectedClassFilter === 'all' || std.Kelas === selectedClassFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      std.Nama.toLowerCase().includes(query) ||
      (std.NIS && std.NIS.toLowerCase().includes(query)) ||
      (std.NISN && std.NISN.toLowerCase().includes(query)) ||
      std.Kelas.toLowerCase().includes(query);
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Kelola Rombongan Belajar (Rombel) */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <School className="w-3.5 h-3.5" />
              <span>Manajemen Rombel & Siswa Terpadu</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Daftar Kelas & Rombongan Belajar PAI
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Kelola kelas, alokasikan materi/tugas khusus per rombel, pantau jumlah siswa terdaftar, mutasi kelas, dan evaluasi hasil belajar siswa per rombel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-400/40 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              title="Impor banyak siswa sekaligus dari Excel / CSV atau Ekspor data"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>⚡ Impor Masal & Ekspor</span>
            </button>

            <button
              onClick={() => handleOpenStudentModal()}
              className="px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 border border-emerald-500/30 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-300" />
              <span>+ Tambah Siswa</span>
            </button>

            <button
              onClick={() => handleOpenClassModal()}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-900/30 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>+ Buat Rombel Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Class Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <School className="w-4 h-4 text-emerald-700" />
            <span>Rombel Kelas Aktif ({classes.length} Rombel)</span>
          </h3>
          <span className="text-xs text-slate-500">
            Total {students.length} Siswa Terdaftar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const classStudents = students.filter((s) => s.Kelas === cls.Nama_Kelas);
            const classMaterials = materials.filter(
              (m) => !m.Target_Kelas || m.Target_Kelas === 'Semua Kelas' || m.Target_Kelas === cls.Nama_Kelas
            );
            const classAssignments = assignments.filter(
              (a) => !a.Target_Kelas || a.Target_Kelas === 'Semua Kelas' || a.Target_Kelas === cls.Nama_Kelas
            );

            // Submissions & Average Score for this Class
            const classSubmissions = submissions.filter((sub) =>
              classStudents.some((st) => String(st.ID_User) === String(sub.ID_Student))
            );
            const classGrades = grades.filter((g) =>
              classStudents.some((st) => String(st.ID_User) === String(g.ID_Student))
            );
            const avgScore =
              classGrades.length > 0
                ? Math.round(classGrades.reduce((acc, curr) => acc + Number(curr.Nilai || 0), 0) / classGrades.length)
                : 0;

            const isSelected = selectedClassFilter === cls.Nama_Kelas;

            return (
              <div
                key={cls.ID_Kelas}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col justify-between relative group ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Card Top Row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-black text-sm">
                        {cls.Tingkat || 7}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                          <span>Kelas {cls.Nama_Kelas}</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {cls.Tahun_Ajaran || '2026/2027'} • Tingkat SMP {cls.Tingkat || 7}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenClassModal(cls)}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Edit Rombel"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'class',
                            id: cls.ID_Kelas,
                            name: `Kelas ${cls.Nama_Kelas}`,
                          })
                        }
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Hapus Rombel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Wali Kelas & Keterangan */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1 mb-3 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400">Wali Kelas:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[170px]">
                        {cls.Wali_Kelas || 'Belum diatur'}
                      </span>
                    </div>
                    {cls.Keterangan && (
                      <p className="text-[11px] text-slate-500 italic truncate">
                        "{cls.Keterangan}"
                      </p>
                    )}
                  </div>

                  {/* Class Stats Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                    <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <p className="text-[10px] text-emerald-700 font-semibold">Siswa</p>
                      <p className="text-sm font-black text-emerald-950">{classStudents.length}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100">
                      <p className="text-[10px] text-blue-700 font-semibold">Materi/Tugas</p>
                      <p className="text-sm font-black text-blue-950">{classMaterials.length}/{classAssignments.length}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100">
                      <p className="text-[10px] text-amber-700 font-semibold">Rata-rata</p>
                      <p className="text-sm font-black text-amber-950">{avgScore > 0 ? avgScore : '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedClassFilter(cls.Nama_Kelas)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Lihat Siswa ({classStudents.length})</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {onOpenCreateMaterialForClass && (
                      <button
                        onClick={() => onOpenCreateMaterialForClass(cls.Nama_Kelas)}
                        className="px-2 py-1 text-[10px] font-bold bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 rounded-lg transition-all"
                        title="Buat Materi Khusus Kelas ini"
                      >
                        + Materi
                      </button>
                    )}
                    {onOpenCreateAssignmentForClass && (
                      <button
                        onClick={() => onOpenCreateAssignmentForClass(cls.Nama_Kelas)}
                        className="px-2 py-1 text-[10px] font-bold bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 rounded-lg transition-all"
                        title="Buat Tugas Khusus Kelas ini"
                      >
                        + Tugas
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Roster Section with Class Filtering */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Roster Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Roster & Data Siswa PAI</span>
              {selectedClassFilter !== 'all' && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Kelas {selectedClassFilter}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola penempatan rombel, mutasi siswa antar kelas, dan data akun belajar siswa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Kelas Tabs / Dropdown */}
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Kelas ({students.length} Siswa)</option>
              {classes.map((c) => (
                <option key={c.ID_Kelas} value={c.Nama_Kelas}>
                  Kelas {c.Nama_Kelas} ({students.filter((s) => s.Kelas === c.Nama_Kelas).length} Siswa)
                </option>
              ))}
            </select>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama siswa, NIS..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 w-48"
              />
            </div>

            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Impor banyak siswa sekaligus dari Excel atau Ekspor Data"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Impor Masal</span>
            </button>

            <button
              onClick={() => handleTriggerExportCsv(selectedClassFilter)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Unduh data siswa saat ini ke file Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={() => handleOpenDeleteAllModal(selectedClassFilter)}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Hapus semua siswa atau bersihkan siswa per rombel"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Hapus Semua Siswa</span>
            </button>

            <button
              onClick={() => handleOpenStudentModal(undefined, selectedClassFilter !== 'all' ? selectedClassFilter : undefined)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Siswa Baru</span>
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">NIS</th>
                <th className="py-3 px-4">Rombel Kelas</th>
                <th className="py-3 px-4 text-center">Tugas Dikirim</th>
                <th className="py-3 px-4 text-center">Rata-rata Nilai</th>
                <th className="py-3 px-4 text-right">Aksi Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                    Tidak ada data siswa ditemukan untuk filter kelas / pencarian ini.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, idx) => {
                  const stdSubmissions = submissions.filter((s) => String(s.ID_Student) === String(std.ID_User));
                  const stdGrades = grades.filter((g) => String(g.ID_Student) === String(std.ID_User));
                  const avg =
                    stdGrades.length > 0
                      ? Math.round(stdGrades.reduce((acc, curr) => acc + Number(curr.Nilai || 0), 0) / stdGrades.length)
                      : 0;

                  return (
                    <tr key={std.ID_User} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={std.Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt=""
                            className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">
                              {std.Nama}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              ID: {std.ID_User}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {std.NIS || std.NISN || '-'}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Kelas {std.Kelas}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-slate-800">
                          {stdSubmissions.length} Tugas
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {avg > 0 ? (
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                              avg >= 85
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : avg >= 75
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {avg}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenTransferModal(std)}
                            className="px-2 py-1 text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg flex items-center gap-1 transition-all"
                            title="Mutasi / Pindah Kelas"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Pindah</span>
                          </button>

                          <button
                            onClick={() => handleOpenStudentModal(std)}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Edit Data Siswa"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'student',
                                id: std.ID_User,
                                name: std.Nama,
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Tambah / Edit Rombel Kelas */}
      {/* ========================================================================= */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <School className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">
                  {editingClass ? `Edit Rombel Kelas ${editingClass.Nama_Kelas}` : 'Buat Rombel Kelas Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClassSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Rombel / Kelas <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={inputNamaKelas}
                    onChange={(e) => setInputNamaKelas(e.target.value)}
                    placeholder="Contoh: VII-A, VII-B, VIII-A"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tingkat Jenjang:
                  </label>
                  <select
                    value={inputTingkat}
                    onChange={(e) => setInputTingkat(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={7}>Kelas 7 (Fase D)</option>
                    <option value={8}>Kelas 8 (Fase D)</option>
                    <option value={9}>Kelas 9 (Fase D)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Wali Kelas:
                </label>
                <input
                  type="text"
                  value={inputWaliKelas}
                  onChange={(e) => setInputWaliKelas(e.target.value)}
                  placeholder="Contoh: Ust. H. Imran Rosyadi, S.Pd.I, Gr."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tahun Ajaran:
                </label>
                <input
                  type="text"
                  value={inputTahunAjaran}
                  onChange={(e) => setInputTahunAjaran(e.target.value)}
                  placeholder="Contoh: 2026/2027"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan / Karakteristik Rombel:
                </label>
                <textarea
                  value={inputKeterangan}
                  onChange={(e) => setInputKeterangan(e.target.value)}
                  placeholder="Contoh: Kelas Unggulan Tahfidz & Penguatan Karakter Qur'ani"
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingClass}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingClass ? 'Menyimpan...' : 'Simpan Rombel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Tambah / Edit Siswa */}
      {/* ========================================================================= */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">
                  {editingStudent ? `Edit Data Siswa: ${editingStudent.Nama}` : 'Pendaftaran Siswa Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  value={inputStudentNama}
                  onChange={(e) => setInputStudentNama(e.target.value)}
                  placeholder="Contoh: Muhammad Rayhan Firdaus"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Penempatan Rombel Kelas <span className="text-rose-500">*</span>:
                  </label>
                  <select
                    value={inputStudentKelas}
                    onChange={(e) => setInputStudentKelas(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.ID_Kelas} value={c.Nama_Kelas}>
                        Kelas {c.Nama_Kelas}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIS (Nomor Induk Siswa):
                  </label>
                  <input
                    type="text"
                    value={inputStudentNIS}
                    onChange={(e) => setInputStudentNIS(e.target.value)}
                    placeholder="Contoh: 20260712"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingStudent}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingStudent ? 'Menyimpan...' : 'Simpan Siswa'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Mutasi / Pindah Kelas Siswa */}
      {/* ========================================================================= */}
      {isTransferModalOpen && transferringStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ArrowRightLeft className="w-5 h-5 text-indigo-300" />
                <h3 className="font-bold text-base">Mutasi Rombel Siswa</h3>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">
                <p className="text-[11px] text-indigo-600 font-semibold">Nama Siswa:</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">
                  {transferringStudent.Nama}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Rombel Asal: <span className="font-bold text-indigo-900">Kelas {transferringStudent.Kelas}</span>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Pindahkan ke Rombel Tujuan:
                </label>
                <select
                  value={targetTransferClass}
                  onChange={(e) => setTargetTransferClass(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                >
                  {classes.map((c) => (
                    <option key={c.ID_Kelas} value={c.Nama_Kelas}>
                      Kelas {c.Nama_Kelas} ({c.Wali_Kelas || 'Wali Belum Diatur'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteTransfer}
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Konfirmasi Pindah</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Konfirmasi Hapus Masal Semua Siswa */}
      {/* ========================================================================= */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-100 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Hapus Data Siswa Secara Masal
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih cakupan data siswa yang ingin dibersihkan dari sistem.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Pilih Lingkup Siswa yang Akan Dihapus:
                </label>
                <select
                  value={deleteAllScope}
                  onChange={(e) => setDeleteAllScope(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">
                    ⚠️ Semua Siswa di Seluruh Kelas ({students.length} Siswa)
                  </option>
                  {classes.map((c) => {
                    const cnt = students.filter((s) => s.Kelas === c.Nama_Kelas).length;
                    return (
                      <option key={c.ID_Kelas} value={c.Nama_Kelas}>
                        Hanya Siswa Kelas {c.Nama_Kelas} ({cnt} Siswa)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2">
                <div className="flex items-center justify-between font-extrabold">
                  <span className="flex items-center gap-1.5 text-rose-900">
                    <Trash2 className="w-4 h-4" />
                    <span>Jumlah Siswa Terhapus:</span>
                  </span>
                  <span className="px-2.5 py-0.5 bg-rose-200 text-rose-900 rounded-full text-xs font-black">
                    {studentsToDeleteCount} Siswa
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-700">
                  Perhatian: Tindakan ini akan menghapus akun siswa yang terpilih. Riwayat penugasan siswa tersebut di kelas akan disesuaikan. Data Guru dan daftar Rombel Kelas <strong>tidak</strong> akan terhapus.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ketik kata <span className="font-mono text-rose-600 uppercase font-black">HAPUS</span> untuk konfirmasi:
                </label>
                <input
                  type="text"
                  value={deleteAllConfirmKeyword}
                  onChange={(e) => setDeleteAllConfirmKeyword(e.target.value)}
                  placeholder="Ketik HAPUS di sini..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteAllModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isDeletingAll || studentsToDeleteCount === 0 || deleteAllConfirmKeyword.trim().toUpperCase() !== 'HAPUS'}
                  onClick={handleExecuteDeleteAll}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  {isDeletingAll ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Ya, Hapus {studentsToDeleteCount} Siswa Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Konfirmasi Hapus */}
      {/* ========================================================================= */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Hapus {deleteConfirm.type === 'class' ? 'Rombel' : 'Data Siswa'}?
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              Apakah Anda yakin ingin menghapus <strong>"{deleteConfirm.name}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Impor Masal & Ekspor Siswa */}
      {/* ========================================================================= */}
      <BulkStudentModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        classes={classes}
        existingUsers={users}
        defaultClass={selectedClassFilter !== 'all' ? selectedClassFilter : undefined}
        onSaveBatchUsers={async (newUsers) => {
          if (onSaveBatchUsers) {
            await onSaveBatchUsers(newUsers);
          } else {
            for (const u of newUsers) {
              await onSaveUser(u);
            }
          }
        }}
        onExportCsv={handleTriggerExportCsv}
        showToast={showToast}
      />

    </div>
  );
};
