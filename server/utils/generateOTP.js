const { generate } = require("otp-generator");

function generateOtp() {
  const otp = generate(6, { 
    digits: true, 
    lowerCaseAlphabets: false, 
    upperCaseAlphabets: false, 
    specialChars: false 
  });
  
  // Expires in 10 minutes
  const otpExpires = Date.now() + 10 * 60 * 1000;

  return { otp, otpExpires };
}

module.exports = { generateOtp };