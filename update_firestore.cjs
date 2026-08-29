const fs = require('fs');

let content = fs.readFileSync('src/lib/firestore.ts', 'utf8');

content = content.replace(/isApproved/g, 'isVisible');

const adminFunctions = `
export const updateReviewVisibility = async (id: string, isVisible: boolean): Promise<void> => {
  try {
    const docRef = doc(db, 'reviews', id);
    await updateDoc(docRef, { isVisible });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(\`[Firestore] updateReviewVisibility failed: \${msg}\`);
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'reviews', id);
    await deleteDoc(docRef);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(\`[Firestore] deleteReview failed: \${msg}\`);
  }
};
`;

content = content + adminFunctions;
fs.writeFileSync('src/lib/firestore.ts', content);
