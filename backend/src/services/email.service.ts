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
        subject: `${otp} is your InterviewAI Pro verification code`,
        text: `Hello ${name},\n\nYour 6-digit email verification code for InterviewAI Pro is: ${otp}\n\nThis code expires in 10 minutes.\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe InterviewAI Pro Team`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b;">
            <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; text-align: center; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #2563eb; font-size: 24px; margin-top: 0; margin-bottom: 8px;">InterviewAI Pro</h2>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Account Verification Code</p>
              
              <p style="color: #334155; font-size: 15px; line-height: 1.5; text-align: left; margin-bottom: 20px;">
                Hello <strong>${name}</strong>,<br/><br/>
                Please use the verification code below to confirm your email address and activate your InterviewAI Pro account.
              </p>
              
              <div style="background-color: #f1f5f9; border: 1px border #cbd5e1; padding: 16px; border-radius: 8px; margin: 24px 0; display: inline-block;">
                <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #1e293b; font-family: monospace;">${otp}</span>
              </div>
              
              <p style="color: #64748b; font-size: 13px; margin-top: 20px; text-align: left;">
                This code will expire in 10 minutes. If you did not request this code, no further action is required.
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} InterviewAI Pro. All rights reserved.
              </p>
            </div>
          </div>
        `,
        headers: {
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
          Importance: "high",
        },
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
        subject: `Welcome to InterviewAI Pro, ${name}`,
        text: `Hello ${name},\n\nYour InterviewAI Pro account has been successfully verified!\n\nYou can now sign in to your account at http://localhost:5173/login and start practicing mock interviews.\n\nBest regards,\nThe InterviewAI Pro Team`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b;">
            <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; text-align: center;">
              <h2 style="color: #2563eb; font-size: 24px; margin-top: 0; margin-bottom: 8px;">InterviewAI Pro</h2>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Welcome Aboard!</p>
              
              <p style="color: #334155; font-size: 15px; line-height: 1.5; text-align: left; margin-bottom: 20px;">
                Hello <strong>${name}</strong>,<br/><br/>
                Your email address has been verified and your <strong>InterviewAI Pro</strong> account is ready to use.
              </p>
              
              <div style="margin: 28px 0;">
                <a href="http://localhost:5173/login" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
                  Sign In to Studio →
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} InterviewAI Pro. All rights reserved.
              </p>
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
        subject: `${otp} is your InterviewAI Pro password reset code`,
        text: `Hello ${name},\n\nYour 6-digit password reset code is: ${otp}\n\nThis code expires in 15 minutes.\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nInterviewAI Pro Security`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b;">
            <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; text-align: center;">
              <h2 style="color: #dc2626; font-size: 24px; margin-top: 0; margin-bottom: 8px;">InterviewAI Pro</h2>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Password Reset Request</p>
              
              <p style="color: #334155; font-size: 15px; line-height: 1.5; text-align: left; margin-bottom: 20px;">
                Hello <strong>${name}</strong>,<br/><br/>
                We received a request to reset your password. Use the code below to proceed.
              </p>
              
              <div style="background-color: #fef2f2; border: 1px border #fecaca; padding: 16px; border-radius: 8px; margin: 24px 0; display: inline-block;">
                <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #dc2626; font-family: monospace;">${otp}</span>
              </div>
              
              <p style="color: #64748b; font-size: 13px; margin-top: 20px; text-align: left;">
                This code expires in 15 minutes. If you did not request a password reset, please secure your account.
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} InterviewAI Pro. All rights reserved.
              </p>
            </div>
          </div>
        `,
        headers: {
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
          Importance: "high",
        },
      });
      console.log(`📧 Password reset email sent to ${email}`);
    }
  } catch (error) {
    console.error("⚠️ Failed to send password reset email:", error);
  }
};

// 4. Payment Success & Greetings Email (Sent immediately after successful payment verification)
export const sendPaymentSuccessEmail = async (
  email: string,
  name: string,
  plan: string,
  amount: number,
  paymentId: string
) => {
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"InterviewAI Pro" <${process.env.EMAIL_USER}>`,
        replyTo: process.env.EMAIL_USER,
        to: email,
        subject: `InterviewAI Pro ${plan} Plan Subscription Confirmation`,
        text: `Hello ${name},\n\nThank you for upgrading to InterviewAI Pro ${plan} Plan!\n\nTransaction Receipt Summary:\n- Subscribed Plan: ${plan} Plan\n- Amount Paid: ₹${amount} INR\n- Payment ID: ${paymentId}\n- Date: ${new Date().toLocaleDateString()}\n\nYour account has been upgraded and full access is now active.\n\nAccess your account: http://localhost:5173/dashboard\n\nBest regards,\nThe InterviewAI Pro Team`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 32px 16px; color: #1e293b;">
            <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
              <h2 style="color: #2563eb; font-size: 22px; margin-top: 0; margin-bottom: 4px;">InterviewAI Pro</h2>
              <p style="color: #64748b; font-size: 13px; margin-bottom: 24px;">Payment Confirmation & Invoice Receipt</p>

              <p style="color: #334155; font-size: 15px; line-height: 1.5; margin-bottom: 20px;">
                Hello <strong>${name}</strong>,<br/><br/>
                Thank you for your purchase. Your payment has been successfully processed and your <strong>InterviewAI Pro ${plan} Plan</strong> is now active.
              </p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #1e293b; font-size: 14px; margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Order Details</h3>
                <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600;">Plan:</td>
                    <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #2563eb;">${plan} Plan</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600;">Amount Paid:</td>
                    <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #166534;">₹${amount} INR</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600;">Payment ID:</td>
                    <td style="padding: 6px 0; text-align: right; font-family: monospace; font-size: 12px;">${paymentId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600;">Date:</td>
                    <td style="padding: 6px 0; text-align: right;">${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin: 28px 0 16px 0;">
                <a href="http://localhost:5173/dashboard" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
                  Launch Interview Studio →
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} InterviewAI Pro. All rights reserved.
              </p>
            </div>
          </div>
        `,
        headers: {
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
          Importance: "high",
          "X-Auto-Response-Suppress": "OOF, AutoReply",
        },
      });
      console.log(`📧 Payment success confirmation email sent to ${email}`);
    }
  } catch (error) {
    console.error("⚠️ Failed to send payment success email:", error);
  }
};