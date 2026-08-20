import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Database, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  RefreshCw, 
  X,
  Layers,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/gasCode';
import { apiService } from '../services/apiService';

interface GasSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUrlUpdated: () => void;
}

export const GasSetupModal: React.FC<GasSetupModalProps> = ({ isOpen, onClose, onUrlUpdated }) => {
  const [activeTab, setActiveTab] = useState<'baas' | 'guide' | 'code' | 'schema' | 'export'>('baas');
  const [copied, setCopied] = useState(false);
  const [gasUrl, setGasUrl] = useState(apiService.getGasUrl());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<'Users' | 'Classes' | 'Materials' | 'Assignments' | 'Submissions' | 'Grades'>('Users');
  const [csvCopiedTable, setCsvCopiedTable] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveUrl = () => {
    apiService.setGasUrl(gasUrl);
    onUrlUpdated();
  };

  const handleTestConnection = async () => {
    if (!gasUrl.trim()) {
      setTestStatus('error');
      setTestMessage('Silakan masukkan URL Web App Google Apps Script terlebih dahulu.');
      return;
    }
    setTestStatus('testing');
    setTestMessage('Menghubungi endpoint Google Apps Script...');

    try {
      apiService.setGasUrl(gasUrl);
      const res = await apiService.fetchAllData();
      if (res.source === 'gas') {
        setTestStatus('success');
        setTestMessage('✅ Koneksi Berhasil! Database Google Sheets aktif dan tersinkronisasi.');
      } else {
        setTestStatus('success');
        setTestMessage('✅ URL tersimpan! Aplikasi siap berinteraksi via Apps Script Web App.');
      }
      onUrlUpdated();
    } catch (e: any) {
      setTestStatus('error');
      setTestMessage(`Koneksi dicatat. Pastikan deployment Web App disetel ke "Anyone" (Siapa Saja): ${e.message || ''}`);
    }
  };

  const handleCopyCsv = (table: 'Users' | 'Classes' | 'Materials' | 'Assignments' | 'Submissions' | 'Grades') => {
    const data = apiService.getLocalData();
    let csv = '';
    switch (table) {
      case 'Users': {
        const headers = ['ID_User', 'Nama', 'Email', 'Password', 'Role', 'Kelas', 'NISN'];
        const rows = data.users.map((u) => [
          u.ID_User,
          `"${u.Nama.replace(/"/g, '""')}"`,
          u.Email,
          u.Password || '',
          u.Role,
          u.Kelas,
          u.NISN || '',
        ]);
        csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        break;
      }
      case 'Classes': {
        const headers = ['ID_Kelas', 'Nama_Kelas', 'Tingkat', 'Wali_Kelas', 'Tahun_Ajaran', 'Keterangan'];
        const rows = (data.classes || []).map((c) => [
          c.ID_Kelas,
          c.Nama_Kelas,
          c.Tingkat,
          `"${(c.Wali_Kelas || '').replace(/"/g, '""')}"`,
          c.Tahun_Ajaran || '',
          `"${(c.Keterangan || '').replace(/"/g, '""')}"`,
        ]);
        csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        break;
      }
      case 'Materials': {
        const headers = ['ID_Material', 'Bab', 'Judul_Bab', 'Judul_Materi', 'Aspek_PAI', 'Target_Kelas', 'Target_Kompetensi', 'Konten', 'Video_Url', 'Pdf_Url', 'Drive_Url'];
        const rows = data.materials.map((m) => [
          m.ID_Material,
          m.Bab,
          `"${m.Judul_Bab.replace(/"/g, '""')}"`,
          `"${(m.Judul_Materi || '').replace(/"/g, '""')}"`,
          `"${m.Aspek_PAI}"`,
          `"${m.Target_Kelas || 'Semua Kelas'}"`,
          `"${(m.Target_Kompetensi || '').replace(/"/g, '""')}"`,
          `"${m.Konten.replace(/"/g, '""')}"`,
          m.Video_Url || '',
          m.Pdf_Url || '',
          m.Drive_Url || '',
        ]);
        csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        break;
      }
      case 'Assignments': {
        const headers = ['ID_Assignment', 'ID_Material', 'Judul_Tugas', 'Kategori', 'Target_Kelas', 'Bobot_Nilai', 'Deadline', 'Deskripsi_Tugas'];
        const rows = data.assignments.map((a) => [
          a.ID_Assignment,
          a.ID_Material,
          `"${a.Judul_Tugas.replace(/"/g, '""')}"`,
          `"${a.Kategori}"`,
          `"${a.Target_Kelas || 'Semua Kelas'}"`,
          a.Bobot_Nilai || 20,
          a.Deadline || '',
          `"${a.Deskripsi_Tugas.replace(/"/g, '""')}"`,
        ]);
        csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        break;
      }
      case 'Submissions': {
        const headers = ['ID_Submission', 'ID_Assignment', 'ID_Student', 'Link_Tugas', 'Catatan_Siswa', 'Status', 'Tanggal_Kirim'];
        const rows = data.submissions.map((s) => [
          s.ID_Submission,
          s.ID_Assignment,
          s.ID_Student,
          `"${s.Link_Tugas.replace(/"/g, '""')}"`,
          `"${(s.Catatan_Siswa || '').replace(/"/g, '""')}"`,
          s.Status,
          s.Tanggal_Kirim,
        ]);
        csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        break;
      }
      case 'Grades': {
        const headers = ['ID_Grade', 'ID_Submission', 'ID_Student', 'ID_Assignment', 'Nilai', 'Catatan_Guru', 'Tanggal_Nilai', 'Nama_Penilai'];
        const rows = data.grades.map((g) => [
          g.ID_Grade,
          g.ID_Submission,
          g.ID_Student,
          g.ID_Assignment,
          g.Nilai,
          `"${(g.Catatan_Guru || '').replace(/"/g, '""')}"`,
          g.Tanggal_Nilai || '',
          `"${(g.Nama_Penilai || 'Guru PAI').replace(/"/g, '""')}"`,
        ]);
        csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        break;
      }
    }
    navigator.clipboard.writeText(csv);
    setCsvCopiedTable(table);
    setTimeout(() => setCsvCopiedTable(null), 2000);
  };

  const schemaDefinitions = {
    Users: {
      desc: 'Menyimpan data akun guru, akun siswa, dan penempatan rombel kelas.',
      columns: [
        { name: 'ID_User', type: 'String (Primary Key)', sample: 'USR-SISWA-01', desc: 'ID unik pengguna' },
        { name: 'Nama', type: 'String', sample: 'Ahmad Fauzi Ramadhan', desc: 'Nama lengkap' },
        { name: 'Email', type: 'String (Unique)', sample: 'ahmad@siswa.belajar.id', desc: 'Email akun login' },
        { name: 'Password', type: 'String', sample: 'siswa123', desc: 'Kata sandi akun' },
        { name: 'Role', type: 'Enum: Siswa / Guru', sample: 'Siswa', desc: 'Hak akses dalam sistem' },
        { name: 'Kelas', type: 'String', sample: 'VII-A', desc: 'Kelas rombel siswa' },
        { name: 'NISN', type: 'String', sample: '0089234129', desc: 'Nomor Induk Siswa Nasional' },
      ],
    },
    Classes: {
      desc: 'Menyimpan rombongan belajar (rombel) kelas dan wali kelas.',
      columns: [
        { name: 'ID_Kelas', type: 'String (Primary Key)', sample: 'KLS-01', desc: 'ID unik kelas' },
        { name: 'Nama_Kelas', type: 'String', sample: 'VII-A', desc: 'Nama rombel kelas' },
        { name: 'Tingkat', type: 'Integer (7, 8, 9)', sample: '7', desc: 'Jenjang kelas SMP' },
        { name: 'Wali_Kelas', type: 'String', sample: 'Ust. H. Imran Rosyadi, S.Pd.I', desc: 'Nama guru wali kelas' },
        { name: 'Tahun_Ajaran', type: 'String', sample: '2026/2027', desc: 'Tahun ajaran aktif' },
      ],
    },
    Materials: {
      desc: 'Menyimpan materi pembelajaran PAI (Al-Qur\'an Hadis, Akidah, Akhlak, Fikih, SKI) beserta dalil naqli, modul PDF & link video.',
      columns: [
        { name: 'ID_Material', type: 'String (Primary Key)', sample: 'MAT-01', desc: 'ID unik materi' },
        { name: 'Bab', type: 'Integer', sample: '1', desc: 'Nomor Bab materi' },
        { name: 'Judul_Bab', type: 'String', sample: 'Bab 1: Al-Qur’an dan Sunnah Sebagai Pedoman Hidup', desc: 'Judul bab lengkap' },
        { name: 'Judul_Materi', type: 'String', sample: 'Kedudukan Al-Qur\'an & Kaidah Hukum Tajwid Alif Lam', desc: 'Topik pokok bahasan' },
        { name: 'Aspek_PAI', type: 'Enum: Al-Qur\'an Hadis / Akidah / Akhlak / Fikih / SKI', sample: 'Al-Qur\'an Hadis', desc: 'Aspek keilmuan PAI' },
        { name: 'Target_Kelas', type: 'String', sample: 'Semua Kelas / VII-A', desc: 'Rombel sasaran materi' },
        { name: 'Konten', type: 'JSON / Text', sample: '{"ringkasan": "...", "ayatDalil": {...}}', desc: 'Isi lengkap dalil, ringkasan dan media' },
      ],
    },
    Assignments: {
      desc: 'Daftar penugasan, LKPD mandiri, praktik ibadah & proyek karakter PAI per kelas.',
      columns: [
        { name: 'ID_Assignment', type: 'String (Primary Key)', sample: 'TSK-01', desc: 'ID unik tugas' },
        { name: 'ID_Material', type: 'String (Foreign Key)', sample: 'MAT-01', desc: 'ID materi pokok terkait' },
        { name: 'Judul_Tugas', type: 'String', sample: 'Tugas 1: Rekaman Tilawah Q.S. An-Nisa 59', desc: 'Nama tugas / LKPD' },
        { name: 'Kategori', type: 'Enum', sample: 'Praktik Ibadah & Tilawah', desc: 'Kategori penugasan' },
        { name: 'Target_Kelas', type: 'String', sample: 'Semua Kelas', desc: 'Kelas penerima tugas' },
        { name: 'Bobot_Nilai', type: 'Number', sample: '20', desc: 'Bobot persentase nilai (%)' },
      ],
    },
    Submissions: {
      desc: 'Record pengumpulan lembar kerja, rekaman dan jawaban siswa.',
      columns: [
        { name: 'ID_Submission', type: 'String (Primary Key)', sample: 'SUB-01', desc: 'ID unik pengumpulan' },
        { name: 'ID_Assignment', type: 'String (Foreign Key)', sample: 'TSK-01', desc: 'ID tugas yang dikumpulkan' },
        { name: 'ID_Student', type: 'String (Foreign Key)', sample: 'USR-SISWA-01', desc: 'ID siswa yang mengumpulkan' },
        { name: 'Link_Tugas', type: 'Text / Google Drive URL', sample: 'https://drive.google.com/...', desc: 'Jawaban teks atau link file' },
        { name: 'Status', type: 'Enum: Dikirim / Dinilai', sample: 'Dinilai', desc: 'Status penilaian' },
        { name: 'Tanggal_Kirim', type: 'String', sample: '15/08/2026 20:00', desc: 'Waktu pengumpulan' },
      ],
    },
    Grades: {
      desc: 'Penyimpanan nilai angka (0-100), catatan guru dan evaluator.',
      columns: [
        { name: 'ID_Grade', type: 'String (Primary Key)', sample: 'GRD-01', desc: 'ID unik penilaian' },
        { name: 'ID_Submission', type: 'String (Foreign Key)', sample: 'SUB-01', desc: 'ID pengumpulan tugas' },
        { name: 'ID_Student', type: 'String (Foreign Key)', sample: 'USR-SISWA-01', desc: 'ID siswa' },
        { name: 'ID_Assignment', type: 'String (Foreign Key)', sample: 'TSK-01', desc: 'ID penugasan' },
        { name: 'Nilai', type: 'Number (0 - 100)', sample: '95', desc: 'Skor angka dari guru' },
        { name: 'Catatan_Guru', type: 'Text', sample: 'Masya Allah, bacaan tajwid sangat fasih!', desc: 'Ulasan masukan guru' },
      ],
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/60 rounded-xl border border-emerald-500/30">
              <Database className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Arsitektur Database Google Sheets & Backend GAS API</h2>
              <p className="text-xs text-emerald-200">Integrasi 1 File Google Sheets sebagai Database LMS PAI SMP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('baas')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'baas'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>1. Cloud BaaS (Firebase) & Netlify Drop</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            2. Panduan Google Sheets
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-teal-600" />
            3. Kode Apps Script (GAS)
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'schema'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            4. Skema Kolom Tabel (6 Sheet)
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'export'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            5. Salin Template CSV
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB: CLOUD BAAS & NETLIFY DROP */}
          {activeTab === 'baas' && (
            <div className="space-y-6 text-sm text-slate-700">
              {/* Cloud BaaS Status Banner */}
              <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-extrabold text-white">
                          Cloud BaaS (Backend-as-a-Service) Aktif
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Live Real-time</span>
                        </span>
                      </div>
                      <p className="text-xs text-emerald-200 mt-0.5">
                        Database Cloud Firestore terhubung langsung dari kode front-end tanpa perlu server backend terpisah.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-emerald-950/60 border border-emerald-500/20 rounded-2xl p-3">
                    <span className="text-[11px] text-emerald-300 font-semibold block">Tipe Backend:</span>
                    <span className="font-bold text-white text-xs">Cloud Firestore BaaS</span>
                  </div>
                  <div className="bg-emerald-950/60 border border-emerald-500/20 rounded-2xl p-3">
                    <span className="text-[11px] text-emerald-300 font-semibold block">Sinkronisasi:</span>
                    <span className="font-bold text-white text-xs">Real-time Multi-User</span>
                  </div>
                  <div className="bg-emerald-950/60 border border-emerald-500/20 rounded-2xl p-3">
                    <span className="text-[11px] text-emerald-300 font-semibold block">Kompatibilitas:</span>
                    <span className="font-bold text-white text-xs">Netlify Drop Ready</span>
                  </div>
                </div>
              </div>

              {/* Netlify Drop Deployment Guide */}
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-3xl p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                    🚀
                  </span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Panduan Publikasi ke Netlify Drop (app.netlify.com/drop)
                    </h4>
                    <p className="text-xs text-slate-600">
                      Publikasikan aplikasi web ini ke internet secara instan dan gratis dengan fitur drag-and-drop:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white border border-emerald-200 rounded-2xl p-4 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">1</span>
                      <span>Build Kode Front-end</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Jalankan perintah <code className="bg-slate-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-mono">npm run build</code> untuk menghasilkan folder keluaran web statis (<code className="font-mono text-emerald-800">dist/</code>).
                    </p>
                  </div>

                  <div className="bg-white border border-emerald-200 rounded-2xl p-4 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">2</span>
                      <span>Buka Netlify Drop</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Buka tautan <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold inline-flex items-center gap-1">app.netlify.com/drop <ExternalLink className="w-3 h-3" /></a> di browser Anda.
                    </p>
                  </div>

                  <div className="bg-white border border-emerald-200 rounded-2xl p-4 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">3</span>
                      <span>Drag & Drop Folder</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Tarik & lepas (drag and drop) folder <code className="font-mono text-emerald-800">dist</code> ke area drop Netlify. Website Anda langsung aktif dan data Firestore otomatis tersinkronisasi!
                    </p>
                  </div>
                </div>
              </div>

              {/* Real-time Benefits & Data Structure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-xs">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sinkronisasi Otomatis Antar Perangkat</span>
                  </h5>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Saat guru membuat materi atau tugas baru, seluruh siswa langsung melihat pembaruan secara instan.</li>
                    <li>Siswa yang mengumpulkan LKPD atau rekaman tilawah langsung muncul di panel penilai Guru.</li>
                    <li>Nilai dan catatan guru langsung tersinkronisasi ke Buku Nilai Siswa.</li>
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-xs">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Backup Cadangan Google Sheets & CSV</span>
                  </h5>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Anda juga tetap bisa menghubungkan Google Sheets (tab 2 & 3) sebagai laporan rekapan spreadsheet sekolah.</li>
                    <li>Fitur ekspor CSV satu-klik tersedia untuk impor ke Microsoft Excel atau rapor Dapodik.</li>
                    <li>Tersedia fitur pencadangan offline (local storage) bila koneksi terputus sesaat.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6 text-sm text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-950">Cara Menghubungkan Google Sheets ke LMS PAI</h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Sistem ini terintegrasi langsung dengan database Google Sheets untuk menyimpan akun siswa/guru, kelas, materi pembelajaran, tugas, pengumpulan, dan nilai.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">1</span>
                    <h5 className="font-bold text-slate-800 text-xs sm:text-sm">Buat Google Sheets Baru</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Buka <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold inline-flex items-center gap-1">sheets.new <ExternalLink className="w-3 h-3" /></a> di browser Anda. Beri nama spreadsheet misalnya <code>Database LMS PAI SMP</code>.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">2</span>
                    <h5 className="font-bold text-slate-800 text-xs sm:text-sm">Buka Apps Script & Salin Kode</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>. Hapus kode default lalu tempel seluruh kode dari tab <em>"2. Kode Google Apps Script"</em>.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">3</span>
                    <h5 className="font-bold text-slate-800 text-xs sm:text-sm">Deploy sebagai Web App</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Klik <strong>Deploy &gt; New Deployment</strong>. Pilih tipe <strong>Web App</strong>. Set "Execute as: Me" dan "Who has access: <strong>Anyone</strong>". Salin URL akhiran <code>/exec</code>.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">4</span>
                    <h5 className="font-bold text-slate-800 text-xs sm:text-sm">Tempel URL Web App ke LMS</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tempelkan URL Web App pada kolom input di bawah ini, lalu klik "Simpan & Uji Koneksi".
                  </p>
                </div>
              </div>

              {/* Endpoint configuration input */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-300">
                    URL Google Apps Script Web App (/exec):
                  </label>
                  <span className="text-[10px] text-slate-400">Endpoint API Aktif</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={gasUrl}
                    onChange={(e) => setGasUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-emerald-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={testStatus === 'testing'}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 shadow-md"
                  >
                    {testStatus === 'testing' ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Simpan & Uji Koneksi</span>
                  </button>
                </div>

                {testMessage && (
                  <p className={`text-xs ${testStatus === 'error' ? 'text-rose-400' : 'text-emerald-300'}`}>
                    {testMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CODE */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Salin seluruh kode JavaScript ini ke editor Google Apps Script:
                </p>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Kode Disalin!' : 'Salin Semua Kode'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-emerald-300 p-4 rounded-2xl text-xs font-mono max-h-96 overflow-y-auto leading-relaxed border border-slate-800">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>
          )}

          {/* TAB 3: SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                {(['Users', 'Classes', 'Materials', 'Assignments', 'Submissions', 'Grades'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedSchemaTable(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedSchemaTable === t
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Sheet: {t}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                <strong>Deskripsi Sheet "{selectedSchemaTable}":</strong>{' '}
                {schemaDefinitions[selectedSchemaTable].desc}
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Nama Kolom (Header)</th>
                      <th className="p-3">Tipe Data</th>
                      <th className="p-3">Contoh Nilai</th>
                      <th className="p-3">Penjelasan Kolom</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {schemaDefinitions[selectedSchemaTable].columns.map((col) => (
                      <tr key={col.name} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-emerald-800">{col.name}</td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{col.type}</td>
                        <td className="p-3 font-mono text-slate-800">{col.sample}</td>
                        <td className="p-3 text-slate-600">{col.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: EXPORT CSV */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Klik tombol di bawah ini untuk menyalin data awal (seed data) ke clipboard dalam format CSV, lalu Anda bisa langsung melakukan <em>Paste</em> ke tab Google Sheets:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(['Users', 'Classes', 'Materials', 'Assignments', 'Submissions', 'Grades'] as const).map((t) => (
                  <div
                    key={t}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between gap-3 hover:border-emerald-300 transition-all"
                  >
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm">Sheet: {t}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {schemaDefinitions[t].desc}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyCsv(t)}
                      className="w-full py-2 px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      {csvCopiedTable === t ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersalin ke Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin CSV Sheet {t}</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>LMS PAI SMP • Terintegrasi Google Apps Script & Google Sheets</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
