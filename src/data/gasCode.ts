import { AspekPAI, KategoriTugas } from '../types';

export interface AspekInfo {
  name: AspekPAI;
  shortName: string;
  icon: string;
  badgeColor: string;
  description: string;
}

export const ASPEK_PAI_LIST: AspekInfo[] = [
  {
    name: "Al-Qur'an Hadis",
    shortName: 'Al-Qur\'an & Hadis',
    icon: 'BookOpen',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Kajian ayat suci Al-Qur\'an, kaidah hukum tajwid, hadis nabawi, dan asbabun nuzul.',
  },
  {
    name: 'Akidah',
    shortName: 'Akidah & Iman',
    icon: 'ShieldCheck',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Pemahaman rukun iman, 99 Asmaul Husna, malaikat, hari akhir, dan takdir Allah.',
  },
  {
    name: 'Akhlak',
    shortName: 'Akhlak Terpuji',
    icon: 'HeartHandshake',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Pembiasaan akhlakul karimah (ikhlas, sabar, jujur, pemaaf, tawadhu) serta adab pergaulan.',
  },
  {
    name: 'Fikih',
    shortName: 'Fikih Ibadah',
    icon: 'Sparkles',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Ketentuan ibadah shalat, thaharah, puasa, zakat, haji, sujud sahwi, dan muamalah islami.',
  },
  {
    name: 'Sejarah Kebudayaan Islam (SKI)',
    shortName: 'Sejarah Islam (SKI)',
    icon: 'Compass',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Ibrah dakwah Rasulullah SAW, Khulafaur Rasyidin, peradaban Daulah Islam, dan tokoh pejuang.',
  },
];

