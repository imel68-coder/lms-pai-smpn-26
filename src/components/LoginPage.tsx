import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Sparkles,
  Users,
  Award,
  Search,
  School,
  UserCheck,
  Check,
  Heart,
  Compass,
  Star
} from 'lucide-react';
import { User, Role, ClassRoom } from '../types';

// =========================================================================
// ISLAMIC SVG ICONS & ORNAMENTS
// =========================================================================

// 1. Kubah Masjid & Menara (Mosque Dome & Minaret)
const MosqueIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Main Dome */}
    <path 
      d="M12 3C9.5 5 7 8 7 12V21H17V12C17 8 14.5 5 12 3Z" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    {/* Dome Pinnacle & Crescent */}
    <path d="M12 1.5V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="1.2" r="0.7" fill="currentColor" />
    {/* Center Door Arch */}
    <path 
      d="M10 21V16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16V21" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
    />
    {/* Left Minaret */}
    <path d="M3 11L4.5 7L6 11V21H3V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4.5 5.5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Right Minaret */}
    <path d="M18 11L19.5 7L21 11V21H18V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M19.5 5.5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Base line */}
    <path d="M2 21H22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// 2. Bulan Sabit & Bintang Islami (Islamic Crescent & Star)
const CrescentStarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Crescent Moon */}
    <path 
      d="M15.5 3.5C13.2 4.6 11.5 7 11.5 9.8C11.5 13.7 14.6 16.8 18.5 16.8C19.7 16.8 20.8 16.5 21.8 15.9C20.6 19.5 17.1 22 13 22C7.5 22 3 17.5 3 12C3 6.9 6.8 2.8 11.8 2.1C13.1 2.3 14.4 2.8 15.5 3.5Z" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.15"
    />
    {/* Star */}
    <path 
      d="M19 6L19.7 7.7L21.5 8L20.1 9.2L20.5 11L19 10L17.5 11L17.9 9.2L16.5 8L18.3 7.7L19 6Z" 
      fill="currentColor" 
      stroke="currentColor" 
      strokeWidth="0.5" 
      strokeLinejoin="round" 
    />
  </svg>
);

// 3. Al-Qur'an di atas Rehal (Quran on Rehal Stand)
const QuranRehalIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Open Book Pages */}
    <path 
      d="M12 7C9.5 5.5 5 6 3 7V17C5 16 9.5 15.5 12 17C14.5 15.5 19 16 21 17V7C19 6 14.5 5.5 12 7Z" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="currentColor"
      fillOpacity="0.12"
    />
    {/* Center Spine */}
    <path d="M12 7V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    {/* Quran Verses lines */}
    <path d="M6 10H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M6 13H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M15 10H18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M15 13H18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Crossed Rehal Stand */}
    <path d="M5 21L12 17L19 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 18.5L16 18.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// 4. Lentera Islami / Fanous Ramadhan (Islamic Lantern)
const LanternIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Hanging Ring & Chain */}
    <circle cx="12" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M12 4V6" stroke="currentColor" strokeWidth="1.4" />
    {/* Top Cap */}
    <path d="M8 8L12 6L16 8H8Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    {/* Glass Body */}
    <path d="M8 8L6.5 14H17.5L16 8H8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
    {/* Center Flame / Light */}
    <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    {/* Bottom Base */}
    <path d="M6.5 14L8 18H16L17.5 14" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M10 18L12 21L14 18" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

// 5. Bintang 8 Penjuru Islami (Rub el Hizb ۞ Octagram)
const RubElHizbIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* First Square */}
    <rect x="5" y="5" width="14" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" transform="rotate(0 12 12)" />
    {/* Second Square rotated 45 deg */}
    <rect x="5" y="5" width="14" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" transform="rotate(45 12 12)" />
    {/* Center Circle */}
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

