import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { storage, database } from './firebase';


export const saveMarker = async (markerData) => {
  try {
    const docRef = await addDoc(collection(database, "markers"), markerData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Returner det unikke id genereret af Firebase
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // Re-throw fejlen for at håndtere den i `addMarker`
  }
};


export const fetchMarkers = async () => {
    const markersCollectionRef = collection(database, "markers");
    const querySnapshot = await getDocs(markersCollectionRef);
    const markers = querySnapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id };
    });
    return markers;
};


export const uploadImage = async (imagePath, fileName) => {
  if (imagePath) {
    const res = await fetch(imagePath);
    const blob = await res.blob();
    const storageRef = ref(storage, fileName);
    try {
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      console.log("Image uploaded:", downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error("Upload failed", error);
      throw error;
    }
  } else {
    console.log("No image selected");
    return null;
  }
};


