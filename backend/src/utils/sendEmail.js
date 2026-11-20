
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* LUXRIDE — PREMIUM OTP EMAIL SERVICE */

import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp, name = "Customer") => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error(
      "Email credentials missing. Check EMAIL_USER and EMAIL_PASS in backend .env"
    );
  }

  const port = Number(process.env.SMTP_PORT || 465);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  await transporter.sendMail({
    from: `"LuxRide" <${emailUser}>`,
    to: email,
    subject: "Your LuxRide Verification Code",

    text: `Hello ${name}, your LuxRide verification code is ${otp}. It expires in 5 minutes. Do not share this code.`,

    html: `
      <div style="background:#0b1511;padding:35px;font-family:Arial;color:#fff">
        <div style="max-width:480px;margin:auto;background:#13221a;padding:35px;border:1px solid #c5a66b">

          <h1 style="color:#c5a66b;text-align:center">
            LUXRIDE
          </h1>

          <h2>Hello ${name},</h2>

          <p>Your verification code is:</p>

          <h1 style="letter-spacing:12px;color:#c5a66b;text-align:center">
            ${otp}
          </h1>

          <p>This code expires in 5 minutes.</p>

          <p style="color:#aaa">
            Please do not share your OTP with anyone.
          </p>

        </div>
      </div>
    `,
  });

  console.log("LuxRide OTP email sent successfully");
};
