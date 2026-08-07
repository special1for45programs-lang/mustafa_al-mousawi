import { collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Project, BriefFormData } from '../types';

export const getPortfolioProjects = async (): Promise<Project[]> => {
  const querySnapshot = await getDocs(collection(db, 'portfolio'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

export const addProject = async (data: Omit<Project, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'portfolio'), data);
  return docRef.id;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<void> => {
  const docRef = doc(db, 'portfolio', id);
  await updateDoc(docRef, data);
};

export const deleteProject = async (id: string): Promise<void> => {
  const docRef = doc(db, 'portfolio', id);
  await deleteDoc(docRef);
};

export const getResumeData = async (): Promise<any> => {
  const docRef = doc(db, 'resume', 'data');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const getSiteContactData = async (): Promise<any> => {
  const docRef = doc(db, 'siteConfig', 'contact');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateResumeData = async (data: any): Promise<void> => {
  const docRef = doc(db, 'resume', 'data');
  await setDoc(docRef, data, { merge: true });
};

export const getPackagesData = async (): Promise<any> => {
  const docRef = doc(db, 'packages', 'data');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updatePackagesData = async (data: any): Promise<void> => {
  const docRef = doc(db, 'packages', 'data');
  await setDoc(docRef, data, { merge: true });
};

export type BriefRequestWithId = BriefFormData & { id: string; submittedAt: Timestamp; status: 'new' | 'in_progress' | 'completed' | 'archived' };

export const getBriefRequests = async (): Promise<BriefRequestWithId[]> => {
  const querySnapshot = await getDocs(collection(db, 'briefRequests'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BriefRequestWithId));
};

export const updateBriefRequestStatus = async (id: string, status: 'new' | 'in_progress' | 'completed' | 'archived'): Promise<void> => {
  const docRef = doc(db, 'briefRequests', id);
  await updateDoc(docRef, { status });
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const uploadImageWithProgress = (
  file: File | Blob,
  path: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    // @ts-ignore
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot: any) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(Math.round(progress));
      },
      (error: any) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};
