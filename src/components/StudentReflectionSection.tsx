import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Heart, 
  BookOpen, 
  Clock, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Reflection } from '../types';

interface StudentReflectionSectionProps {
  materialId: string;
  studentId: string;
  materialTitle: string;
  existingReflection?: Reflection;
  onSaveReflection: (payload: {
    ID_Material: string;
    ID_Student: string;
    Poin_Penting?: string;
    Kesimpulan: string;
    Hal_Disukai?: string;
    Pertanyaan_Siswa?: string;
  }) => Promise<void>;
  readOnly?: boolean; // For preview mode in Teacher dashboard
}

export const StudentReflectionSection: React.FC<StudentReflectionSectionProps> = ({
  materialId,
  studentId,
  materialTitle,
  existingReflection,
  onSaveReflection,
  readOnly = false,
}) => {
  const [poinPenting, setPoinPenting] = useState(existingReflection?.Poin_Penting || '');
  const [kesimpulan, setKesimpulan] = useState(existingReflection?.Kesimpulan || '');
  const [halDisukai, setHalDisukai] = useState(existingReflection?.Hal_Disukai || '');
  const [pertanyaanSiswa, setPertanyaanSiswa] = useState(existingReflection?.Pertanyaan_Siswa || '');

  const [isExpanded, setIsExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (existingReflection) {
      setPoinPenting(existingReflection.Poin_Penting || '');
      setKesimpulan(existingReflection.Kesimpulan || '');
      setHalDisukai(existingReflection.Hal_Disukai || '');
      setPertanyaanSiswa(existingReflection.Pertanyaan_Siswa || '');
    }
  }, [existingReflection, materialId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kesimpulan.trim()) return;

    setIsSubmitting(true);
    try {
      await onSaveReflection({
        ID_Material: materialId,
        ID_Student: studentId,
        Poin_Penting: poinPenting.trim() || undefined,
        Kesimpulan: kesimpulan.trim(),
        Hal_Disukai: halDisukai.trim() || undefined,
        Pertanyaan_Siswa: pertanyaanSiswa.trim() || undefined,
      });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save reflection:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAlreadyFilled = Boolean(existingReflection?.Kesimpulan);

  return (
    <div className="rounded-3xl border border-emerald-300 bg-gradient-to-b from-emerald-50/90 via-white to-emerald-50/40 p-5 sm:p-7 shadow-sm transition-all space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-emerald-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-200/80 text-emerald-900 uppercase tracking-wider">
                Refleksi Pembelajaran Siswa
              </span>
              {isAlreadyFilled && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Sudah Mengisi
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-0.5">
              Refleksi & Rangkuman Mandiri Materi
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200 text-emerald-800 transition-colors shrink-0"
          title={isExpanded ? 'Sembunyikan Form Refleksi' : 'Buka Form Refleksi'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            Setelah menyimak materi dan video di atas, tuliskan pemahaman dan kesan belajarmu pada formulir refleksi di bawah ini untuk menguatkan pemahamanmu:
          </p>

          {/* Prompt 1: Poin-Poin Penting */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>1. Poin-Poin Penting yang Kamu Dapatkan dari Materi Ini:</span>
              <span className="text-[10px] text-slate-400 font-normal">(Bisa dalam bentuk daftar/poin)</span>
            </label>
            <textarea
              rows={3}
              value={poinPenting}
              onChange={(e) => setPoinPenting(e.target.value)}
              disabled={readOnly || isSubmitting}
              placeholder="Contoh:&#10;1. Hukum bacaan Alif Lam Syamsiyah dibaca lebur (idgham)&#10;2. Contoh hurufnya adalah Tha, Tsa, Dal, Dzal, Ra, Zay, Sin...&#10;3. Pentingnya mengamalkan nilai ketaatan dalam keseharian..."
              className="w-full p-3 bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-900 leading-relaxed transition-all disabled:bg-slate-100"
            />
          </div>

          {/* Prompt 2: Kesimpulan Pribadi (Wajib) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>2. Kesimpulan / Rangkuman Pemahamanmu Sendiri: <span className="text-rose-600">*</span></span>
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Wajib Diisi</span>
            </label>
            <textarea
              rows={3}
              required
              value={kesimpulan}
              onChange={(e) => setKesimpulan(e.target.value)}
              disabled={readOnly || isSubmitting}
              placeholder="Tuliskan dengan bahasamu sendiri apa yang dapat kamu simpulkan dan bagaimana kamu akan menerapkannya dalam kehidupan sehari-hari..."
              className="w-full p-3 bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-900 leading-relaxed transition-all disabled:bg-slate-100 font-medium"
            />
          </div>

          {/* Grid 2 Kolom untuk Hal Menarik & Pertanyaan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Hal yang Paling Disukai / Menarik */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>3. Hal yang Paling Menarik / Bermanfaat:</span>
              </label>
              <textarea
                rows={2}
                value={halDisukai}
                onChange={(e) => setHalDisukai(e.target.value)}
                disabled={readOnly || isSubmitting}
                placeholder="Bagian penjelasan atau contoh apa yang paling kamu sukai..."
                className="w-full p-2.5 bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-2xl text-xs text-slate-900 transition-all disabled:bg-slate-100"
              />
            </div>

            {/* Pertanyaan atau Hal yang Ingin Ditanyakan ke Guru */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>4. Pertanyaan / Hal yang Belum Dipahami:</span>
              </label>
              <textarea
                rows={2}
                value={pertanyaanSiswa}
                onChange={(e) => setPertanyaanSiswa(e.target.value)}
                disabled={readOnly || isSubmitting}
                placeholder="Ada hal yang ingin kamu tanyakan ke Guru PAI terkait materi ini? (Opsional)..."
                className="w-full p-2.5 bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-2xl text-xs text-slate-900 transition-all disabled:bg-slate-100"
              />
            </div>

          </div>

          {/* Feedback Guru jika ada tanggapan */}
          {existingReflection?.Tanggapan_Guru && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 text-xs text-amber-950 space-y-1">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <MessageSquare className="w-4 h-4 text-amber-700" />
                <span>Tanggapan / Apresiasi dari Guru PAI:</span>
              </div>
              <p className="pl-6 text-amber-900 leading-relaxed font-medium italic">
                "{existingReflection.Tanggapan_Guru}"
              </p>
            </div>
          )}

          {/* Submit Action Bar */}
          {!readOnly && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {existingReflection?.Tanggal_Dibuat ? (
                  <span>
                    Disimpan pada: {existingReflection.Tanggal_Dibuat}
                    {existingReflection.Tanggal_Diperbarui && ` (Diedit: ${existingReflection.Tanggal_Diperbarui})`}
                  </span>
                ) : (
                  <span>Refleksimu akan tersimpan otomatis dan dapat dilihat oleh Guru Pengampu.</span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isSuccess && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Tersimpan!</span>
                  </span>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !kesimpulan.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Menyimpan...'
                      : isAlreadyFilled
                      ? 'Perbarui Refleksi Saya'
                      : 'Kirim Refleksi Pembelajaran'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
