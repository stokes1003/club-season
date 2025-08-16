import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { uploadImage } from "src/api/uploadImage";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

export const useUploadImage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async (
    bucket: string,
    entityId: string
  ): Promise<string | null> => {
    try {
      setError(null);
      setIsUploading(true);

      // Request permissions first
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
        return null;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        return null;
      }

      const localUri = result.assets[0].uri;
      setImage(localUri); // Set local URI for immediate display

      // Upload to blob storage
      const path = `${bucket}/${entityId}/${uuidv4()}.jpg`;
      const uploadedUrl = await uploadImage(localUri, path);

      if (uploadedUrl) {
        setImage(uploadedUrl); // Update with uploaded URL
        return uploadedUrl;
      } else {
        setError("Failed to upload image");
        Alert.alert("Error", "Failed to upload image");
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      Alert.alert("Error", "Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setError(null);
  };

  return {
    image,
    isUploading,
    error,
    pickImage,
    clearImage,
  };
};
