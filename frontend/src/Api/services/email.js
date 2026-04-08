const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (fullname, email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your Verification OTP",
    html: `
    <div style="font-family: Arial, sans-serif; min-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
      <h1>Hello ${fullname},</h2>
      <p>Your OTP for password reset is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    </div>`
  });
  return info;
};

module.exports = sendEmail;