import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  BookOpen, 
  User as UserIcon, 
  MessageSquare, 
  CheckCircle2, 
  Heart, 
  HelpCircle, 
  Calendar,
  Send,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { User, Material, Reflection, ClassRoom } from '../types';

interface ReflectionManagementTabProps {
  reflections: Reflection[];
  users: User[];
  materials: Material[];
  classes: ClassRoom[];
  onRespondReflection?: (reflectionId: string, tanggapan: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const ReflectionManagementTab: React.FC<ReflectionManagementTabProps> = ({
  reflections = [],
  users,
  materials,
  classes,
  onRespondReflection,
  showToast,
}) => {
  const [filterKelas, setFilterKelas] = useState<string>('all');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Feedback modal or direct response state
  const [respondingReflectionId, setRespondingReflectionId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  // Filtered Reflections
  const filteredReflections = reflections.filter((ref) => {
    const student = users.find((u) => String(u.ID_User) === String(ref.ID_Student));
    const mat = materials.find((m) => String(m.ID_Material) === String(ref.ID_Material));

    const matchesKelas = filterKelas === 'all' || student?.Kelas === filterKelas;
    const matchesMat = filterMaterial === 'all' || String(ref.ID_Material) === filterMaterial;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      student?.Nama.toLowerCase().includes(query) ||
      mat?.Judul_Materi.toLowerCase().includes(query) ||
      ref.Kesimpulan.toLowerCase().includes(query) ||
      (ref.Poin_Penting && ref.Poin_Penting.toLowerCase().includes(query));

    return matchesKelas && matchesMat && matchesSearch;
  });

  const handleOpenResponse = (ref: Reflection) => {
    setRespondingReflectionId(ref.ID_Reflection);
    setFeedbackText(ref.Tanggapan_Guru || 'MasyaAllah, rangkuman dan refleksimu sangat baik. Terus pertahankan semangat belajarnya ya!');
  };

  const handleSaveResponse = async (reflectionId: string) => {
    if (!onRespondReflection || !feedbackText.trim()) return;
    setIsSavingFeedback(true);
    try {
      await onRespondReflection(reflectionId, feedbackText.trim());
      showToast('Tanggapan & apresiasi guru berhasil disimpan!');
      setRespondingReflectionId(null);
      setFeedbackText('');
    } catch (e) {
      console.error(e);
      showToast('Gagal menyimpan tanggapan.');
    } finally {
      setIsSavingFeedback(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-emerald-950 uppercase">
              Evaluasi Formatif & Karakter
            </span>
            <span className="text-emerald-200 text-xs font-semibold">
              Total {reflections.length} Refleksi Masuk
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Refleksi & Kesimpulan Peserta Didik
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Pantau pemahaman mandiri, poin penting yang diserap, dan pertanyaan peserta didik setelah mereka menyimak materi presentasi Google Drive & video YouTube.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa atau isi refleksi..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 w-44 sm:w-60"
            />
          </div>

          {/* Filter Kelas */}
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
          >
            <option value="all">Semua Rombel Kelas</option>
            {classes.map((cls) => (
              <option key={cls.ID_Kelas} value={cls.Nama_Kelas}>
                Kelas {cls.Nama_Kelas}
              </option>
            ))}
          </select>

          {/* Filter Materi */}
          <select
            value={filterMaterial}
            onChange={(e) => setFilterMaterial(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 max-w-xs truncate"
          >
            <option value="all">Semua Materi PAI</option>
            {materials.map((m) => (
              <option key={m.ID_Material} value={m.ID_Material}>
                Bab {m.Bab}: {m.Judul_Materi || m.Judul_Bab}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          Menampilkan <strong>{filteredReflections.length}</strong> refleksi
        </span>
      </div>

      {/* List of Reflections */}
      {filteredReflections.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-3">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">Belum Ada Catatan Refleksi</h3>
          <p className="text-xs max-w-md mx-auto">
            Siswa yang telah selesai membaca materi dan menonton video akan menuliskan poin penting dan kesimpulan yang langsung tampil di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReflections.map((ref) => {
            const student = users.find((u) => String(u.ID_User) === String(ref.ID_Student));
            const mat = materials.find((m) => String(m.ID_Material) === String(ref.ID_Material));
            const isResponding = respondingReflectionId === ref.ID_Reflection;

            return (
              <div
                key={ref.ID_Reflection}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar: Student info & Material Badge */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0">
                        {student?.Nama.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {student?.Nama || 'Siswa'}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-bold text-emerald-700">{student?.Kelas}</span>
                          <span>•</span>
                          <span>{ref.Tanggal_Dibuat}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                      Bab {mat?.Bab}: {mat?.Aspek_PAI}
                    </span>
                  </div>

                  {/* Material Title */}
                  <div className="mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                      Materi:
                    </span>
                    <h5 className="font-bold text-slate-800 text-xs line-clamp-1">
                      {mat?.Judul_Materi || mat?.Judul_Bab}
                    </h5>
                  </div>

                  {/* Poin-poin Penting */}
                  {ref.Poin_Penting && (
                    <div className="mb-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
                      <strong className="text-slate-800 block mb-1 text-[11px] flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Poin-Poin Penting yang Dipelajari:</span>
                      </strong>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                        {ref.Poin_Penting}
                      </p>
                    </div>
                  )}

                  {/* Kesimpulan Pribadi */}
                  <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200/70 text-xs">
                    <strong className="text-emerald-950 block mb-1 text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kesimpulan & Rangkuman Siswa:</span>
                    </strong>
                    <p className="text-emerald-900 leading-relaxed font-medium">
                      "{ref.Kesimpulan}"
                    </p>
                  </div>

                  {/* Hal yang Disukai & Pertanyaan jika ada */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-[11px]">
                    {ref.Hal_Disukai && (
                      <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 text-rose-950">
                        <strong className="block text-rose-800 flex items-center gap-1 font-bold mb-0.5">
                          <Heart className="w-3 h-3 text-rose-500" /> Hal Menarik:
                        </strong>
                        <p>{ref.Hal_Disukai}</p>
                      </div>
                    )}
                    {ref.Pertanyaan_Siswa && (
                      <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 text-amber-950">
                        <strong className="block text-amber-800 flex items-center gap-1 font-bold mb-0.5">
                          <HelpCircle className="w-3 h-3 text-amber-600" /> Pertanyaan Siswa:
                        </strong>
                        <p>{ref.Pertanyaan_Siswa}</p>
                      </div>
                    )}
                  </div>

                  {/* Feedback Guru */}
                  {ref.Tanggapan_Guru && !isResponding && (
                    <div className="mt-3 p-3 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-950">
                      <strong className="block text-teal-900 flex items-center gap-1 mb-1 font-bold">
                        <MessageSquare className="w-3.5 h-3.5 text-teal-700" /> Tanggapan Guru:
                      </strong>
                      <p className="italic text-teal-900">"{ref.Tanggapan_Guru}"</p>
                    </div>
                  )}
                </div>

                {/* Response Action / Form */}
                <div className="pt-2 border-t border-slate-100">
                  {isResponding ? (
                    <div className="space-y-2 pt-1 animate-in fade-in">
                      <label className="block text-xs font-bold text-slate-800">
                        Tulis Apresiasi / Tanggapan untuk {student?.Nama}:
                      </label>
                      <textarea
                        rows={2}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Contoh: MasyaAllah rangkuman sangat runtut! Teruskan ya..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-400 font-medium"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setRespondingReflectionId(null)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          disabled={isSavingFeedback || !feedbackText.trim()}
                          onClick={() => handleSaveResponse(ref.ID_Reflection)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSavingFeedback ? 'Menyimpan...' : 'Kirim Tanggapan'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenResponse(ref)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{ref.Tanggapan_Guru ? 'Ubah Tanggapan Guru' : 'Beri Apresiasi & Tanggapan Guru'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
