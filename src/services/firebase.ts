import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  writeBatch,
  onSnapshot,
  query
} from 'firebase/firestore';
import { AppStateData, User, Material, Assignment, Submission, Grade, ClassRoom, Reflection } from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_CLASSES, 
  INITIAL_MATERIALS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_GRADES, 
  INITIAL_REFLECTIONS 
} from '../data/seedData';

export const firebaseConfig = {
  projectId: "gen-lang-client-0622106397",
  appId: "1:456914816089:web:2184b3e8485d6d488cf548",
  apiKey: "AIzaSyBmnlL1_dOOorbasYBWYjIg8Rxog_tMDn4",
  authDomain: "gen-lang-client-0622106397.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-lmspaismpalurmer-0850bbf1-ceb7-464f-be60-169a78d089a7",
  storageBucket: "gen-lang-client-0622106397.firebasestorage.app",
  messagingSenderId: "456914816089",
  measurementId: "",
  oAuthClientId: "456914816089-e8ihnb8qcvm3cvutvl5lbsd6p6ven7cm.apps.googleusercontent.com",
};

// Initialize Firebase App singleton
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firestore with custom databaseId if specified
export const db: Firestore = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)')
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  CLASSES: 'classes',
  MATERIALS: 'materials',
  ASSIGNMENTS: 'assignments',
  SUBMISSIONS: 'submissions',
  GRADES: 'grades',
  REFLECTIONS: 'reflections',
  META: 'meta',
} as const;

