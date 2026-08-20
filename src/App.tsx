/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { GasSetupModal } from './components/GasSetupModal';
import { LoginPage } from './components/LoginPage';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import { apiService } from './services/apiService';
import { User, Material, Assignment, Submission, Grade, AppStateData, ClassRoom } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(apiService.getCurrentUser());
  const [appData, setAppData] = useState<AppStateData>(apiService.getLocalData());
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [isTeacherProfileOpen, setIsTeacherProfileOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'gradebook'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Load initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.fetchAllData();
      setAppData(res.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data and subscribe to real-time Cloud Firestore updates
  useEffect(() => {
    loadData();

    // Real-time BaaS listener for multi-device sync
    const unsubscribe = apiService.subscribeToRealtimeUpdates((freshData) => {
      setAppData(freshData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle user change
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    apiService.setCurrentUser(user);
  };

  // Handle user logout
  const handleLogout = () => {
    setCurrentUser(null);
    apiService.setCurrentUser(null);
  };

  // Reset demo data
  const handleResetData = () => {
    const fresh = apiService.resetToDefault();
    setAppData(fresh);
    showToast('Data berhasil dikembalikan ke default.');
  };

  // Handle class creation/update
  const handleSaveClass = async (classRoom: ClassRoom) => {
    await apiService.saveClass(classRoom);
    setAppData(apiService.getLocalData());
    showToast(`Rombel Kelas ${classRoom.Nama_Kelas} berhasil disimpan!`);
  };

  // Handle class deletion
  const handleDeleteClass = async (classId: string) => {
    await apiService.deleteClass(classId);
    setAppData(apiService.getLocalData());
    showToast('Rombel kelas berhasil dihapus!');
  };

  // Handle user creation/update (e.g. transfer student class or update teacher profile)
  const handleSaveUser = async (user: User) => {
    await apiService.saveUser(user);
    const updatedData = apiService.getLocalData();
    setAppData(updatedData);
    if (currentUser && currentUser.ID_User === user.ID_User) {
      setCurrentUser(user);
      apiService.setCurrentUser(user);
    }
  };

  // Handle batch user import
  const handleSaveBatchUsers = async (newUsers: User[]) => {
    await apiService.saveBatchUsers(newUsers);
    setAppData(apiService.getLocalData());
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    await apiService.deleteUser(userId);
    setAppData(apiService.getLocalData());
    showToast('Data siswa berhasil dihapus!');
  };

  // Handle delete all students (or all students in selected class)
  const handleDeleteAllStudents = async (targetClass?: string) => {
    const res = await apiService.deleteAllStudents(targetClass);
    setAppData(apiService.getLocalData());
    showToast(`Berhasil menghapus ${res.count} data siswa!`);
  };

  // Handle material creation/update by teacher
  const handleSaveMaterial = async (material: Material) => {
    await apiService.saveMaterial(material);
    setAppData(apiService.getLocalData());
  };

  // Handle material deletion by teacher
  const handleDeleteMaterial = async (materialId: string) => {
    await apiService.deleteMaterial(materialId);
    setAppData(apiService.getLocalData());
  };

  // Handle assignment creation/update by teacher
  const handleSaveAssignment = async (assignment: Assignment) => {
    await apiService.saveAssignment(assignment);
    setAppData(apiService.getLocalData());
  };

  // Handle assignment deletion by teacher
  const handleDeleteAssignment = async (assignmentId: string) => {
    await apiService.deleteAssignment(assignmentId);
    setAppData(apiService.getLocalData());
  };

  // Handle assignment submission by student
  const handleSubmitAssignment = async (payload: {
    ID_Assignment: string;
    ID_Student: string;
    Link_Tugas: string;
    Catatan_Siswa?: string;
  }) => {
    await apiService.submitAssignment(payload);
    setAppData(apiService.getLocalData());
    showToast('Tugas PAI berhasil dikirim ke guru!');
  };

  // Handle grading by teacher
  const handleSaveGrade = async (payload: {
    ID_Submission: string;
    ID_Student: string;
    ID_Assignment: string;
    Nilai: number;
    Catatan_Guru: string;
    Nama_Penilai?: string;
  }) => {
    await apiService.saveGrade(payload);
    setAppData(apiService.getLocalData());
  };

  // Handle student reflection submission
  const handleSaveReflection = async (payload: {
    ID_Material: string;
    ID_Student: string;
    Poin_Penting?: string;
    Kesimpulan: string;
    Hal_Disukai?: string;
    Pertanyaan_Siswa?: string;
  }) => {
    await apiService.saveReflection(payload);
    setAppData(apiService.getLocalData());
    showToast('Refleksi & kesimpulan materi berhasil disimpan!');
  };

  // Handle teacher reflection response
  const handleRespondReflection = async (reflectionId: string, tanggapan: string) => {
    await apiService.respondToReflection(reflectionId, tanggapan);
    setAppData(apiService.getLocalData());
  };

  // Calculate progression for current student
  const studentProgression = currentUser?.Role === 'Siswa'
    ? apiService.calculateProgress(currentUser.ID_User, appData)
    : {};

  // If no user is logged in, display the dedicated Login Page (Student & Teacher Portals)
  if (!currentUser) {
    return (
      <>
        <LoginPage
          onLoginSuccess={handleSelectUser}
          availableUsers={appData.users}
          classes={appData.classes || []}
          onOpenGasModal={() => setIsGasModalOpen(true)}
          gasUrl={apiService.getGasUrl()}
        />
        <GasSetupModal
          isOpen={isGasModalOpen}
          onClose={() => setIsGasModalOpen(false)}
          onUrlUpdated={() => loadData()}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        allUsers={appData.users}
        onSelectUser={handleSelectUser}
        onLogout={handleLogout}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        onResetData={handleResetData}
        onOpenProfileModal={() => setIsTeacherProfileOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentUser?.Role === 'Guru' ? (
          <TeacherDashboard
            currentUser={currentUser}
            users={appData.users}
            classes={appData.classes || []}
            materials={appData.materials}
            assignments={appData.assignments}
            submissions={appData.submissions}
            grades={appData.grades}
            reflections={appData.reflections || []}
            onSaveMaterial={handleSaveMaterial}
            onDeleteMaterial={handleDeleteMaterial}
            onSaveAssignment={handleSaveAssignment}
            onDeleteAssignment={handleDeleteAssignment}
            onSaveGrade={handleSaveGrade}
            onSaveClass={handleSaveClass}
            onDeleteClass={handleDeleteClass}
            onSaveUser={handleSaveUser}
            onSaveBatchUsers={handleSaveBatchUsers}
            onDeleteUser={handleDeleteUser}
            onDeleteAllStudents={handleDeleteAllStudents}
            onRespondReflection={handleRespondReflection}
            showToast={showToast}
          />
        ) : currentUser ? (
          <StudentDashboard
            student={currentUser}
            materials={appData.materials}
            assignments={appData.assignments}
            submissions={appData.submissions}
            grades={appData.grades}
            reflections={appData.reflections || []}
            progression={studentProgression}
            onSubmitAssignment={handleSubmitAssignment}
            onSaveReflection={handleSaveReflection}
            activeView={activeView}
          />
        ) : null}
      </main>

      {/* Google Apps Script & Google Sheets Architecture Modal */}
      <GasSetupModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        onUrlUpdated={() => loadData()}
      />

      {/* Teacher Profile Modal (triggered globally from Navbar) */}
      {currentUser && currentUser.Role === 'Guru' && (
        <TeacherProfileModal
          isOpen={isTeacherProfileOpen}
          onClose={() => setIsTeacherProfileOpen(false)}
          currentUser={currentUser}
          onSaveUser={handleSaveUser}
          showToast={showToast}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            LMS PAI SMP • Platform Pembelajaran Pendidikan Agama Islam Berbasis Kelas
          </p>
          <p className="text-slate-400 text-[11px]">
            Database Google Sheets: Users, Classes, Materials, Assignments, Submissions, Grades
          </p>
        </div>
      </footer>

    </div>
  );
}
