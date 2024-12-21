import { imageDb } from "./Config";
import { ref, uploadBytes, getDownloadURL, getMetadata, deleteObject} from "firebase/storage";
import { generateHash } from "../../utils/utils";


export async function uploadImageToFS(img) {
  try {
    if (img instanceof Promise) {
      console.warn("Resolving img Promise...");
      img = await img;
    }

    const hash = await generateHash(img); 
    const filePath = `files/${hash}`; 
    const imgRef = ref(imageDb, filePath);

    const exists = await checkImageExists(filePath);
    if (exists) {
      const downloadURL = await getDownloadURL(imgRef);
      console.log("Image exists, URL:", downloadURL);
      return downloadURL;
    }

    await uploadBytes(imgRef, img);
    const downloadURL = await getDownloadURL(imgRef);
    console.log("Uploaded image URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error during image upload:", error);
    throw error;
  }
}


export async function deleteImageFromFS(filePath) {
  try {
    const fileExists = await checkImageExists(filePath);
    if (!fileExists) {
      console.warn(`File does not exist: ${filePath}`);
      return;
    }
    const fileRef = ref(imageDb, filePath); 
    await deleteObject(fileRef);
    console.log(`Deleted file: ${filePath}`);
  } catch (error) {
    if (error.code === "storage/object-not-found") {
      console.error("File not found:", filePath);
    } else {
      console.error("Error deleting file:", error);
    }
    throw error;
  }
}


export async function checkImageExists(filePath) {
  try {
    const imgRef = ref(imageDb, filePath);
    console.log('Checking file path:', filePath);
    const exists = await getMetadata(imgRef)
      .then(() => true)
      .catch((error) => {
        if (error.code === 'storage/object-not-found') {
          return false;
        }
        throw error;
      });
    
    return exists;
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
}