import { firestore } from '@/app/lib/firestore'
import { FieldValue } from '@google-cloud/firestore';

export async function updateFieldInCollection(collectionName: string, fieldName: string, newValue: FieldValue | string) {
  const collectionRef = firestore.collection(collectionName);
  
  try {
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log('No documents found in the collection.');
      return;
    }

    const batch = firestore.batch();

    snapshot.docs.forEach((doc) => {
      const docRef = collectionRef.doc(doc.id);
      batch.update(docRef, { [fieldName]: newValue });
    });

    await batch.commit();
    console.log(`Successfully updated '${fieldName}' for all documents in '${collectionName}'.`);
  } catch (error) {
    console.error('Error updating documents:', error);
  }
}

export async function deleteFieldInCollection(collectionName: string, fieldName: string) {
    updateFieldInCollection(collectionName, fieldName, FieldValue.delete())
}
