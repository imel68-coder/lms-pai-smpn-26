import { User, Material, Assignment, Submission, Grade, ClassRoom, Reflection } from '../types';
import teacherAvatarImg from '../assets/images/foto_guru_imel_1787212820325.jpg';

export const TEACHER_AVATAR_IMAGE = teacherAvatarImg;

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    ID_Kelas: 'KLS-7A',
    Nama_Kelas: 'VII-A',
    Tingkat: 7,
    Wali_Kelas: 'IMEL, S.Pd, Gr.',
    Tahun_Ajaran: '2026/2027',
    Keterangan: 'Kelas Unggulan Tahfidz & Karakter Islami',
  },
  {
    ID_Kelas: 'KLS-7B',
    Nama_Kelas: 'VII-B',
    Tingkat: 7,
    Wali_Kelas: 'Usth. Sarah Fauziah, S.Pd.',
    Tahun_Ajaran: '2026/2027',
    Keterangan: 'Kelas Bilingual & Penguatan Literasi Qur\'ani',
  },
  {
    ID_Kelas: 'KLS-7C',
    Nama_Kelas: 'VII-C',
    Tingkat: 7,
    Wali_Kelas: 'Ust. Rahmat Hidayat, M.Pd.',
    Tahun_Ajaran: '2026/2027',
    Keterangan: 'Kelas Reguler PAI & Budi Pekerti',
  },
  {
    ID_Kelas: 'KLS-8A',
    Nama_Kelas: 'VIII-A',
    Tingkat: 8,
    Wali_Kelas: 'Usth. Nurul Khotimah, S.Ag.',
    Tahun_Ajaran: '2026/2027',
    Keterangan: 'Kelas Bahasa Arab & Literasi Kitab',
  },
  {
    ID_Kelas: 'KLS-8B',
    Nama_Kelas: 'VIII-B',
    Tingkat: 8,
    Wali_Kelas: 'Ust. Ridwan Kamil, S.Pd.I',
    Tahun_Ajaran: '2026/2027',
    Keterangan: 'Kelas Seni Kaligrafi & Seni Tilawah',
  },
  {
    ID_Kelas: 'KLS-9A',
    Nama_Kelas: 'IX-A',
    Tingkat: 9,
    Wali_Kelas: 'Ust. Dr. M. Syarifuddin, M.A.',
    Tahun_Ajaran: '2026/2027',
    Keterangan: 'Kelas Akhir Persiapan Ujian Standar Nasional',
  },
];

