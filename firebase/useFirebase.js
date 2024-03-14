import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { storage, database } from './firebase';




export const uploadImageToStorage = async (imagePath, fileName) => {
    if (!imagePath) {
      console.log("No image path provided");
      return null;
    }

    try {
      const res = await fetch(imagePath);
      const blob = await res.blob();
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error("Upload failed: ", error);
      return null;
    }
};
  

  export const saveMarker = async (markerData) => {
    try {
        // Da latitude og longitude nu er direkte egenskaber af markerData,
        // er der ikke længere brug for at udpakke dem fra en coordinate nøgle.
        const { latitude, longitude, title, imageUrl } = markerData;

        const docRef = await addDoc(collection(database, "markers"), {
            latitude,
            longitude,
            title,
            imageUrl, // Sørg for at denne er inkluderet, hvis du tilføjer billeder
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
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



