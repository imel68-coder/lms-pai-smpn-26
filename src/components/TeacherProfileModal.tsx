import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Check, 
  Sparkles, 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  School, 
  KeyRound, 
  Image as ImageIcon,
  RotateCcw,
  Info
} from 'lucide-react';
import { User } from '../types';
import { TEACHER_AVATAR_IMAGE } from '../data/seedData';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveUser: (user: User) => Promise<void>;
  showToast: (msg: string) => void;
}

// Preset photo options if teacher wants quick preset choices
const PRESET_AVATARS = [
  { label: 'Foto Resmi (Jas & Dasi)', url: TEACHER_AVATAR_IMAGE },
  { label: 'Studio Formal 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { label: 'Studio Formal 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { label: 'Akademisi Pria', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  { label: 'Akademisi Modern', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
];

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
  showToast,
}) => {
  const [nama, setNama] = useState<string>(currentUser.Nama || '');
  const [email, setEmail] = useState<string>(currentUser.Email || '');
  const [password, setPassword] = useState<string>(currentUser.Password || 'guru123');
  const [kelas, setKelas] = useState<string>(currentUser.Kelas || 'Guru PAI SMP');
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser.Avatar || TEACHER_AVATAR_IMAGE);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [previewError, setPreviewError] = useState<boolean>(false);

  if (!isOpen) return null;

  // Handle local file upload (converts to base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Mohon pilih file gambar yang valid (.jpg, .png, .webp)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran foto terlalu besar (maksimal 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
        setPreviewError(false);
        showToast('Foto profil baru berhasil dimuat!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      showToast('Nama Guru tidak boleh kosong!');
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser: User = {
        ...currentUser,
        Nama: nama.trim(),
        Email: email.trim() || currentUser.Email,
        Password: password.trim() || 'guru123',
        Kelas: kelas.trim() || 'Guru PAI SMP',
        Avatar: avatarUrl.trim() || TEACHER_AVATAR_IMAGE,
      };

      await onSaveUser(updatedUser);
      showToast('Profil & Foto Guru Pengampu berhasil diperbarui!');
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Gagal memperbarui profil guru.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left my-auto animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shadow-xs">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Perbarui Profil Guru Pengampu
              </h3>
              <p className="text-xs text-slate-500">
                Ubah foto profil resmi, nama lengkap, gelar, dan informasi akun
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Avatar Section */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              
              {/* Photo Preview */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-emerald-500/30 shadow-md bg-slate-100 flex items-center justify-center">
                  {!previewError && avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Foto Guru"
                      onError={() => setPreviewError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-slate-400">
                      <UserIcon className="w-10 h-10" />
                      <span className="text-[10px] font-bold mt-1">Pratinjau</span>
                    </div>
                  )}
                </div>

                <label 
                  htmlFor="teacher-avatar-upload"
                  className="absolute -bottom-2 -right-2 p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105"
                  title="Pilih foto dari komputer / HP"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="teacher-avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Photo Controls & Tab */}
              <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Pilihan Ganti Foto Profil:</span>
                  </span>
                  {avatarUrl !== TEACHER_AVATAR_IMAGE && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl(TEACHER_AVATAR_IMAGE);
                        setPreviewError(false);
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Kembalikan Foto Resmi
                    </button>
                  )}
                </div>

                {/* Upload modes tab */}
                <div className="flex bg-slate-200/70 p-1 rounded-xl gap-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setUploadMode('upload')}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      uploadMode === 'upload' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadMode('url')}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      uploadMode === 'url' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Tautan / URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadMode('presets')}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      uploadMode === 'presets' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Pilihan Siap Pakai</span>
                  </button>
                </div>

                {/* Tab content 1: Direct File Upload */}
                {uploadMode === 'upload' && (
                  <div className="pt-1">
                    <label
                      htmlFor="teacher-avatar-upload"
                      className="w-full py-2 px-3 border border-dashed border-emerald-400 bg-white hover:bg-emerald-50/50 rounded-xl text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>Klik untuk Memilih File Foto dari Perangkat</span>
                    </label>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Format didukung: JPG, PNG, WEBP. Maksimal 5MB.
                    </p>
                  </div>
                )}

                {/* Tab content 2: Image URL */}
                {uploadMode === 'url' && (
                  <div className="pt-1">
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => {
                        setAvatarUrl(e.target.value);
                        setPreviewError(false);
                      }}
                      placeholder="https://contoh.com/foto-guru.jpg"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Tempel URL link gambar langsung dari Google Drive, Imgur, atau hosting foto lainnya.
                    </p>
                  </div>
                )}

                {/* Tab content 3: Presets */}
                {uploadMode === 'presets' && (
                  <div className="pt-1 flex items-center gap-2 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatarUrl(p.url);
                          setPreviewError(false);
                        }}
                        className={`p-1 rounded-xl border-2 transition-all shrink-0 cursor-pointer ${
                          avatarUrl === p.url ? 'border-emerald-600 bg-emerald-50' : 'border-transparent hover:border-slate-300'
                        }`}
                        title={p.label}
                      >
                        <img
                          src={p.url}
                          alt={p.label}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-emerald-600" />
                <span>Nama Lengkap & Gelar Guru:</span>
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: IMEL, S.Pd, Gr."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Email Akun (Belajar.id):</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="imel68@guru.smp.belajar.id"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <span>Kata Sandi (Password):</span>
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="guru123"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <School className="w-4 h-4 text-emerald-600" />
                <span>Jabatan / Penugasan:</span>
              </label>
              <input
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                placeholder="Guru PAI SMP"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-amber-800 text-xs">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Perubahan profil dan foto guru akan langsung disinkronkan ke seluruh tampilan aplikasi (Navbar, Dashboard Guru, dan Kartu Guru pada Halaman Login).
            </p>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-700/20 disabled:opacity-50 cursor-pointer transition-all"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan Profil</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
