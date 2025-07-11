import { supabase } from "src/lib/supabase";

export async function uploadImage(uri: string, path: string) {
  try {
    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authenticated:", authError);
      return null;
    }

    console.log("User authenticated:", user.id);

    // Fetch the image and convert to blob
    const response = await fetch(uri);
    if (!response.ok) {
      console.error(
        "Failed to fetch image:",
        response.status,
        response.statusText
      );
      return null;
    }

    const blob = await response.blob();

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("images")
      .upload(path, blob, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    if (error) {
      console.error("Image upload failed:", error);
      return null;
    }

    return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}