export const INITIAL_USERS: User[] = [
  {
    ID_User: 'USR-GURU-01',
    Nama: 'IMEL, S.Pd, Gr.',
    Email: 'imel68@guru.smp.belajar.id',
    Password: 'guru123',
    Role: 'Guru',
    Kelas: 'Guru PAI SMP',
    Avatar: TEACHER_AVATAR_IMAGE,
  },
  {
    ID_User: 'USR-SISWA-01',
    Nama: 'Ahmad Fauzi Ramadhan',
    Email: 'ahmad@siswa.belajar.id',
    Password: 'siswa123',
    Role: 'Siswa',
    Kelas: 'VII-A',
    NIS: '20260701',
    Avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    ID_User: 'USR-SISWA-02',
    Nama: 'Siti Nur Aisyah',
    Email: 'siti@siswa.belajar.id',
    Password: 'siswa123',
    Role: 'Siswa',
    Kelas: 'VII-A',
    NIS: '20260702',
    Avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    ID_User: 'USR-SISWA-03',
    Nama: 'Dimas Pratama Putra',
    Email: 'dimas@siswa.belajar.id',
    Password: 'siswa123',
    Role: 'Siswa',
    Kelas: 'VII-B',
    NIS: '20260703',
    Avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    ID_User: 'USR-SISWA-04',
    Nama: 'Farah Nabila Azzahra',
    Email: 'farah@siswa.belajar.id',
    Password: 'siswa123',
    Role: 'Siswa',
    Kelas: 'VII-B',
    NIS: '20260704',
    Avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    ID_User: 'USR-SISWA-05',
    Nama: 'Muhammad Zaki Al-Faris',
    Email: 'zaki@siswa.belajar.id',
    Password: 'siswa123',
    Role: 'Siswa',
    Kelas: 'VIII-A',
    NIS: '20250801',
    Avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    ID_User: 'USR-SISWA-06',
    Nama: 'Raihana Salsabila',
    Email: 'raihana@siswa.belajar.id',
    Password: 'siswa123',
    Role: 'Siswa',
    Kelas: 'VII-A',
    NIS: '20260705',
    Avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_MATERIALS: Material[] = [
  // --- MATERI 1: AL-QUR'AN & HADIS ---
  {
    ID_Material: 'MAT-01',
    Bab: 1,
    Judul_Bab: 'Bab 1: Al-Qur’an dan Sunnah Sebagai Pedoman Hidup',
    Judul_Materi: 'Kedudukan Al-Qur\'an & Hadis serta Kaidah Tajwid Alif Lam',
    Aspek_PAI: 'Al-Qur\'an Hadis',
    Target_Kelas: 'Semua Kelas',
    Deskripsi_Singkat: 'Memahami kedudukan hukum Al-Qur’an & Sunnah serta melafalkan bacaan dengan tajwid yang fasih.',
    Target_Kompetensi: 'Memahami ayat Q.S. An-Nisa: 59 dan hukum bacaan Alif Lam Syamsiyah serta Qamariyah dalam kehidupan sehari-hari.',
    Konten: JSON.stringify({
      ayatDalil: {
        surah: 'Q.S. An-Nisa [4]: 59',
        arab: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ أَطِيعُوا۟ ٱللَّهَ وَأَطِيعُوا۟ ٱلرَّسُولَ وَأُو۟لِى ٱلْأَمْرِ مِنكُمْ ۖ فَإِن تَنَٰزَعْتُمْ فِى شَىْءٍ فَرُدُّوهُ إِلَى ٱللَّهِ وَٱلرَّسُولِ',
        arti: 'Wahai orang-orang yang beriman! Taatilah Allah dan taatilah Rasul (Muhammad), dan Ulil Amri (pemegang kekuasaan) di antara kamu. Kemudian, jika kamu berbeda pendapat tentang sesuatu, maka kembalikanlah kepada Allah (Al-Qur’an) dan Rasul (sunnahnya)...'
      },
      ringkasan: 'Al-Qur’an adalah kalamullah yang diturunkan kepada Nabi Muhammad SAW secara mutawatir sebagai pedoman hidup mutlak umat manusia. Hadis berfungsi sebagai bayan (penjelas, penguat, dan perinci) dari ayat-ayat Al-Qur’an. Kita wajib menaati keduanya dalam setiap aspek kehidupan.',
      poinPenting: [
        'Al-Qur’an merupakan sumber hukum Islam tingkat pertama dan utama.',
        'Hadis/Sunnah merupakan sumber hukum kedua yang memerinci pelaksanaan ibadah (seperti tata cara shalat, zakat, puasa).',
        'Hukum bacaan Alif Lam Qamariyah dibaca jelas (izhar), contoh: الْقَمَرِ, sedangkan Alif Lam Syamsiyah diidghamkan, contoh: الشَّمْسِ.',
        'Mengamalkan Al-Qur’an menghasilkan ketenangan jiwa, petunjuk jalan yang lurus, serta keselamatan dunia dan akhirat.'
      ],
      catatanGuru: 'Pastikan siswa menyimak pelafalan tajwid pada video dan mempraktikkan membaca Q.S. An-Nisa: 59 dengan makharijul huruf yang tepat.',
      videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
      videoTitle: 'Video 1: Tajwid Alif Lam & Kajian Q.S. An-Nisa 59',
      videoList: [
        {
          id: 'v1',
          url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
          title: 'Video 1: Tajwid Alif Lam & Kajian Q.S. An-Nisa 59',
        },
        {
          id: 'v2',
          url: 'https://www.youtube.com/watch?v=0kF_N1W9dFw',
          title: 'Video 2: Praktik Makharijul Huruf & Bacaan Tartil',
        },
      ],
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'E-Book PAI Kelas VII - Bab 1 Pedoman Hidup Qur\'ani.pdf',
      googleDriveLink: 'https://drive.google.com/drive/folders/1exampleDrivePAI1',
      googleDriveTitle: 'Drive: Slide Presentasi PPT & Infografis Tajwid'
    }),
    Video_Url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    Pdf_Url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    Pdf_Nama: 'E-Book PAI Kelas VII - Bab 1 Pedoman Hidup Qur\'ani.pdf',
    Drive_Url: 'https://drive.google.com/drive/folders/1exampleDrivePAI1',
    Drive_Nama: 'Drive: Slide PPT Tajwid & Pedoman Al-Qur\'an',
    Tanggal_Dibuat: '2026-08-10',
  },

  // --- MATERI 2: AKIDAH ---
  {
    ID_Material: 'MAT-02',
    Bab: 2,
    Judul_Bab: 'Bab 2: Meneladani Asmaul Husna dalam Kehidupan',
    Judul_Materi: 'Mengenal Sifat Allah Melalui Al-Alim, Al-Khabir, As-Sami\', dan Al-Bashir',
    Aspek_PAI: 'Akidah',
    Target_Kelas: 'Semua Kelas',
    Deskripsi_Singkat: 'Menumbuhkan kesadaran muraqabah (selalu diawasi Allah) dengan meneladani nama-nama indah Allah SWT.',
    Target_Kompetensi: 'Memahami arti dan hikmah meneladani Asmaul Husna Al-Alim, Al-Khabir, As-Sami\', dan Al-Bashir dalam pergaulan sehari-hari.',
    Konten: JSON.stringify({
      ayatDalil: {
        surah: 'Q.S. Al-An\'am [6]: 59',
        arab: 'وَعِندَهُۥ مَفَاتِحُ ٱلْغَيْبِ لَا يَعْلَمُهَآ إِلَّا هُوَ ۚ وَيَعْلَمُ مَا فِى ٱلْبَرِّ وَٱلْبَحْرِ ۚ وَمَا تَسْقُطُ مِن وَرَقَةٍ إِلَّا يَعْلَمُهَا',
        arti: 'Dan kunci-kunci semua yang gaib ada pada-Nya; tidak ada yang mengetahui selain Dia. Dia mengetahui apa yang ada di darat dan di laut. Tidak ada sehelai daun pun yang gugur melainkan Dia mengetahuinya...'
      },
      ringkasan: 'Asmaul Husna adalah 99 nama-nama terbaik Allah yang menunjukkan kesempurnaan sifat-Nya. Memahami Al-\'Alim (Maha Mengetahui), Al-Khabir (Maha Teliti/Waspada), As-Sami\' (Maha Mendengar), dan Al-Bashir (Maha Melihat) menuntun kita untuk selalu berbuat jujur dan ikhlas kapan pun dan di mana pun kita berada.',
      poinPenting: [
        'Al-\'Alim: Memotivasi kita untuk rajin menuntut ilmu dan rendah hati.',
        'Al-Khabir: Mendorong ketelitian, kehati-hatian dalam bertindak, dan tidak ceroboh.',
        'As-Sami\': Menjaga lisan dari perkataan kotor, dusta, ghibah, serta senantiasa memperbanyak zikir dan doa.',
        'Al-Bashir: Menumbuhkan sikap disiplin dan tidak berbuat curang saat ujian meskipun tanpa pengawasan guru.'
      ],
      catatanGuru: 'Beri penekanan pada penerapan konsep muraqabah di era digital (menjaga etika bermedia sosial karena Allah Maha Melihat).',
      videoUrl: 'https://www.youtube.com/watch?v=0kF_N1W9dFw',
      videoTitle: 'Animasi Edukasi: Makna 4 Asmaul Husna & Kisah Gadis Penjual Susu yang Jujur',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'Ringkasan Materi Akidah Asmaul Husna.pdf',
      googleDriveLink: 'https://drive.google.com/drive/folders/1exampleDrivePAI2',
      googleDriveTitle: 'Drive: Lembar Kerja & Poster Digital Asmaul Husna'
    }),
    Video_Url: 'https://www.youtube.com/watch?v=0kF_N1W9dFw',
    Pdf_Url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    Pdf_Nama: 'Ringkasan Materi Akidah Asmaul Husna.pdf',
    Drive_Url: 'https://drive.google.com/drive/folders/1exampleDrivePAI2',
    Drive_Nama: 'Drive: Poster Digital Asmaul Husna',
    Tanggal_Dibuat: '2026-08-11',
  },

  // --- MATERI 3: FIKIH IBADAH ---
  {
    ID_Material: 'MAT-03',
    Bab: 3,
    Judul_Bab: 'Bab 3: Menghadirkan Salat dan Zikir dalam Kehidupan',
    Judul_Materi: 'Ketentuan Shalat Berjamaah, Khusyuk, & Amalan Shalat Sunnah',
    Aspek_PAI: 'Fikih',
    Target_Kelas: 'VII-A',
    Deskripsi_Singkat: 'Mendalami fadhilah shalat berjamaah 27 derajat, syarat imam dan makmum, serta macam-macam sujud.',
    Target_Kompetensi: 'Mempraktikkan shalat berjamaah dan tata cara sujud sahwi, sujud tilawah, serta sujud syukur secara benar.',
    Konten: JSON.stringify({
      ayatDalil: {
        surah: 'Q.S. Al-Ankabut [29]: 45',
        arab: 'إِنَّ ٱلصَّلَوٰةَ تَنْهَىٰ عَنِ ٱلْفَحْشَآءِ وَٱلْمُنكَرِ ۗ وَلَذِكْرُ ٱللَّهِ أَكْبَرُ ۗ وَٱللَّهُ يَعْلَمُ مَا تَصْنَعُونَ',
        arti: 'Sesungguhnya salat itu mencegah dari (perbuatan) keji dan mungkar. Dan (ketahuilah) mengingat Allah (salat) itu lebih besar (keutamaannya dari ibadah yang lain). Allah mengetahui apa yang kamu kerjakan.'
      },
      ringkasan: 'Salat merupakan tiang agama (imaduddin) dan rukun Islam kedua. Salat berjamaah memiliki nilai keutamaan 27 derajat lebih tinggi dibanding salat sendirian. Selain itu, Islam mengajarkan sujud sahwi (karena lupa rakaat/bacaan), sujud syukur (karena mendapat nikmat/terhindar dari bahaya), dan sujud tilawah (saat mendengar ayat sajdah).',
      poinPenting: [
        'Syarat sah makmum masbuq dan tata cara menyusul imam yang sedang ruku\'.',
        'Sujud Sahwi dilakukan sebelum atau sesudah salam sebanyak dua kali sujud.',
        'Sujud Syukur dilakukan spontan menghadap kiblat dengan bertakbir dan satu kali sujud.',
        'Salat yang benar dan khusyuk akan membentuk pribadi yang berakhlak mulia, disiplin, dan jujur.'
      ],
      catatanGuru: 'Khusus Kelas VII-A difokuskan pada penguasaan bacaan doa sujud sahwi dan sujud tilawah.',
      videoUrl: 'https://www.youtube.com/watch?v=0kF_N1W9dFw',
      videoTitle: 'Tata Cara Praktik Sujud Sahwi, Sujud Tilawah, & Sujud Syukur',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'Modul Praktik Fikih Ibadah Salat & Sujud.pdf',
      googleDriveLink: 'https://drive.google.com/drive/folders/1exampleDrivePAI3',
      googleDriveTitle: 'Drive: Video Tutorial Gerakan Shalat & Rubrik Praktik'
    }),
    Video_Url: 'https://www.youtube.com/watch?v=0kF_N1W9dFw',
    Pdf_Url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    Pdf_Nama: 'Modul Praktik Fikih Ibadah Salat & Sujud.pdf',
    Drive_Url: 'https://drive.google.com/drive/folders/1exampleDrivePAI3',
    Drive_Nama: 'Drive: Panduan Rubrik Praktik Sholat',
    Tanggal_Dibuat: '2026-08-12',
  },

  // --- MATERI 4: AKHLAK TERPUJI ---
  {
    ID_Material: 'MAT-04',
    Bab: 4,
    Judul_Bab: 'Bab 4: Memupuk Karakter dengan Ikhlas, Sabar, dan Pemaaf',
    Judul_Materi: 'Meneladani Nilai Luhur Akhlakul Karimah dalam Pergaulan Remaja',
    Aspek_PAI: 'Akhlak',
    Target_Kelas: 'Semua Kelas',
    Deskripsi_Singkat: 'Membangun ketahanan mental dan kesehatan emosional islami melalui sikap ikhlas, tabah, dan pemaaf.',
    Target_Kompetensi: 'Menerapkan perilaku ikhlas dalam beramal, sabar menghadapi ujian, dan pemaaf terhadap kesalahan sesama.',
    Konten: JSON.stringify({
      ayatDalil: {
        surah: 'Q.S. Az-Zumar [39]: 10',
        arab: 'إِنَّمَا يُوَفَّى ٱلصَّٰبِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ',
        arti: 'Hanya orang-orang yang bersabarlah yang disempurnakan pahalanya tanpa batas.'
      },
      ringkasan: 'Ikhlas adalah memurnikan niat beribadah dan berbuat baik semata-mata mengharap ridha Allah tanpa riya atau sum\'ah. Sabar terbagi menjadi tiga: sabar dalam ketaatan, sabar menjauhi maksiat, dan sabar menerima takdir musibah. Pemaaf adalah ciri utama orang bertakwa yang melapangkan dada.',
      poinPenting: [
        'Ciri-ciri amal yang ikhlas: tidak berubah semangatnya saat dipuji ataupun dicela manusia.',
        'Sabar bukan berarti pasif, melainkan ikhtiar maksimal disertai tawakal yang kokoh.',
        'Sikap pemaaf menjaga tali silaturahmi dan mencegah permusuhan di sekolah.',
        'Dampak positif: ketenangan hati, dicintai Allah, dan dihormati oleh sesama.'
      ],
      catatanGuru: 'Ajak siswa membuat proyek studi kasus tentang menahan amarah dan memaafkan teman.',
      videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
      videoTitle: 'Kisah Inspiratif Sahabat Nabi: Keteladanan Ikhlas dan Pemaaf',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'Bahan Bacaan Akhlak Mulia PAI SMP.pdf',
      googleDriveLink: 'https://drive.google.com/drive/folders/1exampleDrivePAI4',
      googleDriveTitle: 'Drive: Lembar Studi Kasus Karakter Islami'
    }),
    Video_Url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    Pdf_Url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    Pdf_Nama: 'Bahan Bacaan Akhlak Mulia PAI SMP.pdf',
    Drive_Url: 'https://drive.google.com/drive/folders/1exampleDrivePAI4',
    Drive_Nama: 'Drive: Studi Kasus Karakter Islami',
    Tanggal_Dibuat: '2026-08-13',
  },

  // --- MATERI 5: SEJARAH KEBUDAYAAN ISLAM (SKI) ---
  {
    ID_Material: 'MAT-05',
    Bab: 5,
    Judul_Bab: 'Bab 5: Dakwah Rasulullah SAW Membangun Masyarakat Madinah',
    Judul_Materi: 'Piagam Madinah, Persaudaraan Muhajirin-Anshar, & Pembangunan Masjid Nabawi',
    Aspek_PAI: 'Sejarah Kebudayaan Islam (SKI)',
    Target_Kelas: 'Semua Kelas',
    Deskripsi_Singkat: 'Mengambil ibrah dari strategi peradaban Rasulullah SAW dalam merajut persatuan dan toleransi antar umat.',
    Target_Kompetensi: 'Menganalisis strategi dakwah Rasulullah SAW di Madinah dan merefleksikannya dalam kehidupan berbangsa.',
    Konten: JSON.stringify({
      ayatDalil: {
        surah: 'Q.S. Al-Hujurat [49]: 10',
        arab: 'إِنَّمَا ٱلْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا۟ بَيْنَ أَخَوَيْكُمْ ۚ وَٱتَّقُوا۟ ٱللَّهَ لَعَلَّكُمْ تُرْحَمُونَ',
        arti: 'Sesungguhnya orang-orang mukmin itu bersaudara, karena itu damaikanlah antara kedua saudaramu (yang berselisih) dan bertakwalah kepada Allah agar kamu mendapat rahmat.'
      },
      ringkasan: 'Peristiwa Hijrah menandai era baru peradaban Islam di Madinah. Tiga pilar utama yang dibangun Rasulullah SAW adalah: 1) Pembangunan Masjid Nabawi sebagai pusat ibadah, sosial, dan pemerintahan; 2) Mempersaudarakan kaum Muhajirin dan kaum Anshar atas dasar akidah; 3) Merumuskan Piagam Madinah sebagai konstitusi tertulis pertama yang menjamin kebebasan beragama dan hak asasi.',
      poinPenting: [
        'Masjid Nabawi berfungsi multifungsi sebagai sarana pendidikan, musyawarah, dan pelayanan umat.',
        'Pengorbanan kaum Anshar yang membagi harta dan rumah kepada saudara Muhajirin.',
        'Prinsip Piagam Madinah: keadilan hukum, gotong royong mempertahankan kota, dan toleransi beragama.',
        'Ibrah: Pentingnya menjaga kerukunan antarumat beragama di Indonesia.'
      ],
      catatanGuru: 'Kaitkan nilai Piagam Madinah dengan konsensus kebangsaan Pancasila dan Bhinneka Tunggal Ika.',
      videoUrl: 'https://www.youtube.com/watch?v=0kF_N1W9dFw',
      videoTitle: 'Dokumenter Sejarah: Kota Madinah Al-Munawwarah & Piagam Madinah',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'Sejarah Kebudayaan Islam - Fase Madinah.pdf',
      googleDriveLink: 'https://drive.google.com/drive/folders/1exampleDrivePAI5',
      googleDriveTitle: 'Drive: Peta Konsep Hijrah & Dokumen Piagam Madinah'
    }),
    Video_Url: 'https://www.youtube.com/watch?v=0kF_N1W9dFw',
    Pdf_Url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    Pdf_Nama: 'Sejarah Kebudayaan Islam - Fase Madinah.pdf',
    Drive_Url: 'https://drive.google.com/drive/folders/1exampleDrivePAI5',
    Drive_Nama: 'Drive: Dokumen Piagam Madinah',
    Tanggal_Dibuat: '2026-08-14',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    ID_Assignment: 'TSK-01',
    ID_Material: 'MAT-01',
    Judul_Tugas: 'Tugas 1: Rekaman Tilawah Q.S. An-Nisa: 59 & Analisis Tajwid Alif Lam',
    Kategori: 'Praktik Ibadah & Tilawah',
    Deskripsi_Tugas: 'Rekamlah bacaan Q.S. An-Nisa [4]: 59 dengan suara jelas dan tartil, lalu tuliskan minimal 4 contoh lafal Alif Lam Syamsiyah & Qamariyah.',
    Petunjuk_Pengerjaan: '1. Rekam audio/video bacaan Anda dan upload ke Google Drive (pastikan akses publik "Anyone with link").\n2. Cantumkan link rekaman dan ketikkan 4 lafal beserta hukum tajwidnya pada kolom jawaban di bawah.\n3. Jangan lupa menyertakan arti per kata.',
    Bobot_Nilai: 20,
    Deadline: '2026-09-01',
    Target_Kelas: 'Semua Kelas',
    Lampiran_PDF: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    Lampiran_PDF_Nama: 'Lembar Kerja Peserta Didik (LKPD) - Tajwid Alif Lam.pdf',
    Lampiran_Drive: 'https://docs.google.com/document/d/1exampleTemplateLKPD1',
    Lampiran_Drive_Nama: 'Template Google Docs: Format Jawaban Tajwid',
    Tanggal_Dibuat: '2026-08-10',
  },
  {
    ID_Assignment: 'TSK-02',
    ID_Material: 'MAT-02',
    Judul_Tugas: 'Tugas 2: LKPD Penerapan 4 Asmaul Husna dalam Kehidupan Nyata',
    Kategori: 'LKPD / Tugas Mandiri',
    Deskripsi_Tugas: 'Lakukan pengamatan dan buatlah 4 contoh tindakan nyata yang mencerminkan sifat Al-Alim, Al-Khabir, As-Sami\', dan Al-Bashir.',
    Petunjuk_Pengerjaan: 'Unduh file LKPD terlampir atau isi langsung template Google Docs. Jelaskan deskripsi situasi di sekolah/rumah dan nilai kejujuran yang didapat.',
    Bobot_Nilai: 25,
    Deadline: '2026-09-08',
    Target_Kelas: 'Semua Kelas',
    Lampiran_PDF: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    Lampiran_PDF_Nama: 'LKPD 2 - Refleksi Asmaul Husna.pdf',
    Lampiran_Drive: 'https://docs.google.com/document/d/1exampleTemplateLKPD2',
    Lampiran_Drive_Nama: 'Template Docs: Lembar Pengamatan Karakter',
    Tanggal_Dibuat: '2026-08-11',
  },
  {
    ID_Assignment: 'TSK-03',
    ID_Material: 'MAT-03',
    Judul_Tugas: 'Tugas 3: Jurnal Shalat Berjamaah & Video Praktik Sujud Sahwi',
    Kategori: 'Praktik Ibadah & Tilawah',
    Deskripsi_Tugas: 'Khusus kelas VII-A: Buat rekaman video singkat peragaan sujud sahwi (2 rakaat) beserta bacaan doanya yang fasih.',
    Petunjuk_Pengerjaan: 'Praktikkan gerakan sujud sahwi secara tartil. Unggah video ke YouTube unlisted atau Google Drive dan kumpulkan tautannya.',
    Bobot_Nilai: 25,
    Deadline: '2026-09-15',
    Target_Kelas: 'VII-A',
    Lampiran_PDF: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    Lampiran_PDF_Nama: 'Rubrik Penilaian Praktik Shalat & Sujud Sahwi.pdf',
    Lampiran_Drive: 'https://docs.google.com/document/d/1exampleRubrikSujud',
    Lampiran_Drive_Nama: 'Panduan Rubrik Asesmen Praktik Sujud',
    Tanggal_Dibuat: '2026-08-12',
  },
  {
    ID_Assignment: 'TSK-04',
    ID_Material: 'MAT-04',
    Judul_Tugas: 'Tugas 4: Studi Kasus Pemecahan Masalah dengan Sikap Pemaaf & Sabar',
    Kategori: 'Proyek Aksi & Karakter',
    Deskripsi_Tugas: 'Analisis sebuah contoh perselisihan antar teman sebaya di sekolah. Berikan solusi berdasarkan tuntunan sabar dan pemaaf.',
    Petunjuk_Pengerjaan: 'Tuliskan esai singkat 2-3 paragraf mengenai cara mencegah bullying dan menumbuhkan sikap memaafkan.',
    Bobot_Nilai: 15,
    Deadline: '2026-09-22',
    Target_Kelas: 'Semua Kelas',
    Lampiran_PDF: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    Lampiran_PDF_Nama: 'Lembar Studi Kasus Akhlak Mulia.pdf',
    Tanggal_Dibuat: '2026-08-13',
  },
  {
    ID_Assignment: 'TSK-05',
    ID_Material: 'MAT-05',
    Judul_Tugas: 'Tugas 5: Mind Mapping Piagam Madinah & Relevansi Toleransi Modern',
    Kategori: 'LKPD / Tugas Mandiri',
    Deskripsi_Tugas: 'Buatlah bagan mind mapping / peta konsep mengenai 3 pilar pembangunan masyarakat Madinah oleh Rasulullah SAW.',
    Petunjuk_Pengerjaan: 'Gunakan Canva, kertas gambar, atau Google Drawings, lalu ekspor sebagai PDF/Gambar dan lampirkan.',
    Bobot_Nilai: 15,
    Deadline: '2026-09-30',
    Target_Kelas: 'Semua Kelas',
    Lampiran_PDF: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    Lampiran_PDF_Nama: 'LKPD 5 - Peta Konsep SKI Madinah.pdf',
    Tanggal_Dibuat: '2026-08-14',
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    ID_Submission: 'SUB-01',
    ID_Assignment: 'TSK-01',
    ID_Student: 'USR-SISWA-01', // Ahmad Fauzi (VII-A)
    Link_Tugas: 'https://drive.google.com/file/d/1ahmad_tilawah_nisa59/view?usp=sharing\n\nAnalisis Tajwid:\n1. Alif Lam Syamsiyah: الشَّمْسِ, الرَّسُولَ (karena huruf Ra bertasydid)\n2. Alif Lam Qamariyah: الْأَمْرِ, الْكِتَابِ (huruf Hamzah dan Kaf jelas dibaca izhar)\nAlhamdulillah sudah saya hafalkan artinya juga Ustadz.',
    Catatan_Siswa: 'Bismillah Ustadz, ini rekaman tilawah saya. Mohon koreksi makharijul hurufnya.',
    Lampiran_File_Siswa: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    Lampiran_Nama_File: 'Jawaban_Tajwid_Ahmad_Fauzi_VIIA.pdf',
    Status: 'Dinilai',
    Tanggal_Kirim: '2026-08-15 08:30',
  },
  {
    ID_Submission: 'SUB-02',
    ID_Assignment: 'TSK-02',
    ID_Student: 'USR-SISWA-01', // Ahmad Fauzi (VII-A)
    Link_Tugas: 'https://docs.google.com/document/d/1ahmad_lkpd_asmaul_husna/edit\n\nPenerapan 4 Asmaul Husna:\n1. Al-Alim: Gemar membaca buku di perpustakaan.\n2. Al-Khabir: Memeriksa kembali jawaban ujian.\n3. As-Sami\': Tidak pernah berkata kotor kepada teman.\n4. Al-Bashir: Tidak berbuat curang saat ulangan harian.',
    Catatan_Siswa: 'Tugas LKPD Asmaul Husna telah saya lengkapi dengan contoh situasi di kelas VII-A.',
    Status: 'Dinilai',
    Tanggal_Kirim: '2026-08-16 14:15',
  },
  {
    ID_Submission: 'SUB-03',
    ID_Assignment: 'TSK-01',
    ID_Student: 'USR-SISWA-02', // Siti Nur Aisyah (VII-A)
    Link_Tugas: 'https://drive.google.com/file/d/1siti_tilawah_an_nisa/view?usp=sharing\n\nIdentifikasi Tajwid:\n- Al-Amri: Alif Lam Qamariyah (bunyi L jelas)\n- Ar-Rasul: Alif Lam Syamsiyah (diidghamkan ke huruf Ra)',
    Catatan_Siswa: 'Assalamu\'alaikum Ustadz, berikut tugas tilawah dan analisis tajwid saya.',
    Status: 'Dinilai',
    Tanggal_Kirim: '2026-08-16 09:20',
  },
  {
    ID_Submission: 'SUB-04',
    ID_Assignment: 'TSK-03',
    ID_Student: 'USR-SISWA-01', // Ahmad Fauzi (VII-A)
    Link_Tugas: 'https://drive.google.com/file/d/1ahmad_sujud_sahwi_video/view?usp=sharing\n\nDoa Sujud Sahwi yang dibaca:\n"Subhana man la yanamu wa la yashu" (Maha Suci Dzat yang tidak pernah tidur dan tidak pernah lupa) sebanyak 3x di setiap sujud.',
    Catatan_Siswa: 'Video praktik sujud sahwi 2 rakaat. Durasi 2 menit 15 detik.',
    Status: 'Dikirim',
    Tanggal_Kirim: '2026-08-18 19:40',
  },
  {
    ID_Submission: 'SUB-05',
    ID_Assignment: 'TSK-01',
    ID_Student: 'USR-SISWA-03', // Dimas Pratama (VII-B)
    Link_Tugas: 'https://drive.google.com/file/d/1dimas_tilawah_7b/view?usp=sharing\n\nAlif Lam Qamariyah: Al-Hamdu, Al-Amr\nAlif Lam Syamsiyah: Asy-Syams, Ar-Rahman',
    Catatan_Siswa: 'Sudah diunggah Ustadz, mohon dinilai.',
    Status: 'Dinilai',
    Tanggal_Kirim: '2026-08-17 10:10',
  },
];

export const INITIAL_GRADES: Grade[] = [
  {
    ID_Grade: 'GRD-01',
    ID_Submission: 'SUB-01',
    ID_Student: 'USR-SISWA-01',
    ID_Assignment: 'TSK-01',
    Nilai: 95,
    Catatan_Guru: 'Mumtaz! Pelafalan tajwid Alif Lam Syamsiyah dan Qamariyah sangat jelas dan tartil. Pertahankan terus ya Mas Ahmad!',
    Tanggal_Nilai: '2026-08-16 10:00',
    Nama_Penilai: 'IMEL, S.Pd, Gr.',
  },
  {
    ID_Grade: 'GRD-02',
    ID_Submission: 'SUB-02',
    ID_Student: 'USR-SISWA-01',
    ID_Assignment: 'TSK-02',
    Nilai: 92,
    Catatan_Guru: 'Bagus sekali, refleksi penerapan Al-Khabir dan Al-Bashir sangat kontekstual dengan kehidupan di sekolah.',
    Tanggal_Nilai: '2026-08-17 11:30',
    Nama_Penilai: 'IMEL, S.Pd, Gr.',
  },
  {
    ID_Grade: 'GRD-03',
    ID_Submission: 'SUB-03',
    ID_Student: 'USR-SISWA-02',
    ID_Assignment: 'TSK-01',
    Nilai: 94,
    Catatan_Guru: 'Bagus Mbak Siti, nada bacaan tenang dan hukum mad wajib muttashil terbaca sempurna.',
    Tanggal_Nilai: '2026-08-17 12:00',
    Nama_Penilai: 'IMEL, S.Pd, Gr.',
  },
  {
    ID_Grade: 'GRD-04',
    ID_Submission: 'SUB-05',
    ID_Student: 'USR-SISWA-03',
    ID_Assignment: 'TSK-01',
    Nilai: 88,
    Catatan_Guru: 'Bagus Mas Dimas. Perhatikan lagi panjang mad thabi\'i pada lafal Ar-Rasul agar tepat 2 harakat.',
    Tanggal_Nilai: '2026-08-18 09:15',
    Nama_Penilai: 'IMEL, S.Pd, Gr.',
  },
];

export const INITIAL_REFLECTIONS: Reflection[] = [
  {
    ID_Reflection: 'REFL-01',
    ID_Material: 'MAT-01',
    ID_Student: 'USR-SISWA-01', // Ahmad Fauzi
    Poin_Penting: '1. Alif Lam Qamariyah dibaca jelas (izhar) saat bertemu 14 huruf abjad khusus.\n2. Alif Lam Syamsiyah dibaca melebur/idgham dengan tasydid.\n3. Taat kepada ulil amri adalah bagian dari pengamalan iman kepada Allah dan Rasul.',
    Kesimpulan: 'Melalui materi ini saya memahami cara membedakan hukum bacaan Alif Lam Syamsiyah dan Qamariyah secara tepat ketika membaca ayat suci Al-Qur\'an, serta kewajiban taat kepada aturan agama, orang tua, dan guru.',
    Hal_Disukai: 'Penjelasan tajwid pada video sangat jelas disertai contoh langsung makharijul huruf dan tayangan slide.',
    Pertanyaan_Siswa: 'Apakah ada pengecualian huruf tertentu yang sering tertukar antara Syamsiyah dan Qamariyah?',
    Tanggapan_Guru: 'MasyaAllah, rangkuman refleksi Mas Ahmad sangat runtut dan detail! Untuk huruf yang sering tertukar seperti huruf Jim (Qamariyah) dan Syin (Syamsiyah), bisa kita latih lagi di pertemuan depan ya.',
    Tanggal_Dibuat: '2026-08-16 09:30',
  },
];
