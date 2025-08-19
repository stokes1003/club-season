import { supabase } from "src/lib/supabase";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

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

    if (
      processedUri.startsWith("file://") ||
      processedUri.startsWith("content://")
    ) {
      // For local files, use FileSystem to read the file
      try {
        const base64 = await FileSystem.readAsStringAsync(processedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log("Local file read as base64, length:", base64.length);

        // Upload base64 directly to Supabase storage
        const { data, error } = await supabase.storage
          .from("images")
          .upload(path, base64, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (error) {
          console.error("Base64 upload failed:", error);
          return null;
        }

        console.log("Base64 upload successful:", data);

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(path);

        return urlData.publicUrl;
      } catch (fileError) {
        console.error("Failed to read local file:", fileError);
        return null;
      }
    } else {
      // For remote URLs, use fetch
      try {
        const response = await fetch(processedUri);
        if (!response.ok) {
          console.error("Failed to fetch remote image:", response.status);
          return null;
        }
        const blob = await response.blob();

        // Verify blob has content
        if (!blob || blob.size === 0) {
          console.error("Blob is empty or invalid");
          return null;
        }

        console.log("Blob created successfully, size:", blob.size, "bytes");

        // Warn about large file sizes
        if (blob.size > 5 * 1024 * 1024) {
          // 5MB
          console.warn(
            "Large file detected. Consider compressing images before upload to avoid storage quota issues."
          );
        }

        // Upload to Supabase storage
        console.log("Uploading to images bucket...");
        console.log("Upload path:", path);

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

          // Check if it's a bucket not found error
          if (
            error.message?.includes("bucket") ||
            error.message?.includes("not found")
          ) {
            console.error(
              "Storage bucket 'images' not found. Please create the bucket in your Supabase dashboard."
            );
            return null;
          }

          // Check if it's a permission error
          if (
            error.message?.includes("permission") ||
            error.message?.includes("unauthorized")
          ) {
            console.error(
              "Permission denied. Check your storage policies in Supabase."
            );
            return null;
          }

          return null;
        }

        console.log("Upload successful:", data);

        // Get the public URL (no expiration)
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(path);

        console.log("Public URL generated:", urlData.publicUrl);
        return urlData.publicUrl;
      } catch (fetchError) {
        console.error("Failed to fetch remote image:", fetchError);
        return null;
      }
    }
  } catch (error) {
    console.error("Upload error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Check if the error is a JSON parse error (HTML response)
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      console.error(
        "Received HTML response instead of JSON. This usually means:"
      );
      console.error("1. The storage bucket doesn't exist");
      console.error("2. There's a network connectivity issue");
      console.error("3. The Supabase service is down");
      console.error("4. There's an authentication issue");
    }

    return null;
  }
}
