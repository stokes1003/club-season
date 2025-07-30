import { supabase } from "../lib/supabase";

export interface EmailData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export async function sendEmail(emailData: EmailData) {
  try {
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: emailData,
    });

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Email send failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}