// 6. Gerbang Mihrab Lengkung Islami (Islamic Arch Mihrab)
const MihrabIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path 
      d="M4 21V10C4 6 7.5 3 12 2C16.5 3 20 6 20 10V21" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
    />
    <path 
      d="M7 21V12C7 9.5 9 7.5 12 6.5C15 7.5 17 9.5 17 12V21" 
      stroke="currentColor" 
      strokeWidth="1.4" 
      strokeLinecap="round" 
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path d="M2 21H22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="10" r="1" fill="currentColor" />
  </svg>
);

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  availableUsers: User[];
  classes?: ClassRoom[];
  onOpenGasModal: () => void;
  gasUrl: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  availableUsers,
  classes = [],
  onOpenGasModal,
  gasUrl,
}) => {
  // Active Tab: 'Siswa' | 'Guru'
  const [activePortal, setActivePortal] = useState<Role>('Siswa');
  
  // Student Login State (No password required!)
  const [selectedKelas, setSelectedKelas] = useState<string>('VII-A');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');

  // Teacher Login State (Requires password / credentials)
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Common UI State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // List of student and teacher users
  const studentUsers = useMemo(() => availableUsers.filter((u) => u.Role === 'Siswa'), [availableUsers]);
  const teacherUsers = useMemo(() => availableUsers.filter((u) => u.Role === 'Guru'), [availableUsers]);

  // Unique list of classes
  const classList = useMemo(() => {
    const fromClasses = classes.map((c) => c.Nama_Kelas);
    const fromUsers = studentUsers.map((u) => u.Kelas).filter(Boolean);
    const combined = Array.from(new Set([...fromClasses, ...fromUsers]));
    return combined.length > 0 ? combined : ['VII-A', 'VII-B', 'VIII-A', 'IX-A'];
  }, [classes, studentUsers]);

  // Ensure default selected class exists
  React.useEffect(() => {
    if (classList.length > 0 && !classList.includes(selectedKelas)) {
      setSelectedKelas(classList[0]);
    }
  }, [classList, selectedKelas]);

  // Students belonging to the currently selected class
  const studentsInSelectedClass = useMemo(() => {
    return studentUsers.filter((s) => s.Kelas === selectedKelas);
  }, [studentUsers, selectedKelas]);

  // Filtered students by search query
  const filteredStudentsInClass = useMemo(() => {
    if (!studentSearchQuery.trim()) return studentsInSelectedClass;
    const q = studentSearchQuery.toLowerCase();
    return studentsInSelectedClass.filter(
      (s) =>
        s.Nama.toLowerCase().includes(q) ||
        s.ID_User.toLowerCase().includes(q) ||
        (s.NIS && s.NIS.toLowerCase().includes(q)) ||
        (s.NISN && s.NISN.toLowerCase().includes(q))
    );
  }, [studentsInSelectedClass, studentSearchQuery]);

  // Currently selected student object
  const selectedStudent = useMemo(() => {
    return studentUsers.find((s) => s.ID_User === selectedStudentId);
  }, [studentUsers, selectedStudentId]);

  // Handle Student Login (No password needed!)
  const handleStudentLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!selectedStudentId) {
      setErrorMessage('Silakan pilih nama siswa terlebih dahulu.');
      return;
    }

    const studentToLogin = studentUsers.find((s) => s.ID_User === selectedStudentId);
    if (!studentToLogin) {
      setErrorMessage('Data siswa tidak ditemukan.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(studentToLogin);
    }, 250);
  };

  // Handle Teacher Login
  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = teacherEmail.trim().toLowerCase();
    const cleanPass = teacherPassword.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMessage('Silakan masukkan email dan password guru.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const matchedUser = teacherUsers.find(
        (u) => u.Email.toLowerCase().trim() === cleanEmail
      );

      if (!matchedUser) {
        setErrorMessage('Akun guru dengan email tersebut tidak ditemukan.');
        setIsLoading(false);
        return;
      }

      if (matchedUser.Password && matchedUser.Password !== cleanPass) {
        setErrorMessage('Password guru salah. Silakan periksa kembali.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onLoginSuccess(matchedUser);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-950 via-sky-900 to-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white relative overflow-hidden font-sans">
      
      {/* ========================================================= */}
      {/* 1. BACKGROUND: MAKKAH ROYAL CLOCK TOWER (ABRAJ AL BAIT)   */}
      {/*    ILLUMINATED AT NIGHT WITH FLASHING GREEN BEACON LIGHTS  */}
      {/* ========================================================= */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=85&w=1920&auto=format&fit=crop')`,
        }}
      />

      {/* Fallback & Layered Background Visual of Mecca Royal Clock Tower at Night */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=85&w=1920&auto=format&fit=crop')`,
        }}
      />

      {/* Dynamic Emerald Green Atmospheric Aura & Night Sky Shading */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-sky-950/80 to-slate-950/95 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-sky-950/70 to-emerald-950/60 pointer-events-none" />

      {/* ========================================================= */}
      {/* 2. MAKKAH CLOCK TOWER GREEN LIGHTS & LASER BEAMS (BERKELIP) */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* Giant Green Light Corona / Aura pulsing at the top center (Clock Pinnacle) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/25 rounded-full blur-3xl animate-tower-aura"></div>
        
        {/* Vertical Green Light Beams / Laser from Clock Spire (Pulsing to the sky) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[550px] bg-gradient-to-t from-transparent via-emerald-400/30 to-emerald-300/80 blur-md animate-green-laser"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-[650px] bg-emerald-300 blur-[1px] animate-green-strobe"></div>

        {/* Diagonal Green Laser Beams emitted across the Makkah Sky */}
        <div className="absolute -top-10 left-[46%] w-1 h-[700px] bg-gradient-to-b from-emerald-300 via-emerald-400/40 to-transparent rotate-[28deg] blur-[1px] animate-green-strobe origin-top"></div>
        <div className="absolute -top-10 left-[54%] w-1 h-[700px] bg-gradient-to-b from-emerald-300 via-emerald-400/40 to-transparent -rotate-[28deg] blur-[1px] animate-green-strobe-offset origin-top"></div>
        <div className="absolute -top-10 left-[42%] w-0.5 h-[800px] bg-gradient-to-b from-emerald-400 via-emerald-500/30 to-transparent rotate-[42deg] blur-[1px] animate-green-laser origin-top"></div>
        <div className="absolute -top-10 left-[58%] w-0.5 h-[800px] bg-gradient-to-b from-emerald-400 via-emerald-500/30 to-transparent -rotate-[42deg] blur-[1px] animate-green-laser origin-top"></div>

        {/* Flashing Green Beacon Nodes (Lampu Hijau Berkelip-Kelip) */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-400 blur-xs animate-green-strobe shadow-[0_0_20px_#10b981]"></div>
        <div className="absolute top-28 left-[49%] w-4 h-4 rounded-full bg-emerald-300 blur-[1px] animate-green-strobe-offset shadow-[0_0_15px_#34d399]"></div>
        <div className="absolute top-28 left-[51%] w-4 h-4 rounded-full bg-emerald-300 blur-[1px] animate-green-strobe-offset shadow-[0_0_15px_#34d399]"></div>
        <div className="absolute top-44 left-[48%] w-3 h-3 rounded-full bg-emerald-400 blur-[1px] animate-green-strobe shadow-[0_0_12px_#10b981]"></div>
        <div className="absolute top-44 left-[52%] w-3 h-3 rounded-full bg-emerald-400 blur-[1px] animate-green-strobe shadow-[0_0_12px_#10b981]"></div>

        {/* Twinkling Islamic Star Flares (Kelap-Kelip) */}
        <div className="absolute top-16 left-[30%] text-emerald-400 animate-sparkle-1">
          <Star className="w-5 h-5 fill-emerald-300 drop-shadow-[0_0_10px_#10b981]" />
        </div>
        <div className="absolute top-24 right-[28%] text-emerald-300 animate-sparkle-2">
          <Star className="w-6 h-6 fill-emerald-200 drop-shadow-[0_0_12px_#34d399]" />
        </div>
        <div className="absolute top-36 left-[22%] text-emerald-400 animate-sparkle-3">
          <Star className="w-4 h-4 fill-emerald-300 drop-shadow-[0_0_8px_#10b981]" />
        </div>
        <div className="absolute top-40 right-[20%] text-emerald-300 animate-sparkle-1">
          <Star className="w-5 h-5 fill-emerald-200 drop-shadow-[0_0_10px_#34d399]" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. ANIMATED DRIFTING CLOUDS (Awan yang bergerak-gerak)     */}
      {/* ========================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Cloud Layer 1: Wispy High Clouds (Slow Drifting) */}
        <div className="absolute -top-10 left-0 w-[200vw] h-48 opacity-30 animate-cloud-slow">
          <svg viewBox="0 0 1200 200" className="w-full h-full fill-sky-100/80 filter blur-md">
            <path d="M50 120 Q120 60 220 90 Q290 40 400 80 Q510 50 620 90 Q720 30 840 75 Q960 40 1080 85 Q1180 50 1250 110 L1250 200 L0 200 Z" />
          </svg>
        </div>

        {/* Cloud Layer 2: Fluffy Mid-Level Clouds (Medium Speed) */}
        <div className="absolute top-12 left-0 w-[220vw] h-56 opacity-35 animate-cloud-medium">
          <svg viewBox="0 0 1400 220" className="w-full h-full fill-emerald-100/70 filter blur-xs">
            <path d="M0 160 Q80 100 180 120 Q260 70 380 95 Q490 60 600 110 Q700 80 800 100 Q920 65 1040 115 Q1160 80 1280 125 Q1350 100 1400 140 L1400 220 L0 220 Z" />
            <circle cx="200" cy="110" r="45" />
            <circle cx="420" cy="90" r="55" />
            <circle cx="680" cy="95" r="50" />
            <circle cx="950" cy="85" r="60" />
            <circle cx="1200" cy="100" r="45" />
          </svg>
        </div>

        {/* Cloud Layer 3: Soft Low Clouds (Fast & Gentle Breeze) */}
        <div className="absolute top-28 left-0 w-[240vw] h-44 opacity-25 animate-cloud-fast">
          <svg viewBox="0 0 1600 180" className="w-full h-full fill-sky-50 filter blur-sm">
            <path d="M0 130 Q100 80 220 100 Q320 60 450 85 Q580 50 720 95 Q850 70 980 90 Q1120 55 1260 105 Q1400 70 1520 110 L1600 130 L1600 180 L0 180 Z" />
          </svg>
        </div>

        {/* Subtle Bottom Night Shadow */}
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
      </div>

      {/* Decorative Islamic Star & Sky Blue Glowing Background Elements */}
      <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Islamic Icons in Background */}
      <div className="absolute top-24 right-[12%] text-sky-300/20 pointer-events-none hidden xl:block animate-gentle-float">
        <LanternIcon className="w-16 h-16" />
      </div>
      <div className="absolute top-40 left-[6%] text-sky-300/20 pointer-events-none hidden xl:block animate-gentle-float">
        <CrescentStarIcon className="w-14 h-14" />
      </div>
      <div className="absolute bottom-20 left-[16%] text-sky-400/15 pointer-events-none hidden xl:block">
        <RubElHizbIcon className="w-12 h-12" />
      </div>
      <div className="absolute bottom-28 right-[8%] text-sky-400/20 pointer-events-none hidden xl:block">
        <MosqueIcon className="w-20 h-20" />
      </div>

      {/* ========================================================= */}
      {/* Top Header Bar */}
      {/* ========================================================= */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* Mosque & Quran Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-sky-500 to-cyan-300 p-0.5 shadow-xl shadow-sky-500/25 relative group shrink-0">
            <div className="w-full h-full bg-sky-950/90 rounded-[14px] flex items-center justify-center backdrop-blur-xs text-sky-300 group-hover:text-amber-300 transition-colors">
              <MosqueIcon className="w-6 h-6" />
            </div>
            <span className="absolute -bottom-1 -right-1 p-0.5 bg-amber-400 text-sky-950 rounded-full shadow-xs">
              <RubElHizbIcon className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-white text-base sm:text-lg md:text-xl tracking-tight flex items-center gap-1.5 drop-shadow-md">
                <span>LMS PAI SMP NEGERI 26 SIJUNJUNG</span>
                <span className="text-amber-300 text-xs hidden sm:inline">✦</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/25 text-sky-200 border border-sky-400/40 flex items-center gap-1 backdrop-blur-xs">
                <CrescentStarIcon className="w-3 h-3 text-amber-300" />
                <span>Pendidikan Agama Islam</span>
              </span>
            </div>
            <p className="text-xs text-sky-200/90 hidden sm:block font-medium drop-shadow-xs">
              pembelajaran pai yang interaktif dan inovatif
            </p>
          </div>
        </div>

        {/* Top Right: Islamic Calligraphy Badge & Google Sheets Link */}
        <div className="flex items-center gap-2.5">
          {/* Complete Bismillah in One Single Line */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-sky-950/80 border border-sky-500/40 text-amber-300 text-sm font-serif shadow-xl shadow-sky-950/60 backdrop-blur-md whitespace-nowrap">
            <RubElHizbIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold tracking-wide">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          </div>

          {/* Cloud BaaS & Database Config Button */}
          <button
            onClick={onOpenGasModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold border border-emerald-400/40 bg-emerald-950/70 text-emerald-200 hover:bg-emerald-900/80 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer backdrop-blur-md"
            title="Cloud Firestore BaaS Aktif & Sinkronisasi Netlify"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline font-bold">
              Cloud BaaS Aktif
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* Main Login Card & Hero Grid */}
      {/* ========================================================= */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-8 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Islamic LMS Highlights */}
          <div className="lg:col-span-5 space-y-5 text-left">
            
            {/* Top row: Islamic Greeting & Full Bismillah */}
            <div className="flex flex-col gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-sky-500/10 border border-sky-400/40 text-sky-200 text-xs font-medium backdrop-blur-xs shadow-lg shadow-sky-950/40 w-fit">
                <RubElHizbIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Assalamu'alaikum Warahmatullahi Wabarakatuh</span>
              </div>

              {/* Full Bismillah in one continuous line */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-sky-950/80 border border-sky-400/40 text-amber-300 shadow-xl shadow-sky-950/60 backdrop-blur-md w-fit">
                <CrescentStarIcon className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="font-serif text-sm sm:text-base font-bold whitespace-nowrap tracking-wider">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>
            </div>

            {/* Hero Title with Sky Blue & Gold Hue */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                LMS PAI Digital <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-amber-300">
                  SMP Negeri 26 Sijunjung
                </span>
              </h2>
              <p className="text-sky-100/90 text-xs sm:text-sm leading-relaxed max-w-xl">
                Platform pembelajaran Pendidikan Agama Islam dan Budi Pekerti yang interaktif, menyenangkan, dan inovatif. Membantu peserta didik memahami materi, menyimak video tadabbur, dan berakhlak mulia.
              </p>
            </div>

            {/* Islamic Motivational Quote Banner */}
            <div className="p-3.5 rounded-2xl bg-sky-950/70 border border-sky-800/80 backdrop-blur-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-sky-400/30">
                <QuranRehalIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-sky-100 italic">
                  "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ"
                </p>
                <p className="text-[11px] text-sky-300/80 mt-0.5">
                  "Menuntut ilmu itu wajib atas setiap Muslim." (HR. Ibnu Majah)
                </p>
              </div>
            </div>

            {/* Feature Badges with Islamic Icons */}
            <div className="grid grid-cols-2 gap-3 max-w-lg pt-1">
              {/* Feature 1 */}
              <div className="p-3.5 rounded-2xl bg-sky-900/40 border border-sky-700/50 backdrop-blur-xs flex items-start gap-3 hover:bg-sky-900/60 transition-all">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 border border-sky-400/30">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    <span>Login Siswa Praktis</span>
                  </h4>
                  <p className="text-[11px] text-sky-200/70 mt-0.5">Pilih rombel & nama tanpa password</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-3.5 rounded-2xl bg-sky-900/40 border border-sky-700/50 backdrop-blur-xs flex items-start gap-3 hover:bg-sky-900/60 transition-all">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-400/30">
                  <MosqueIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Materi & Tadabbur</h4>
                  <p className="text-[11px] text-sky-200/70 mt-0.5">Presentasi Canva, PPT, & video YouTube</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-3.5 rounded-2xl bg-sky-900/40 border border-sky-700/50 backdrop-blur-xs flex items-start gap-3 hover:bg-sky-900/60 transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Refleksi Diri</h4>
                  <p className="text-[11px] text-sky-200/70 mt-0.5">Muhasabah & rangkuman pemahaman</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-3.5 rounded-2xl bg-sky-900/40 border border-sky-700/50 backdrop-blur-xs flex items-start gap-3 hover:bg-sky-900/60 transition-all">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sinkronisasi Cloud</h4>
                  <p className="text-[11px] text-sky-200/70 mt-0.5">Tersimpan rapi di Google Sheets</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Portal Login Card in Sky Blue Islamic Glassmorphism */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-xl bg-gradient-to-b from-sky-900/80 via-sky-950/90 to-slate-950/95 border border-sky-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/80 backdrop-blur-xl relative overflow-hidden">
              
              {/* Top Card Islamic Ornament Ribbon */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-cyan-300 via-amber-300 to-sky-400"></div>

              {/* Background Islamic Star Watermark */}
              <div className="absolute -right-8 -bottom-8 text-sky-500/5 pointer-events-none">
                <RubElHizbIcon className="w-48 h-48" />
              </div>

              {/* Role Portal Switcher Tabs */}
              <div className="grid grid-cols-2 p-1.5 bg-sky-950/90 rounded-2xl border border-sky-800/80 mb-6 shadow-inner">
                {/* Siswa Portal Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('Siswa');
                    setErrorMessage(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activePortal === 'Siswa'
                      ? 'bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-600/40 ring-1 ring-sky-300/40'
                      : 'text-sky-300/70 hover:text-white hover:bg-sky-900/40'
                  }`}
                >
                  <QuranRehalIcon className="w-4 h-4 text-amber-300" />
                  <span>Portal Siswa</span>
                </button>

                {/* Guru / Admin Portal Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('Guru');
                    setErrorMessage(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activePortal === 'Guru'
                      ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 text-white shadow-lg shadow-indigo-600/40 ring-1 ring-sky-300/40'
                      : 'text-sky-300/70 hover:text-white hover:bg-sky-900/40'
                  }`}
                >
                  <MihrabIcon className="w-4 h-4 text-amber-300" />
                  <span>Portal Guru / Admin</span>
                </button>
              </div>

              {/* Portal Header Intro */}
              <div className="mb-5 text-left flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    {activePortal === 'Siswa' ? (
                      <>
                        <LanternIcon className="w-5 h-5 text-amber-300" />
                        <span>Masuk Sebagai Siswa PAI</span>
                      </>
                    ) : (
                      <>
                        <MosqueIcon className="w-5 h-5 text-sky-400" />
                        <span>Portal Guru Pengampu / Admin</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs text-sky-200/70 mt-1">
                    {activePortal === 'Siswa'
                      ? 'Pilih rombel kelas, temukan nama kamu, dan klik Masuk untuk mulai belajar.'
                      : 'Masukkan email akun belajar dan kata sandi Guru Pengampu PAI.'}
                  </p>
                </div>

                <span className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 font-bold flex items-center gap-1">
                  <RubElHizbIcon className="w-3 h-3 text-amber-300" />
                  <span>{activePortal === 'Siswa' ? 'Tanpa Password' : 'Amanah Guru'}</span>
                </span>
              </div>

              {/* Error Notification */}
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ========================================================= */}
              {/* SISWA LOGIN FORM (NO PASSWORD - SELECT CLASS & NAME) */}
              {/* ========================================================= */}
              {activePortal === 'Siswa' ? (
                <div className="space-y-5 text-left">
                  
                  {/* Step 1: Pilih Rombel Kelas (Islamic Sky Blue Badges) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-sky-100 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CrescentStarIcon className="w-4 h-4 text-amber-300" />
                        <span>1. Pilih Kelas / Rombel Belajar:</span>
                      </span>
                      <span className="text-[11px] text-sky-300 font-bold bg-sky-900/60 px-2 py-0.5 rounded-md border border-sky-700/60">
                        Kelas Aktif: {selectedKelas}
                      </span>
                    </label>

                    {/* Class Selector Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {classList.map((clsName) => {
                        const isSelected = selectedKelas === clsName;
                        const studentCountInCls = studentUsers.filter((s) => s.Kelas === clsName).length;
                        return (
                          <button
                            key={clsName}
                            type="button"
                            onClick={() => {
                              setSelectedKelas(clsName);
                              setSelectedStudentId('');
                              setErrorMessage(null);
                            }}
                            className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden ${
                              isSelected
                                ? 'bg-gradient-to-b from-sky-600 to-sky-700 border-sky-300 text-white shadow-lg shadow-sky-900/50 ring-2 ring-sky-400'
                                : 'bg-sky-950/70 border-sky-800/80 text-sky-200/80 hover:bg-sky-900/60 hover:border-sky-600'
                            }`}
                          >
                            {isSelected && (
                              <span className="absolute top-1 right-1 text-amber-300">
                                <RubElHizbIcon className="w-3 h-3" />
                              </span>
                            )}
                            <span className="font-black text-sm sm:text-base">
                              {clsName}
                            </span>
                            <span className="text-[10px] text-sky-200/70 mt-0.5">
                              {studentCountInCls} Siswa
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Pilih Nama Siswa */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-sky-100 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-sky-400" />
                        <span>2. Pilih Nama Kamu di Kelas {selectedKelas}:</span>
                      </label>
                      <span className="text-[11px] text-sky-300/80">
                        {filteredStudentsInClass.length} nama ditemukan
                      </span>
                    </div>

                    {/* Search box for students in class */}
                    {studentsInSelectedClass.length > 4 && (
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={studentSearchQuery}
                          onChange={(e) => setStudentSearchQuery(e.target.value)}
                          placeholder={`Ketik untuk mencari nama siswa di kelas ${selectedKelas}...`}
                          className="w-full pl-9 pr-3 py-2 bg-sky-950/80 border border-sky-800 rounded-xl text-xs text-white placeholder-sky-400/50 focus:outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                        />
                      </div>
                    )}

                    {/* Student List Cards (Click to Select / Login) */}
                    <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                      {filteredStudentsInClass.length === 0 ? (
                        <div className="p-4 rounded-xl bg-sky-950/50 border border-sky-800 text-center text-xs text-sky-300/70">
                          {studentSearchQuery 
                            ? `Tidak ada siswa dengan nama "${studentSearchQuery}" di kelas ${selectedKelas}.`
                            : `Belum ada siswa terdaftar di kelas ${selectedKelas}.`}
                        </div>
                      ) : (
                        filteredStudentsInClass.map((student) => {
                          const isSelected = selectedStudentId === student.ID_User;
                          return (
                            <button
                              key={student.ID_User}
                              type="button"
                              onClick={() => {
                                setSelectedStudentId(student.ID_User);
                                setErrorMessage(null);
                              }}
                              className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer group ${
                                isSelected
                                  ? 'bg-sky-900/90 border-sky-400 text-white ring-1 ring-sky-400 shadow-md shadow-sky-950'
                                  : 'bg-sky-950/60 hover:bg-sky-900/50 border-sky-800/70 text-sky-100'
                              }`}
                            >
                              <div className="flex items-center gap-3 truncate">
                                <div className="relative shrink-0">
                                  <img
                                    src={student.Avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                                    alt=""
                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-400/40"
                                  />
                                  {isSelected && (
                                    <span className="absolute -bottom-1 -right-1 p-0.5 bg-amber-400 text-sky-950 rounded-full">
                                      <Check className="w-2.5 h-2.5 font-bold" />
                                    </span>
                                  )}
                                </div>

                                <div className="truncate">
                                  <p className="text-xs font-bold truncate group-hover:text-sky-300 transition-colors">
                                    {student.Nama}
                                  </p>
                                  <p className="text-[10px] text-sky-300/70">
                                    {student.NIS ? `NIS: ${student.NIS} • ` : (student.NISN ? `NIS: ${student.NISN} • ` : '')}Kelas {student.Kelas}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {isSelected ? (
                                  <span className="px-2 py-0.5 rounded-md bg-sky-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                                    <RubElHizbIcon className="w-3 h-3 text-amber-300" />
                                    Terpilih
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-semibold text-sky-400/80 group-hover:text-sky-200 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Pilih <ArrowRight className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Big Login Button in Sky Blue Islamic Gradient */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isLoading || !selectedStudentId}
                      onClick={() => handleStudentLogin()}
                      className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-black text-sm shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] border border-sky-300/30"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <QuranRehalIcon className="w-5 h-5 text-amber-300" />
                          <span>
                            {selectedStudent 
                              ? `Masuk Sebagai ${selectedStudent.Nama} (${selectedStudent.Kelas})` 
                              : `Pilih Nama Siswa untuk Masuk`}
                          </span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-sky-300/90 mt-2.5 flex items-center justify-center gap-1.5">
                      <RubElHizbIcon className="w-3.5 h-3.5 text-amber-300" />
                      <span>Siswa cukup memilih kelas dan nama untuk langsung belajar. Bismillah!</span>
                    </p>
                  </div>

                </div>
              ) : (
                /* ========================================================= */
                /* GURU / ADMIN LOGIN FORM (WITH EMAIL & PASSWORD) */
                /* ========================================================= */
                <form onSubmit={handleTeacherSubmit} className="space-y-4 text-left">
                  
                  {/* Islamic Guru Intro Note */}
                  <div className="p-3 bg-sky-900/40 rounded-xl border border-sky-700/60 flex items-center gap-2.5 text-sky-200 text-xs">
                    <MihrabIcon className="w-4 h-4 text-amber-300 shrink-0" />
                    <p className="text-[11px] leading-relaxed">
                      Portal Manajemen Pembelajaran, Penilaian Tugas & Pengelolaan Materi Guru PAI.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-sky-100 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                      <span>Email Akun Belajar Guru / Admin</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                        placeholder="imel68@guru.smp.belajar.id"
                        className="w-full bg-sky-950/80 border border-sky-800 rounded-xl pl-3.5 pr-4 py-2.5 text-sm text-white placeholder-sky-400/50 focus:outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-sky-100 mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-sky-400" />
                      <span>Password Guru</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={teacherPassword}
                        onChange={(e) => setTeacherPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-sky-950/80 border border-sky-800 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-sky-400/50 focus:outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-sky-300 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded bg-sky-950 border-sky-800 text-sky-500 focus:ring-sky-500"
                      />
                      <span>Ingat Sesi Guru</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-black text-sm shadow-xl shadow-indigo-700/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.99] cursor-pointer border border-sky-300/30"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <MosqueIcon className="w-4 h-4 text-amber-300" />
                        <span>Masuk ke Portal Manajemen Guru</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <div className="p-3 bg-sky-950/50 rounded-xl border border-sky-800/60 text-sky-300/80 text-[11px] flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Halaman ini khusus Guru Pengampu & Admin. Autentikasi dilindungi kata sandi.</span>
                    </div>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* ========================================================= */}
      {/* Footer Info with Islamic Nuance */}
      {/* ========================================================= */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-sky-200/70 border-t border-sky-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 backdrop-blur-xs">
        <p className="flex items-center gap-1.5 justify-center">
          <RubElHizbIcon className="w-3.5 h-3.5 text-amber-300" />
          <span>LMS Pendidikan Agama Islam • SMP Negeri 26 Sijunjung</span>
        </p>
        <p className="text-[11px] text-sky-300/60 flex items-center gap-1.5 justify-center">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Makkah Royal Clock Tower (Abraj Al Bait)</span>
          </span>
          <span>•</span>
          <span>Google Sheets Cloud Sync</span>
        </p>
      </footer>

    </div>
  );
};
