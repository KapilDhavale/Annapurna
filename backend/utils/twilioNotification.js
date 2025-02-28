const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from Twilio
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from Twilio
const client = twilio(accountSid, authToken);

/**
 * Send an SMS notification.
 * @param {string} to - The recipient's phone number (in E.164 format, e.g., "+1234567890").
 * @param {string} message - The SMS message content.
 */
exports.sendSMS = async (to, message) => {
  try {
    const msg = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,  // Your Twilio number
      to: to
    });
    console.log("SMS sent:", msg.sid);
    return msg;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};
