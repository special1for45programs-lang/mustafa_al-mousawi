const fs = require('fs');
const content = `
export const addClientReview = async (review: Omit<ClientReview, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...review,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(\`[Firestore] addClientReview failed: \${msg}\`);
  }
};

export const getApprovedReviews = async (): Promise<ClientReview[]> => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('isApproved', '==', true),
      orderBy('createdAt', 'desc'),
      limit(6)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientReview));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(\`[Firestore] getApprovedReviews failed: \${msg}\`);
  }
};
`;
fs.appendFileSync('src/lib/firestore.ts', content);
