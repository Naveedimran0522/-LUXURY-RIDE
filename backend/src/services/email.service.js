
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp, name) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are not configured");
  }

  await transporter.sendMail({
    from: `"LuxRide" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your LuxRide Verification Code",

    text: `Hello ${name}, your LuxRide verification code is ${otp}. It expires in 5 minutes. Do not share this code.`,

    html: `
      <div style="background:#0b1511;padding:35px;font-family:Arial;color:#fff">
        <div style="max-width:480px;margin:auto;background:#13221a;padding:35px;border:1px solid #c5a66b">
          <h1 style="color:#c5a66b;text-align:center">LUXRIDE</h1>
          <h2>Hello ${name},</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing:12px;color:#c5a66b;text-align:center">
            ${otp}
          </h1>
          <p>This code expires in 5 minutes.</p>
          <p style="color:#aaa">Please do not share your OTP with anyone.</p>
        </div>
      </div>
    `,
  });
};
