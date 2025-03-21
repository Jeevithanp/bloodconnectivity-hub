
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { Twilio } from "https://esm.sh/twilio@4.19.0";

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
    const { type, to, message, emergency } = await req.json();
    
    // Initialize Twilio client
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
    
    if (!accountSid || !authToken || !twilioNumber) {
      throw new Error("Missing Twilio environment variables");
    }
    
    const client = new Twilio(accountSid, authToken);
    let result;
    
    console.log(`Processing ${type} request to ${to} with message: ${message}`);
    
    // Handle different notification types
    switch (type) {
      case "sms":
        result = await client.messages.create({
          body: message,
          from: twilioNumber,
          to: to
        });
        console.log(`SMS sent successfully, SID: ${result.sid}`);
        break;
        
      case "call":
        // For calls, we generate TwiML to create a voice message
        const twiml = `
          <Response>
            <Say>${message}</Say>
            ${emergency ? '<Pause length="1"/><Say>This is an emergency blood donation request. Please respond as soon as possible.</Say>' : ''}
            <Pause length="1"/>
            <Say>Thank you for your support.</Say>
          </Response>
        `;
        
        result = await client.calls.create({
          twiml: twiml,
          from: twilioNumber,
          to: to
        });
        console.log(`Call initiated successfully, SID: ${result.sid}`);
        break;
        
      default:
        throw new Error(`Invalid notification type: ${type}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, sid: result.sid }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in Twilio notification function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
