
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const requestData = await req.json();
    const { action, userId, data } = requestData;

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    let result;

    // Handle different actions
    switch (action) {
      case "getProfile":
        // Get user profile
        result = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        break;

      case "updateProfile":
        // Update user profile
        result = await supabase
          .from("profiles")
          .update(data)
          .eq("id", userId);
        break;

      case "getDonors":
        // Get list of donors based on blood type and location
        const { bloodType, maxDistance } = data;
        const query = supabase
          .from("profiles")
          .select("*")
          .eq("is_donor", true);

        if (bloodType) {
          query.eq("blood_type", bloodType);
        }
        
        // Note: For a real app, you would need to calculate distance based on coords
        // This is a simplified version
        result = await query;
        break;

      case "updateDonorStatus":
        // Update donor status
        result = await supabase
          .from("profiles")
          .update({ 
            is_donor: data.isDonor,
            last_donation: data.isDonor ? new Date().toISOString() : null
          })
          .eq("id", userId);
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
    }

    if (result.error) {
      throw result.error;
    }

    return new Response(
      JSON.stringify({ data: result.data, success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
