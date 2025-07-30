// @ts-ignore - Deno imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, limit = 5 } = await req.json();

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: "Latitude and longitude are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get API key from environment
    // @ts-ignore - Deno global
    const apiKey = Deno.env.get("GOLF_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Golf API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Make request to golf API for nearby courses with full details
    const response = await fetch(
      `https://api.golfcourseapi.com/v1/courses/nearby?latitude=${latitude}&longitude=${longitude}&limit=${limit}&include_details=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Golf API error: ${response.status} ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in get-courses-nearby function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
