import { collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc, Timestamp, serverTimestamp, query, where, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from './firebase';
import type { BriefFormData, ClientReview } from '../types';

export const getResumeData = async (): Promise<unknown> => {
  try {
    const docRef = doc(db, 'resume', 'data');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] getResumeData failed: ${msg}`);
  }
};

export const getSiteContactData = async (): Promise<unknown> => {
  try {
    const docRef = doc(db, 'siteConfig', 'contact');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] getSiteContactData failed: ${msg}`);
  }
};

export const updateResumeData = async (data: unknown): Promise<void> => {
  try {
    const docRef = doc(db, 'resume', 'data');
    await setDoc(docRef, data, { merge: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] updateResumeData failed: ${msg}`);
  }
};

export const getPackagesData = async (): Promise<unknown> => {
  try {
    const docRef = doc(db, 'packages', 'data');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] getPackagesData failed: ${msg}`);
  }
};

export const updatePackagesData = async (data: unknown): Promise<void> => {
  try {
    const docRef = doc(db, 'packages', 'data');
    await setDoc(docRef, data, { merge: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] updatePackagesData failed: ${msg}`);
  }
};

export const getResourcesData = async (): Promise<unknown> => {
  try {
    const docRef = doc(db, 'resources', 'data');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] getResourcesData failed: ${msg}`);
  }
};

export const updateResourcesData = async (data: unknown): Promise<void> => {
  try {
    const docRef = doc(db, 'resources', 'data');
    await setDoc(docRef, data, { merge: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] updateResourcesData failed: ${msg}`);
  }
};

export type BriefRequestWithId = BriefFormData & { id: string; submittedAt: Timestamp; status: 'new' | 'in_progress' | 'completed' | 'archived' };

export const getBriefRequests = async (): Promise<BriefRequestWithId[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'briefRequests'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BriefRequestWithId));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] getBriefRequests failed: ${msg}`);
  }
};

export const addBriefRequest = async (data: Partial<BriefFormData>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'briefRequests'), {
      ...data,
      submittedAt: Timestamp.now(),
      status: 'new'
    });
    return docRef.id;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] addBriefRequest failed: ${msg}`);
  }
};

export const updateBriefImages = async (id: string, fileIds: string[]): Promise<void> => {
  try {
    const docRef = doc(db, 'briefRequests', id);
    await updateDoc(docRef, { telegramFileIds: fileIds });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] updateBriefImages failed: ${msg}`);
  }
};

export const updateBriefRequestStatus = async (id: string, status: 'new' | 'in_progress' | 'completed' | 'archived'): Promise<void> => {
  try {
    const docRef = doc(db, 'briefRequests', id);
    await updateDoc(docRef, { status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] updateBriefRequestStatus failed: ${msg}`);
  }
};

export const updateBriefRequestTerms = async (id: string, customTerms: { icon: string; text: string; }[]): Promise<void> => {
  try {
    const docRef = doc(db, 'briefRequests', id);
    await updateDoc(docRef, { customTerms });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] updateBriefRequestTerms failed: ${msg}`);
  }
};

export const deleteBriefRequest = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'briefRequests', id);
    await deleteDoc(docRef);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] deleteBriefRequest failed: ${msg}`);
  }
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] uploadImage failed: ${msg}`);
  }
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
      (snapshot: import('firebase/storage').UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(Math.round(progress));
      },
      (error: Error) => {
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

export const addClientReview = async (review: Omit<ClientReview, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...review,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] addClientReview failed: ${msg}`);
  }
};

export const getApprovedReviews = async (): Promise<ClientReview[]> => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('isVisible', '==', true),
      orderBy('createdAt', 'desc'),
      limit(6)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientReview));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] getApprovedReviews failed: ${msg}`);
  }
};

export const updateReviewVisibility = async (id: string, isVisible: boolean): Promise<void> => {
  try {
    const docRef = doc(db, 'reviews', id);
    await updateDoc(docRef, { isVisible });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] updateReviewVisibility failed: ${msg}`);
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'reviews', id);
    await deleteDoc(docRef);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[Firestore] deleteReview failed: ${msg}`);
  }
};