class FirebaseService {
  private isConnected: boolean = false;
  private isInitialized: boolean = false;

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  // Check connection and seed initial data if collections are empty
  public async initializeDatabase(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      const usersCol = collection(db, COLLECTIONS.USERS);
      const userSnapshot = await getDocs(query(usersCol));

      if (userSnapshot.empty) {
        console.log('Seeding initial data into Cloud Firestore...');
        await this.seedAllData();
      }

      this.isConnected = true;
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.warn('Firestore direct check returned with notice (will retry/fallback):', error);
      // Even if offline, firestore client cache works
      this.isConnected = true;
      return false;
    }
  }

  // Seed default data into Firestore
  public async seedAllData(): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Seed Users
      for (const u of INITIAL_USERS) {
        const userRef = doc(db, COLLECTIONS.USERS, String(u.ID_User));
        batch.set(userRef, u, { merge: true });
      }

      // Seed Classes
      for (const c of INITIAL_CLASSES) {
        const classRef = doc(db, COLLECTIONS.CLASSES, String(c.ID_Kelas));
        batch.set(classRef, c, { merge: true });
      }

      // Seed Materials
      for (const m of INITIAL_MATERIALS) {
        const matRef = doc(db, COLLECTIONS.MATERIALS, String(m.ID_Material));
        batch.set(matRef, m, { merge: true });
      }

      // Seed Assignments
      for (const a of INITIAL_ASSIGNMENTS) {
        const assRef = doc(db, COLLECTIONS.ASSIGNMENTS, String(a.ID_Assignment));
        batch.set(assRef, a, { merge: true });
      }

      // Seed Submissions
      for (const s of INITIAL_SUBMISSIONS) {
        const subRef = doc(db, COLLECTIONS.SUBMISSIONS, String(s.ID_Submission));
        batch.set(subRef, s, { merge: true });
      }

      // Seed Grades
      for (const g of INITIAL_GRADES) {
        const grdRef = doc(db, COLLECTIONS.GRADES, String(g.ID_Grade));
        batch.set(grdRef, g, { merge: true });
      }

      // Seed Reflections
      for (const r of INITIAL_REFLECTIONS) {
        const refRef = doc(db, COLLECTIONS.REFLECTIONS, String(r.ID_Reflection));
        batch.set(refRef, r, { merge: true });
      }

      await batch.commit();
      console.log('Successfully seeded all initial data into Cloud Firestore!');
    } catch (e) {
      console.error('Failed to seed initial data:', e);
    }
  }

  // Fetch all documents from Firestore
  public async fetchAllData(): Promise<AppStateData | null> {
    try {
      const [
        usersSnap, 
        classesSnap, 
        materialsSnap, 
        assignmentsSnap, 
        submissionsSnap, 
        gradesSnap, 
        reflectionsSnap
      ] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.USERS)),
        getDocs(collection(db, COLLECTIONS.CLASSES)),
        getDocs(collection(db, COLLECTIONS.MATERIALS)),
        getDocs(collection(db, COLLECTIONS.ASSIGNMENTS)),
        getDocs(collection(db, COLLECTIONS.SUBMISSIONS)),
        getDocs(collection(db, COLLECTIONS.GRADES)),
        getDocs(collection(db, COLLECTIONS.REFLECTIONS)),
      ]);

      const users: User[] = usersSnap.docs.map(d => d.data() as User);
      const classes: ClassRoom[] = classesSnap.docs.map(d => d.data() as ClassRoom);
      const materials: Material[] = materialsSnap.docs.map(d => d.data() as Material);
      const assignments: Assignment[] = assignmentsSnap.docs.map(d => d.data() as Assignment);
      const submissions: Submission[] = submissionsSnap.docs.map(d => d.data() as Submission);
      const grades: Grade[] = gradesSnap.docs.map(d => d.data() as Grade);
      const reflections: Reflection[] = reflectionsSnap.docs.map(d => d.data() as Reflection);

      // If database was empty, seed it
      if (users.length === 0 && materials.length === 0) {
        await this.seedAllData();
        return {
          users: INITIAL_USERS,
          classes: INITIAL_CLASSES,
          materials: INITIAL_MATERIALS,
          assignments: INITIAL_ASSIGNMENTS,
          submissions: INITIAL_SUBMISSIONS,
          grades: INITIAL_GRADES,
          reflections: INITIAL_REFLECTIONS,
        };
      }

      this.isConnected = true;
      return {
        users: users.length > 0 ? users : INITIAL_USERS,
        classes: classes.length > 0 ? classes : INITIAL_CLASSES,
        materials: materials.length > 0 ? materials : INITIAL_MATERIALS,
        assignments: assignments.length > 0 ? assignments : INITIAL_ASSIGNMENTS,
        submissions,
        grades,
        reflections: reflections.length > 0 ? reflections : INITIAL_REFLECTIONS,
      };
    } catch (err) {
      console.warn('Error fetching all data from Cloud Firestore:', err);
      return null;
    }
  }

  // Real-time listener for multi-device sync
  public subscribeToRealtimeUpdates(onUpdate: (data: AppStateData) => void): () => void {
    const unsubscribes: (() => void)[] = [];
    let stateCache: AppStateData = {
      users: INITIAL_USERS,
      classes: INITIAL_CLASSES,
      materials: INITIAL_MATERIALS,
      assignments: INITIAL_ASSIGNMENTS,
      submissions: INITIAL_SUBMISSIONS,
      grades: INITIAL_GRADES,
      reflections: INITIAL_REFLECTIONS,
    };

    const notify = () => {
      onUpdate({ ...stateCache });
    };

    try {
      unsubscribes.push(
        onSnapshot(collection(db, COLLECTIONS.USERS), (snap) => {
          if (!snap.empty) {
            stateCache.users = snap.docs.map(d => d.data() as User);
            notify();
          }
        }, (err) => console.log('User sync note:', err))
      );

      unsubscribes.push(
        onSnapshot(collection(db, COLLECTIONS.CLASSES), (snap) => {
          if (!snap.empty) {
            stateCache.classes = snap.docs.map(d => d.data() as ClassRoom);
            notify();
          }
        }, (err) => console.log('Classes sync note:', err))
      );

      unsubscribes.push(
        onSnapshot(collection(db, COLLECTIONS.MATERIALS), (snap) => {
          if (!snap.empty) {
            stateCache.materials = snap.docs.map(d => d.data() as Material);
            notify();
          }
        }, (err) => console.log('Materials sync note:', err))
      );

      unsubscribes.push(
        onSnapshot(collection(db, COLLECTIONS.ASSIGNMENTS), (snap) => {
          if (!snap.empty) {
            stateCache.assignments = snap.docs.map(d => d.data() as Assignment);
            notify();
          }
        }, (err) => console.log('Assignments sync note:', err))
      );

      unsubscribes.push(
        onSnapshot(collection(db, COLLECTIONS.SUBMISSIONS), (snap) => {
          stateCache.submissions = snap.docs.map(d => d.data() as Submission);
          notify();
        }, (err) => console.log('Submissions sync note:', err))
      );

      unsubscribes.push(
        onSnapshot(collection(db, COLLECTIONS.GRADES), (snap) => {
          stateCache.grades = snap.docs.map(d => d.data() as Grade);
          notify();
        }, (err) => console.log('Grades sync note:', err))
      );

      unsubscribes.push(
        onSnapshot(collection(db, COLLECTIONS.REFLECTIONS), (snap) => {
          stateCache.reflections = snap.docs.map(d => d.data() as Reflection);
          notify();
        }, (err) => console.log('Reflections sync note:', err))
      );
    } catch (e) {
      console.warn('Real-time subscription notice:', e);
    }

    return () => {
      unsubscribes.forEach(unsub => {
        try { unsub(); } catch {}
      });
    };
  }

  // --- Firestore CRUD methods ---

  public async saveUser(user: User): Promise<void> {
    const ref = doc(db, COLLECTIONS.USERS, String(user.ID_User));
    await setDoc(ref, user, { merge: true });
  }

  public async saveBatchUsers(users: User[]): Promise<void> {
    const batch = writeBatch(db);
    for (const u of users) {
      const ref = doc(db, COLLECTIONS.USERS, String(u.ID_User));
      batch.set(ref, u, { merge: true });
    }
    await batch.commit();
  }

  public async deleteUser(userId: string): Promise<void> {
    const ref = doc(db, COLLECTIONS.USERS, String(userId));
    await deleteDoc(ref);
  }

  public async deleteAllStudents(targetClass?: string): Promise<number> {
    const snap = await getDocs(collection(db, COLLECTIONS.USERS));
    const batch = writeBatch(db);
    let count = 0;
    snap.docs.forEach(docSnap => {
      const u = docSnap.data() as User;
      if (u.Role === 'Siswa' && (!targetClass || targetClass === 'all' || u.Kelas === targetClass)) {
        batch.delete(docSnap.ref);
        count++;
      }
    });
    if (count > 0) {
      await batch.commit();
    }
    return count;
  }

  public async saveClass(classRoom: ClassRoom): Promise<void> {
    const ref = doc(db, COLLECTIONS.CLASSES, String(classRoom.ID_Kelas));
    await setDoc(ref, classRoom, { merge: true });
  }

  public async deleteClass(classId: string): Promise<void> {
    const ref = doc(db, COLLECTIONS.CLASSES, String(classId));
    await deleteDoc(ref);
  }

  public async saveMaterial(material: Material): Promise<void> {
    const ref = doc(db, COLLECTIONS.MATERIALS, String(material.ID_Material));
    await setDoc(ref, material, { merge: true });
  }

  public async deleteMaterial(materialId: string): Promise<void> {
    const ref = doc(db, COLLECTIONS.MATERIALS, String(materialId));
    await deleteDoc(ref);
  }

  public async saveAssignment(assignment: Assignment): Promise<void> {
    const ref = doc(db, COLLECTIONS.ASSIGNMENTS, String(assignment.ID_Assignment));
    await setDoc(ref, assignment, { merge: true });
  }

  public async deleteAssignment(assignmentId: string): Promise<void> {
    const ref = doc(db, COLLECTIONS.ASSIGNMENTS, String(assignmentId));
    await deleteDoc(ref);
  }

  public async saveSubmission(submission: Submission): Promise<void> {
    const ref = doc(db, COLLECTIONS.SUBMISSIONS, String(submission.ID_Submission));
    await setDoc(ref, submission, { merge: true });
  }

  public async saveGrade(grade: Grade, submissionId?: string): Promise<void> {
    const batch = writeBatch(db);
    const gradeRef = doc(db, COLLECTIONS.GRADES, String(grade.ID_Grade));
    batch.set(gradeRef, grade, { merge: true });

    if (submissionId) {
      const subRef = doc(db, COLLECTIONS.SUBMISSIONS, String(submissionId));
      batch.update(subRef, { Status: 'Dinilai' });
    }

    await batch.commit();
  }

  public async saveReflection(reflection: Reflection): Promise<void> {
    const ref = doc(db, COLLECTIONS.REFLECTIONS, String(reflection.ID_Reflection));
    await setDoc(ref, reflection, { merge: true });
  }
}

export const firebaseService = new FirebaseService();
