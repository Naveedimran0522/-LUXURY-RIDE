
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOTP, hashOTP } from "../utils/otp.js";
import { sendOTPEmail } from "../services/email.service.js";

// ==========================================
// JWT TOKEN
// ==========================================

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables.");
  }

  return jwt.sign(
    {
      id: String(user._id),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==========================================
// FORMAT USER RESPONSE
// ==========================================

const formatUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  emailVerified: user.emailVerified,
});

// ==========================================
// REQUEST OTP
// ==========================================

export const requestOTP = async (req, res) => {
  try {
    const { name, email, mode } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!["register", "login"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid authentication mode.",
      });
    }

    let user = await User.findOne({ email: normalizedEmail });

    // REGISTER
    if (mode === "register") {
      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name is required for registration.",
        });
      }

      if (user?.emailVerified) {
        return res.status(409).json({
          success: false,
          message: "This email is already registered. Please login.",
        });
      }

      if (!user) {
        user = new User({
          name: name.trim(),
          email: normalizedEmail,
        });
      } else {
        user.name = name.trim();
      }
    }

    // LOGIN
    if (mode === "login") {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Account not found. Please register first.",
        });
      }

      if (!user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email is not verified. Please register again.",
        });
      }
    }

    // OTP RESEND LIMIT
    if (
      user.otpLastSentAt &&
      Date.now() - new Date(user.otpLastSentAt).getTime() < 60 * 1000
    ) {
      const remainingSeconds = Math.ceil(
        (60 * 1000 -
          (Date.now() - new Date(user.otpLastSentAt).getTime())) /
          1000
      );

      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
        resendAfter: remainingSeconds,
      });
    }

    // GENERATE OTP
    const otp = generateOTP();

    user.otpHash = hashOTP(otp);
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.otpPurpose = mode;
    user.otpAttempts = 0;
    user.otpLastSentAt = new Date();

    await user.save();

    // SEND OTP EMAIL
    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error("OTP EMAIL ERROR:", emailError);

      user.otpHash = undefined;
      user.otpExpiresAt = undefined;
      user.otpPurpose = undefined;
      user.otpAttempts = 0;
      user.otpLastSentAt = undefined;

      await user.save();

      return res.status(500).json({
        success: false,
        message: "Unable to send OTP email. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
      expiresIn: 300,
      resendAfter: 60,
    });
  } catch (error) {
    console.error("REQUEST OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to request OTP.",
    });
  }
};

// ==========================================
// VERIFY OTP
// ==========================================

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, mode } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();
    const cleanOTP = String(otp || "").trim();

    if (!normalizedEmail || !/^\d{6}$/.test(cleanOTP)) {
      return res.status(400).json({
        success: false,
        message: "Valid email and 6-digit OTP are required.",
      });
    }

    if (!["register", "login"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid authentication mode.",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    if (mode === "register" && user.emailVerified) {
      return res.status(409).json({
        success: false,
        message: "Account is already verified. Please login.",
      });
    }

    if (mode === "login" && !user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email is not verified.",
      });
    }

    if (!user.otpHash || user.otpPurpose !== mode) {
      return res.status(400).json({
        success: false,
        message: "OTP is invalid or has expired. Request a new OTP.",
      });
    }

    // MAXIMUM ATTEMPTS
    if ((user.otpAttempts || 0) >= 5) {
      user.otpHash = undefined;
      user.otpExpiresAt = undefined;
      user.otpPurpose = undefined;
      user.otpAttempts = 0;
      user.otpLastSentAt = undefined;

      await user.save();

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Request a new OTP.",
      });
    }

    // EXPIRY CHECK
    if (
      !user.otpExpiresAt ||
      new Date(user.otpExpiresAt).getTime() < Date.now()
    ) {
      user.otpHash = undefined;
      user.otpExpiresAt = undefined;
      user.otpPurpose = undefined;
      user.otpAttempts = 0;
      user.otpLastSentAt = undefined;

      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // VERIFY HASH
    if (hashOTP(cleanOTP) !== user.otpHash) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;

      await user.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect OTP.",
        attemptsRemaining: Math.max(0, 5 - user.otpAttempts),
      });
    }

    // REGISTRATION VERIFICATION
    if (mode === "register") {
      user.emailVerified = true;
    }

    // CLEAR OTP DATA
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpPurpose = undefined;
    user.otpAttempts = 0;
    user.otpLastSentAt = undefined;

    await user.save();

    // CREATE JWT
    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message:
        mode === "register"
          ? "Registration completed successfully."
          : "Login successful.",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP.",
    });
  }
};

// ==========================================
// GET CURRENT LOGGED-IN USER
// ==========================================

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    return res.status(200).json({
      success: true,
      user: formatUser(req.user),
    });
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user details.",
    });
  }
};
