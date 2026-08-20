import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  ClipboardCopy, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  Check, 
  School,
  Info
} from 'lucide-react';
import { User, ClassRoom } from '../types';

interface BulkStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassRoom[];
  existingUsers: User[];
  defaultClass?: string;
  onSaveBatchUsers: (newUsers: User[]) => Promise<void>;
  onExportCsv: (className: string) => void;
  showToast: (msg: string) => void;
}

export const BulkStudentModal: React.FC<BulkStudentModalProps> = ({
  isOpen,
  onClose,
  classes,
  existingUsers,
  defaultClass,
  onSaveBatchUsers,
  onExportCsv,
  showToast,
}) => {
  if (!isOpen) return null;

  // Active Tab: 'paste' | 'upload' | 'export'
  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'export'>('paste');

  // Input States
  const [pastedText, setPastedText] = useState<string>('');
  const [targetClass, setTargetClass] = useState<string>(defaultClass || classes[0]?.Nama_Kelas || 'VII-A');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // Export State
  const [exportSelectedClass, setExportSelectedClass] = useState<string>('all');

  // Helper to generate internal email slug from name/nis
  const generateEmail = (name: string, nis?: string): string => {
    if (nis && nis.trim().length >= 3) {
      return `${nis.trim()}@siswa.smp.belajar.id`;
    }
    const cleanName = name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join('.');
    return `${cleanName || 'siswa'}@siswa.smp.belajar.id`;
  };

  // Parse Text (Supports Tab-separated from Excel, Comma-separated CSV, Semicolon CSV, or line-by-line names)
  // Format: NAMA, NIS, KELAS
  const parsedStudents = useMemo(() => {
    const raw = pastedText.trim();
    if (!raw) return [];

    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return [];

    const results: Array<{
      valid: boolean;
      nama: string;
      kelas: string;
      nis: string;
      reason?: string;
    }> = [];

    // Check if first line is a header
    let startIndex = 0;
    const firstLineLower = lines[0].toLowerCase();
    if (
      firstLineLower.includes('nama') ||
      firstLineLower.includes('name') ||
      firstLineLower.includes('nis') ||
      firstLineLower.includes('kelas')
    ) {
      startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      // Detect separator: Tab (\t), Semicolon (;), or Comma (,)
      let parts: string[] = [];
      if (line.includes('\t')) {
        parts = line.split('\t').map((s) => s.trim());
      } else if (line.includes(';')) {
        parts = line.split(';').map((s) => s.trim());
      } else if (line.includes(',')) {
        // Simple comma split (ignoring commas inside quotes)
        parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((s) => s.replace(/^"|"$/g, '').trim());
      } else {
        // Just a single name
        parts = [line];
      }

      let nama = '';
      let nis = '';
      let kelas = targetClass;

      // Format Standard: 1. Nama, 2. NIS, 3. Kelas
      if (parts.length === 1) {
        nama = parts[0];
      } else if (parts.length === 2) {
        nama = parts[0];
        // If 2nd column looks like class name (e.g. VII-A, VIII-B) and no NIS
        if (parts[1].match(/^[Vv|Xx|Ii|1-9]/) && !parts[1].match(/^\d{5,}$/)) {
          kelas = parts[1] || targetClass;
        } else {
          nis = parts[1];
        }
      } else if (parts.length >= 3) {
        nama = parts[0];
        nis = parts[1];
        kelas = parts[2] || targetClass;
      }

      if (!nama || nama.length < 2) {
        results.push({
          valid: false,
          nama: line,
          kelas,
          nis,
          reason: 'Nama siswa terlalu pendek atau tidak valid',
        });
      } else {
        results.push({
          valid: true,
          nama,
          kelas: kelas || targetClass,
          nis,
        });
      }
    }

    return results;
  }, [pastedText, targetClass]);

  // Valid parsed students count
  const validParsedCount = parsedStudents.filter((s) => s.valid).length;

  // Load Sample Template (Format: Nama, NIS, Kelas)
  const handleLoadSample = () => {
    const sample = `Ahmad Fauzan Pratama\t20260711\tVII-A
Siti Aisyah Azzahra\t20260712\tVII-A
Muhammad Rizky Ramadhan\t20260713\tVII-A
Fathimah Az-Zahra\t20260714\tVII-A
Dimas Bagus Saputra\t20260715\tVII-A`;
    setPastedText(sample);
  };

  // Download Sample CSV Template (Format: Nama, NIS, Kelas)
  const handleDownloadTemplate = () => {
    const templateContent = '\uFEFFNama Siswa,NIS,Kelas\nMuhammad Ali,20260701,VII-A\nNur Khadijah,20260702,VII-A\nBilal bin Rabah,20260703,VII-B';
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Template_Impor_Siswa_PAI.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Template CSV berhasil diunduh!');
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setPastedText(content);
        setActiveTab('paste');
        showToast(`File ${file.name} berhasil dibaca! Silakan periksa pratinjau.`);
      }
    };
    reader.readAsText(file);
  };

  // Submit Batch Import
  const handleExecuteImport = async () => {
    const validOnes = parsedStudents.filter((s) => s.valid);
    if (validOnes.length === 0) {
      showToast('Tidak ada data siswa yang valid untuk diimpor!');
      return;
    }

    setIsProcessing(true);
    try {
      const newUsersToSave: User[] = validOnes.map((s, idx) => {
        const email = generateEmail(s.nama, s.nis);
        return {
          ID_User: `USR-SISWA-${Date.now().toString().slice(-4)}${idx + 1}`,
          Nama: s.nama,
          Email: email,
          NIS: s.nis,
          NISN: s.nis,
          Password: 'siswa123',
          Role: 'Siswa',
          Kelas: s.kelas || targetClass,
          Avatar: `https://images.unsplash.com/photo-${1534528741775 + (idx % 20) * 17}?w=150&auto=format&fit=crop&q=80`,
        };
      });

      await onSaveBatchUsers(newUsersToSave);
      showToast(`Alhamdulillah! Berhasil mengimpor ${newUsersToSave.length} data siswa.`);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses impor data siswa.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Total students for export
  const exportStudents = existingUsers.filter(
    (u) => u.Role === 'Siswa' && (exportSelectedClass === 'all' || u.Kelas === exportSelectedClass)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl tracking-tight">
                Impor Masal & Ekspor Data Siswa
              </h3>
              <p className="text-xs text-emerald-100/80">
                Masukkan puluhan siswa sekaligus dari Excel / Google Sheets atau unduh daftar siswa.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'paste'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardCopy className="w-4 h-4" />
            <span>Salin-Tempel dari Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Unggah File CSV / Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Siswa ke CSV / Excel</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* TAB 1: PASTE FROM EXCEL */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              
              {/* Instructions & Template Buttons */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Petunjuk Format Salin-Tempel (Nama, NIS, Kelas):</span>
                  </span>
                  <p className="text-emerald-800">
                    Buka Microsoft Excel / Google Sheets, susun urutan kolom: <strong>1. Nama Siswa</strong>, <strong>2. NIS</strong>, <strong>3. Kelas</strong>, lalu Copy (Ctrl+C) dan Paste (Ctrl+V) ke kotak di bawah.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    ⚡ Muat Contoh
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Template CSV</span>
                  </button>
                </div>
              </div>

              {/* Target Class Default Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <School className="w-4 h-4 text-emerald-600" />
                    <span>Rombel Kelas Default (Jika kolom Kelas kosong):</span>
                  </label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.ID_Kelas} value={c.Nama_Kelas}>
                        Kelas {c.Nama_Kelas}
                      </option>
                    ))}
                  </select>
                </div>

                {pastedText && (
                  <button
                    type="button"
                    onClick={() => setPastedText('')}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                  >
                    Bersihkan Teks
                  </button>
                )}
              </div>

              {/* Textarea */}
              <div>
                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={`Format yang di-paste (Nama, NIS, Kelas):\nAhmad Fauzan Pratama\t20260711\tVII-A\nSiti Aisyah Azzahra\t20260712\tVII-A\nMuhammad Rizky\t20260713\tVII-B`}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Real-time Preview Table */}
              {parsedStudents.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Pratinjau Hasil Pembacaan Data ({validParsedCount} Siswa Valid)</span>
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Total baris terbaca: {parsedStudents.length}
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-[11px] font-bold text-slate-600 sticky top-0">
                        <tr>
                          <th className="py-2 px-3">No</th>
                          <th className="py-2 px-3">Nama Siswa</th>
                          <th className="py-2 px-3">NIS</th>
                          <th className="py-2 px-3">Kelas</th>
                          <th className="py-2 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedStudents.map((s, idx) => (
                          <tr key={idx} className={s.valid ? 'hover:bg-slate-50' : 'bg-rose-50/50'}>
                            <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">{s.nama}</td>
                            <td className="py-2 px-3 font-mono font-semibold text-slate-700">{s.nis || '-'}</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                {s.kelas}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              {s.valid ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                                  <Check className="w-3 h-3" /> Siap
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[10px]" title={s.reason}>
                                  <AlertCircle className="w-3 h-3" /> Error
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="p-8 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50 hover:bg-emerald-50/30 transition-all text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {uploadedFileName ? `File Terpilih: ${uploadedFileName}` : 'Pilih atau Tarik File CSV / TXT Anda'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    Format didukung: <strong>.csv</strong> atau <strong>.txt</strong> dengan pemisah koma, titik-koma, atau tab (<strong>Nama Siswa, NIS, Kelas</strong>).
                  </p>
                </div>

                <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md transition-all">
                  <span>Telusuri File Komputer</span>
                  <input
                    type="file"
                    accept=".csv, .txt, .tsv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-100/70 rounded-2xl text-xs text-slate-600">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Belum punya format file? Unduh template Excel kami (Nama, Kelas, NIS).</span>
                </span>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 hover:bg-slate-50 shrink-0 cursor-pointer"
                >
                  Unduh Template
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: EXPORT STUDENTS */}
          {activeTab === 'export' && (
            <div className="space-y-5">
              
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Ekspor Data Roster Siswa
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Unduh daftar nama siswa, NIS, dan Rombel Kelas ke dalam file format <strong>CSV (Kompatibel Microsoft Excel & Google Sheets)</strong>.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-emerald-200/60">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Pilih Lingkup Rombel Kelas:
                    </label>
                    <select
                      value={exportSelectedClass}
                      onChange={(e) => setExportSelectedClass(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">Semua Rombel ({existingUsers.filter((u) => u.Role === 'Siswa').length} Siswa)</option>
                      {classes.map((c) => {
                        const count = existingUsers.filter((u) => u.Role === 'Siswa' && u.Kelas === c.Nama_Kelas).length;
                        return (
                          <option key={c.ID_Kelas} value={c.Nama_Kelas}>
                            Kelas {c.Nama_Kelas} ({count} Siswa)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={() => onExportCsv(exportSelectedClass)}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh File Excel ({exportStudents.length} Siswa)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Class Summary Breakdown */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ringkasan Rombel Terdaftar:
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {classes.map((cls) => {
                    const stdCount = existingUsers.filter((u) => u.Role === 'Siswa' && u.Kelas === cls.Nama_Kelas).length;
                    return (
                      <div key={cls.ID_Kelas} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                        <span className="text-xs font-black text-slate-800 block">Kelas {cls.Nama_Kelas}</span>
                        <span className="text-xs text-emerald-700 font-bold mt-0.5 block">{stdCount} Siswa</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            Batal
          </button>

          {activeTab !== 'export' && (
            <button
              type="button"
              disabled={isProcessing || validParsedCount === 0}
              onClick={handleExecuteImport}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-700/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Impor {validParsedCount} Data Siswa Sekarang</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
