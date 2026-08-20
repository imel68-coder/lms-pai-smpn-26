import React, { useState } from 'react';
import { 
  BookOpen, 
  Database, 
  UserCheck, 
  LogOut, 
  Sparkles, 
  ChevronDown, 
  GraduationCap, 
  ShieldAlert, 
  RotateCcw,
  BookMarked,
  Award,
  Layers,
  Edit3
} from 'lucide-react';
import { User } from '../types';
import { apiService } from '../services/apiService';

interface NavbarProps {
  currentUser: User | null;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  onLogout: () => void;
  onOpenGasModal: () => void;
  onResetData: () => void;
  onOpenProfileModal?: () => void;
  activeView: 'dashboard' | 'gradebook';
  setActiveView: (view: 'dashboard' | 'gradebook') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onLogout,
  onOpenGasModal,
  onResetData,
  onOpenProfileModal,
  activeView,
  setActiveView,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const gasUrl = apiService.getGasUrl();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 border border-emerald-500/30 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base md:text-lg">
                LMS PAI SMP NEGERI 26 SIJUNJUNG
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                Pendidikan Agama Islam
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Portal Pembelajaran PAI Interaktif & Penilaian Terpadu • SMPN 26 Sijunjung
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* View Switcher: Dashboard vs Buku Nilai */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'dashboard'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentUser?.Role === 'Guru' ? 'Panel Kelola & Pembelajaran' : 'Materi & Tugas PAI'}
              </span>
              <span className="sm:hidden">Materi</span>
            </button>
            <button
              onClick={() => setActiveView('gradebook')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'gradebook'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentUser?.Role === 'Guru' ? 'Buku Nilai Per Kelas' : 'Buku Nilai Saya'}
              </span>
              <span className="sm:hidden">Nilai</span>
            </button>
          </div>

          {/* Cloud Firestore BaaS & Google Sheets Database Trigger */}
          <button
            onClick={onOpenGasModal}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-all cursor-pointer shadow-xs"
            title="Cloud Firestore BaaS Aktif (Live Sync Real-time). Klik untuk info sinkronisasi & deploy Netlify"
          >
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden md:inline font-bold">
              Cloud BaaS Aktif
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Quick User Switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-medium text-slate-700 shadow-xs"
            >
              {currentUser?.Avatar ? (
                <img
                  src={currentUser.Avatar}
                  alt={currentUser.Nama}
                  className="w-7 h-7 rounded-lg object-cover ring-2 ring-emerald-500/20"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                  {currentUser?.Nama ? currentUser.Nama.charAt(0) : 'U'}
                </div>
              )}
              <div className="text-left hidden lg:block">
                <p className="font-bold text-slate-800 truncate max-w-[120px]">
                  {currentUser?.Nama}
                </p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      currentUser?.Role === 'Guru' ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`}
                  />
                  {currentUser?.Role} • {currentUser?.Kelas}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Akun Aktif
                    </p>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">
                      {currentUser?.Nama}
                    </p>
                    <p className="text-xs text-slate-500">{currentUser?.Email}</p>
                    <span className="mt-1.5 inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-bold">
                      {currentUser?.Role === 'Guru' ? '👨‍🏫 Guru Pengampu PAI' : `🎓 Siswa (${currentUser?.Kelas})`}
                    </span>
                  </div>

                  <div className="px-2 py-1 max-h-56 overflow-y-auto">
                    <p className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase">
                      Ganti Akun Demo
                    </p>
                    {allUsers.map((u) => (
                      <button
                        key={u.ID_User}
                        onClick={() => {
                          onSelectUser(u);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-all ${
                          currentUser?.ID_User === u.ID_User
                            ? 'bg-emerald-50 text-emerald-900 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={u.Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt=""
                            className="w-6 h-6 rounded-md object-cover"
                          />
                          <div className="truncate">
                            <span className="block truncate">{u.Nama}</span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              {u.Role} • {u.Kelas}
                            </span>
                          </div>
                        </div>
                        {currentUser?.ID_User === u.ID_User && (
                          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-100 flex flex-col gap-1">
                    {currentUser?.Role === 'Guru' && onOpenProfileModal && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenProfileModal();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold flex items-center gap-2"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                        Perbarui Profil & Foto Guru
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (confirm('Kembalikan semua data ke pengaturan awal?')) {
                          onResetData();
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 rounded-xl font-medium flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Data ke Default
                    </button>
                    
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-medium flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Keluar (Logout)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
