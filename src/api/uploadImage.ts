import { supabase } from "src/lib/supabase";
import * as ImageManipulator from "expo-image-manipulator";

const compressImage = async (
  uri: string,
  maxWidth: number = 600,
  maxHeight: number = 600,
  quality: number = 0.7
): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: maxWidth,
            height: maxHeight,
          },
        },
      ],
      {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    return result.uri;
  } catch (error) {
    console.warn("Failed to compress image:", error);
    return uri;
  }
};

export async function uploadImage(uri: string, path: string) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authenticated:", authError);
      return null;
    }

    // Check if token needs refresh
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (
      session?.expires_at &&
      new Date(session.expires_at * 1000) < new Date()
    ) {
      console.log("Token expired, refreshing...");
      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession();
      if (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return null;
      }
      console.log("Token refreshed successfully");
    }

    console.log("User authenticated:", user.id);

    let processedUri = uri;
    if (uri.startsWith("file://") || uri.startsWith("content://")) {
      try {
        console.log("Compressing local image...");
        processedUri = await compressImage(uri, 800, 0.8);
        console.log("Image compressed successfully");
      } catch (compressError) {
        console.warn(
          "Failed to compress image, using original:",
          compressError
        );
      }
    }

    const response = await fetch(processedUri);
    if (!response.ok) {
      console.error(
        "Failed to fetch image:",
        response.status,
        response.statusText
      );
      return null;
    }

    const blob = await response.blob();
    console.log(
      "Final blob size:",
      blob.size,
      "bytes (",
      Math.round((blob.size / 1024 / 1024) * 100) / 100,
      "MB)"
    );

    // Warn about large file sizes
    if (blob.size > 5 * 1024 * 1024) {
      // 5MB
      console.warn(
        "Large file detected. Consider compressing images before upload to avoid storage quota issues."
      );
    }

    // Upload to Supabase storage
    console.log("Uploading to images bucket...");
    const { data, error } = await supabase.storage
      .from("images")
      .upload(path, blob, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    if (error) {
      console.error("Image upload failed:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });

      // Check for specific error types
      if (
        error.message?.includes("quota") ||
        error.message?.includes("storage") ||
        error.message?.includes("limit")
      ) {
        console.error("Storage quota exceeded or storage limit reached");
        return null;
      }

      if (
        error.message?.includes("413") ||
        error.message?.includes("Payload Too Large")
      ) {
        console.error("File size too large for upload");
        return null;
      }

      return null;
    }

    console.log("Upload successful:", data);
    return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}