export const KATEGORI_TUGAS_OPTIONS: KategoriTugas[] = [
  'LKPD / Tugas Mandiri',
  'Praktik Ibadah & Tilawah',
  'Diskusi Kelompok',
  'Proyek Aksi & Karakter',
  'Uji Kompetensi / Kuis',
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ==============================================================================
 * LMS PAI PROFESIONAL (PENDIDIKAN AGAMA ISLAM) - GOOGLE APPS SCRIPT BACKEND API
 * ==============================================================================
 * Petunjuk Pemasangan:
 * 1. Buka Google Sheets baru di Google Drive Anda.
 * 2. Klik menu "Ekstensi" (Extensions) -> "Apps Script".
 * 3. Hapus semua kode bawaan, lalu salin (paste) SELURUH KODE INI ke editor.
 * 4. Jalankan fungsi 'setupDatabase()' satu kali untuk menginisialisasi sheet:
 *    "Users", "Classes", "Materials", "Assignments", "Submissions", "Grades".
 * 5. Klik "Terapkan" (Deploy) -> "Penerapan Baru" (New Deployment).
 * 6. Pilih Jenis: "Aplikasi Web" (Web App).
 *    - Deskripsi: API LMS PAI SMP v3
 *    - Jalankan sebagai: Saya (Email Anda)
 *    - Yang memiliki akses: Siapa saja (Anyone)
 * 7. Salin URL Aplikasi Web (akhiran /exec) dan simpan di menu Pengaturan GAS.
 * ==============================================================================
 */

// Konstanta Nama Sheet
const SHEET_USERS = "Users";
const SHEET_CLASSES = "Classes";
const SHEET_MATERIALS = "Materials";
const SHEET_ASSIGNMENTS = "Assignments";
const SHEET_SUBMISSIONS = "Submissions";
const SHEET_GRADES = "Grades";
const SHEET_REFLECTIONS = "Reflections";

function doGet(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    const action = params.action || 'getInitData';
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    ensureSheetsExist(ss);

    let responseData = {};

    if (action === 'getInitData') {
      responseData = {
        users: getSheetData(ss.getSheetByName(SHEET_USERS)),
        classes: getSheetData(ss.getSheetByName(SHEET_CLASSES)),
        materials: getSheetData(ss.getSheetByName(SHEET_MATERIALS)),
        assignments: getSheetData(ss.getSheetByName(SHEET_ASSIGNMENTS)),
        submissions: getSheetData(ss.getSheetByName(SHEET_SUBMISSIONS)),
        grades: getSheetData(ss.getSheetByName(SHEET_GRADES)),
        reflections: getSheetData(ss.getSheetByName(SHEET_REFLECTIONS)),
      };
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success', data: responseData })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    ensureSheetsExist(ss);

    if (action === 'submitAssignment') {
      const sheet = ss.getSheetByName(SHEET_SUBMISSIONS);
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idIdx = headers.indexOf('ID_Submission');
      const assIdx = headers.indexOf('ID_Assignment');
      const stdIdx = headers.indexOf('ID_Student');

      let rowFound = -1;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][assIdx]) === String(postData.ID_Assignment) && String(data[i][stdIdx]) === String(postData.ID_Student)) {
          rowFound = i + 1;
          break;
        }
      }

      const now = new Date().toLocaleString('id-ID');
      if (rowFound > 0) {
        sheet.getRange(rowFound, headers.indexOf('Link_Tugas') + 1).setValue(postData.Link_Tugas);
        sheet.getRange(rowFound, headers.indexOf('Catatan_Siswa') + 1).setValue(postData.Catatan_Siswa || '');
        sheet.getRange(rowFound, headers.indexOf('Status') + 1).setValue('Dikirim');
        sheet.getRange(rowFound, headers.indexOf('Tanggal_Kirim') + 1).setValue(now);
      } else {
        const newId = 'SUB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        sheet.appendRow([
          newId,
          postData.ID_Assignment,
          postData.ID_Student,
          postData.Link_Tugas,
          postData.Catatan_Siswa || '',
          postData.Lampiran_File_Siswa || '',
          postData.Lampiran_Nama_File || '',
          'Dikirim',
          now
        ]);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Tugas PAI berhasil disimpan!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'saveReflection') {
      const rSheet = ss.getSheetByName(SHEET_REFLECTIONS);
      const rData = rSheet.getDataRange().getValues();
      const rHeaders = rData[0];
      const matIdx = rHeaders.indexOf('ID_Material');
      const stdIdx = rHeaders.indexOf('ID_Student');

      let rRow = -1;
      for (let i = 1; i < rData.length; i++) {
        if (String(rData[i][matIdx]) === String(postData.ID_Material) && String(rData[i][stdIdx]) === String(postData.ID_Student)) {
          rRow = i + 1;
          break;
        }
      }

      const now = new Date().toLocaleString('id-ID');
      if (rRow > 0) {
        rSheet.getRange(rRow, rHeaders.indexOf('Poin_Penting') + 1).setValue(postData.Poin_Penting || '');
        rSheet.getRange(rRow, rHeaders.indexOf('Kesimpulan') + 1).setValue(postData.Kesimpulan || '');
        rSheet.getRange(rRow, rHeaders.indexOf('Hal_Disukai') + 1).setValue(postData.Hal_Disukai || '');
        rSheet.getRange(rRow, rHeaders.indexOf('Pertanyaan_Siswa') + 1).setValue(postData.Pertanyaan_Siswa || '');
        rSheet.getRange(rRow, rHeaders.indexOf('Tanggal_Diperbarui') + 1).setValue(now);
      } else {
        const newReflId = 'REFL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        rSheet.appendRow([
          newReflId,
          postData.ID_Material,
          postData.ID_Student,
          postData.Poin_Penting || '',
          postData.Kesimpulan || '',
          postData.Hal_Disukai || '',
          postData.Pertanyaan_Siswa || '',
          postData.Tanggapan_Guru || '',
          now,
          now
        ]);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Refleksi pembelajaran berhasil disimpan!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'saveGrade') {
      const gSheet = ss.getSheetByName(SHEET_GRADES);
      const subSheet = ss.getSheetByName(SHEET_SUBMISSIONS);
      
      const gData = gSheet.getDataRange().getValues();
      const gHeaders = gData[0];
      const gSubIdx = gHeaders.indexOf('ID_Submission');

      let gRow = -1;
      for (let i = 1; i < gData.length; i++) {
        if (String(gData[i][gSubIdx]) === String(postData.ID_Submission)) {
          gRow = i + 1;
          break;
        }
      }

      const now = new Date().toLocaleString('id-ID');
      if (gRow > 0) {
        gSheet.getRange(gRow, gHeaders.indexOf('Nilai') + 1).setValue(postData.Nilai);
        gSheet.getRange(gRow, gHeaders.indexOf('Catatan_Guru') + 1).setValue(postData.Catatan_Guru || '');
        gSheet.getRange(gRow, gHeaders.indexOf('Tanggal_Nilai') + 1).setValue(now);
      } else {
        const newGId = 'GRD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        gSheet.appendRow([
          newGId,
          postData.ID_Submission,
          postData.ID_Student,
          postData.ID_Assignment,
          postData.Nilai,
          postData.Catatan_Guru || '',
          now,
          postData.Nama_Penilai || 'Guru PAI'
        ]);
      }

      // Update status submission to Dinilai
      const sData = subSheet.getDataRange().getValues();
      const sHeaders = sData[0];
      const sIdIdx = sHeaders.indexOf('ID_Submission');
      for (let i = 1; i < sData.length; i++) {
        if (String(sData[i][sIdIdx]) === String(postData.ID_Submission)) {
          subSheet.getRange(i + 1, sHeaders.indexOf('Status') + 1).setValue('Dinilai');
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Nilai tersimpan!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'saveBatchUsers' && Array.isArray(postData.users)) {
      const uSheet = ss.getSheetByName(SHEET_USERS);
      const uData = uSheet.getDataRange().getValues();
      const uHeaders = uData[0];
      const idIdx = uHeaders.indexOf('ID_User');
      const namaIdx = uHeaders.indexOf('Nama');
      const klsIdx = uHeaders.indexOf('Kelas');

      postData.users.forEach(function(u) {
        let uRow = -1;
        for (let i = 1; i < uData.length; i++) {
          if (String(uData[i][idIdx]) === String(u.ID_User) || 
             (String(uData[i][namaIdx]).toLowerCase() === String(u.Nama).toLowerCase() && String(uData[i][klsIdx]) === String(u.Kelas))) {
            uRow = i + 1;
            break;
          }
        }

        if (uRow > 0) {
          if (uHeaders.indexOf('Nama') >= 0) uSheet.getRange(uRow, uHeaders.indexOf('Nama') + 1).setValue(u.Nama);
          if (uHeaders.indexOf('Email') >= 0) uSheet.getRange(uRow, uHeaders.indexOf('Email') + 1).setValue(u.Email || '');
          if (uHeaders.indexOf('NIS') >= 0) uSheet.getRange(uRow, uHeaders.indexOf('NIS') + 1).setValue(u.NIS || u.NISN || '');
          if (uHeaders.indexOf('NISN') >= 0) uSheet.getRange(uRow, uHeaders.indexOf('NISN') + 1).setValue(u.NIS || u.NISN || '');
          if (uHeaders.indexOf('Kelas') >= 0) uSheet.getRange(uRow, uHeaders.indexOf('Kelas') + 1).setValue(u.Kelas);
          if (uHeaders.indexOf('Password') >= 0) uSheet.getRange(uRow, uHeaders.indexOf('Password') + 1).setValue(u.Password || 'siswa123');
        } else {
          uSheet.appendRow([
            u.ID_User,
            u.Nama,
            u.Email || '',
            u.Password || 'siswa123',
            'Siswa',
            u.Kelas,
            u.Avatar || '',
            u.NIS || u.NISN || ''
          ]);
        }
      });

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Batch siswa berhasil disimpan ke Google Sheets!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'deleteAllStudents') {
      const uSheet = ss.getSheetByName(SHEET_USERS);
      const uData = uSheet.getDataRange().getValues();
      const uHeaders = uData[0];
      const roleIdx = uHeaders.indexOf('Role');
      const klsIdx = uHeaders.indexOf('Kelas');
      const targetClass = postData.targetClass || 'all';

      // Iterate backwards to safely delete rows
      for (let i = uData.length - 1; i >= 1; i--) {
        const isSiswa = String(uData[i][roleIdx]).toLowerCase() === 'siswa';
        const matchesClass = targetClass === 'all' || String(uData[i][klsIdx]) === targetClass;
        if (isSiswa && matchesClass) {
          uSheet.deleteRow(i + 1);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Data siswa berhasil dihapus dari Google Sheets!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Aksi tidak dikenali' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function ensureSheetsExist(ss) {
  const required = [SHEET_USERS, SHEET_CLASSES, SHEET_MATERIALS, SHEET_ASSIGNMENTS, SHEET_SUBMISSIONS, SHEET_GRADES, SHEET_REFLECTIONS];
  required.forEach(name => {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
    }
  });
}

function getSheetData(sheet) {
  if (!sheet) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  const results = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    results.push(obj);
  }
  return results;
}
`;
