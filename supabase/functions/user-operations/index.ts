import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const requestData = await req.json();
    const { action, userId, data, donorId } = requestData;

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

      case "updateLocation":
        // Update user location
        result = await supabase
          .from("profiles")
          .update({
            latitude: data.latitude,
            longitude: data.longitude,
            updated_at: new Date().toISOString()
          })
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
        
        // Filter by distance if we have user coordinates
        result = await query;
        break;

      case "getNearbyDonors":
        // Get list of donors based on blood type, location, and calculate distance
        const { latitude, longitude } = data;
        
        // First get all potential donors
        const donorsQuery = supabase
          .from("profiles")
          .select("*")
          .eq("is_donor", true);
        
        if (data.bloodType) {
          donorsQuery.eq("blood_type", data.bloodType);
        }
        
        const donorsResult = await donorsQuery;
        
        if (donorsResult.error) {
          throw donorsResult.error;
        }
        
        // Filter and calculate distance for each donor
        if (latitude && longitude) {
          // Only include donors that have coordinates
          const donorsWithDistance = donorsResult.data
            .filter(donor => donor.latitude && donor.longitude)
            .map(donor => {
              const distance = calculateDistance(
                latitude, 
                longitude, 
                donor.latitude!, 
                donor.longitude!
              );
              return { ...donor, distance };
            })
            .filter(donor => data.maxDistance ? donor.distance <= data.maxDistance : true)
            .sort((a, b) => a.distance - b.distance);
          
          result = { data: donorsWithDistance };
        } else {
          result = donorsResult;
        }
        break;

      case "createEmergencyRequest":
        // Create emergency blood request and notify nearby donors
        const emergencyData = {
          blood_type: data.bloodType,
          hospital: data.hospital,
          urgency: data.urgency,
          units: data.units,
          details: data.details,
          latitude: data.latitude,
          longitude: data.longitude,
          user_id: userId || null,
          created_at: new Date().toISOString(),
          status: 'active'
        };
        
        // Insert emergency request
        const emergencyResult = await supabase
          .from("emergency_requests")
          .insert(emergencyData)
          .select();
        
        if (emergencyResult.error) {
          throw emergencyResult.error;
        }
        
        // Find nearby donors with matching blood type
        const nearbyDonorsQuery = supabase
          .from("profiles")
          .select("*")
          .eq("is_donor", true);
        
        if (data.bloodType) {
          nearbyDonorsQuery.eq("blood_type", data.bloodType);
        }
        
        const nearbyDonorsResult = await nearbyDonorsQuery;
        
        if (nearbyDonorsResult.error) {
          throw nearbyDonorsResult.error;
        }
        
        // Calculate distance and filter by maxDistance
        const nearbyDonors = nearbyDonorsResult.data
          .filter(donor => donor.latitude && donor.longitude)
          .map(donor => {
            const distance = calculateDistance(
              data.latitude, 
              data.longitude, 
              donor.latitude!, 
              donor.longitude!
            );
            return { ...donor, distance };
          })
          .filter(donor => donor.distance <= 10); // Hard-coded 10km for emergency notifications
        
        // Simulate sending notifications to nearby donors
        console.log(`Emergency request created. Notified ${nearbyDonors.length} donors.`);
        
        result = { 
          data: { 
            request: emergencyResult.data[0],
            notifiedDonors: nearbyDonors.length,
            respondingDonors: Math.floor(nearbyDonors.length / 2) // Mock data
          } 
        };
        break;

      
      
      case "getDonationCenters":
        // Get donation centers near a location
        // For now, this would be mocked data
        // In a real app, you'd query a DB of donation centers or use an external API
        result = { data: [] }; // Mock empty response, frontend will fall back to mock data
        break;

      case "trackDonor":
        // Track a donor's location - in a real app, this would integrate with
        // a real-time location sharing service
        if (!donorId) {
          throw new Error("Donor ID is required for tracking");
        }
        
        // Get donor profile
        const donorResult = await supabase
          .from("profiles")
          .select("*")
          .eq("id", donorId)
          .single();
        
        if (donorResult.error) {
          throw donorResult.error;
        }
        
        if (!donorResult.data.latitude || !donorResult.data.longitude) {
          throw new Error("Donor location not available");
        }
        
        // Mock some donor movement - in a real app, you'd get real-time updates
        const jitter = 0.001; // Add small random movement
        const mockLocation = {
          latitude: donorResult.data.latitude + (Math.random() - 0.5) * jitter,
          longitude: donorResult.data.longitude + (Math.random() - 0.5) * jitter,
          lastUpdated: new Date().toISOString(),
          status: Math.random() > 0.7 ? 'stationary' : 'moving',
          eta: '10-15 minutes'
        };
        
        result = { data: mockLocation };
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

      case "registerDonation":
        // Register a donation
        const donationData = {
          user_id: userId,
          hospital_name: data.hospitalName,
          donation_date: data.donationDate,
          donation_time: data.donationTime,
          notes: data.additionalNotes || null,
          created_at: new Date().toISOString()
        };
        
        // Update the user's last donation date
        const userUpdateResult = await supabase
          .from("profiles")
          .update({ 
            last_donation: new Date().toISOString()
          })
          .eq("id", userId);
        
        if (userUpdateResult.error) {
          throw userUpdateResult.error;
        }
        
        // In a real app, we would store this in a donations table
        // For now, just return success
        result = { data: { success: true, message: "Donation registered successfully" } };
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
