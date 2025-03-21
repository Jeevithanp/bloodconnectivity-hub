
import { supabase } from '@/integrations/supabase/client';
import { EmergencyNotification } from '@/types/profile';

export async function sendSms(phoneNumber: string, message: string, isEmergency: boolean = false) {
  try {
    const { data, error } = await supabase.functions.invoke('twilio-notifications', {
      body: { 
        type: 'sms',
        to: phoneNumber,
        message: message,
        emergency: isEmergency
      }
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

export async function makeCall(phoneNumber: string, message: string, isEmergency: boolean = false) {
  try {
    const { data, error } = await supabase.functions.invoke('twilio-notifications', {
      body: { 
        type: 'call',
        to: phoneNumber,
        message: message,
        emergency: isEmergency
      }
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error making call:', error);
    throw error;
  }
}

export async function notifyEmergencyRecipient(notification: EmergencyNotification) {
  try {
    const results = [];
    
    // Send SMS if phone number is available
    if (notification.recipientPhone) {
      const smsMessage = `EMERGENCY BLOOD REQUEST: ${notification.bloodType} blood needed at ${notification.hospitalName}. Urgency: ${notification.urgency}. ${notification.message}`;
      const smsResult = await sendSms(notification.recipientPhone, smsMessage, true);
      results.push({ type: 'sms', ...smsResult });
    }
    
    // Make call if phone number is available and urgency is high/critical
    if (notification.recipientPhone && (notification.urgency === 'high' || notification.urgency === 'critical')) {
      const callMessage = `This is an emergency blood donation request for ${notification.bloodType} blood type at ${notification.hospitalName}. The urgency level is ${notification.urgency}. ${notification.message}`;
      const callResult = await makeCall(notification.recipientPhone, callMessage, true);
      results.push({ type: 'call', ...callResult });
    }
    
    return { success: true, results };
  } catch (error) {
    console.error('Error notifying emergency recipient:', error);
    throw error;
  }
}
