
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";

const saveTrip = async (trip) => {
  try {
    if (trip.incidentDetected) {
      const response = await fetch(trip.videoUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `videos/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const videoURL = await getDownloadURL(storageRef);
      trip.videoURL = videoURL;
    }

    await addDoc(collection(db, "trips"), trip);
  } catch (error) {
    console.error("Error saving trip: ", error);
  }
};

export { saveTrip };
