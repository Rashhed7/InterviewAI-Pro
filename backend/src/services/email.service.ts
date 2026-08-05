import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Verification OTP Email (Sent during registration / OTP request)
export const sendVerificationEmail = async (
  email: string,
  name: string,
  otp: string
) => {
  console.log(`\n========================================`);
  console.log(`🔑 [DEV OTP CODE] For ${email} (${name}): ${otp}`);
  console.log(`========================================\n`);

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"InterviewAI Pro" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "InterviewAI Pro - Email Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 40px 20px; color: #f8fafc;">
            <div style="max-width: 550px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155; text-align: center;">
              <h1 style="color: #3b82f6; font-size: 28px; margin-bottom: 12px;">🤖 InterviewAI Pro</h1>
              <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 16px;">Email Verification Required</h2>
              <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Hello ${name}, please use the 6-digit verification code below to verify your email address and proceed with creating your account.
              </p>
              
              <div style="background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%); padding: 18px; border-radius: 12px; margin: 24px 0; display: inline-block;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #ffffff; font-family: monospace;">${otp}</span>
              </div>
              
              <p style="color: #64748b; font-size: 13px; margin-top: 16px;">
                This OTP code expires in 10 minutes. If you did not request this code, please ignore this email.
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
              © ${new Date().getFullYear()} InterviewAI Pro. All rights reserved.
            </div>
          </div>
        `,
      });
      console.log(`📧 Verification OTP email sent to ${email}`);
    }
  } catch (error) {
    console.error("⚠️ Failed to send verification email:", error);
  }
};

// 2. Congratulations Email (Sent ONLY AFTER successful OTP verification & account creation)
export const sendCongratulationEmail = async (
  email: string,
  name: string
) => {
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"InterviewAI Pro" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🎉 Congratulations! Your InterviewAI Pro Account Created Successfully",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 40px 20px; color: #f8fafc;">
            <div style="max-width: 550px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155; text-align: center;">
              <h1 style="color: #3b82f6; font-size: 28px; margin-bottom: 12px;">🤖 InterviewAI Pro</h1>
              <div style="font-size: 48px; margin: 16px 0;">🎉</div>
              <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">Congratulations ${name}!</h2>
              <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Your email has been verified and your <strong>InterviewAI Pro account has been created successfully</strong>!
              </p>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                You can now sign in to your account and start practicing mock interviews with AI.
              </p>
              
              <a href="http://localhost:5173/login" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; margin-top: 12px;">
                Go to Login Page →
              </a>
              
              <p style="color: #64748b; font-size: 13px; margin-top: 28px;">
                Thank you for joining InterviewAI Pro.
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
              © ${new Date().getFullYear()} InterviewAI Pro. All rights reserved.
            </div>
          </div>
        `,
      });
      console.log(`📧 Congratulations email sent to ${email}`);
    }
  } catch (error) {
    console.error("⚠️ Failed to send congratulation email:", error);
  }
};

// 3. Reset Password Email (Sent when user requests a password reset)
export const sendResetPasswordEmail = async (
  email: string,
  name: string,
  otp: string
) => {
  console.log(`\n========================================`);
  console.log(`🔑 [DEV RESET PASSWORD CODE] For ${email} (${name}): ${otp}`);
  console.log(`========================================\n`);

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"InterviewAI Pro Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🔐 Reset Your InterviewAI Pro Password",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 40px 20px; color: #f8fafc;">
            <div style="max-width: 550px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155; text-align: center;">
              <h1 style="color: #3b82f6; font-size: 28px; margin-bottom: 12px;">🤖 InterviewAI Pro</h1>
              <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 16px;">Password Reset Request</h2>
              <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Hello ${name}, you requested to reset your password. Use the 6-digit code below to set a new password for your account.
              </p>
              
              <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 18px; border-radius: 12px; margin: 24px 0; display: inline-block;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #ffffff; font-family: monospace;">${otp}</span>
              </div>
              
              <p style="color: #64748b; font-size: 13px; margin-top: 16px;">
                This password reset code expires in 15 minutes. If you did not request a password reset, please secure your account immediately.
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
              © ${new Date().getFullYear()} InterviewAI Pro. All rights reserved.
            </div>
          </div>
        `,
      });
      console.log(`📧 Password reset email sent to ${email}`);
    }
  } catch (error) {
    console.error("⚠️ Failed to send password reset email:", error);
  }
};