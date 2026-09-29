import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "SoftCrayons"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export function getOTPEmailTemplate(otp: string, expiresInMinutes: number = 10) {
  return {
    subject: "Your Password Reset OTP - SoftCrayons",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">SoftCrayons</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
          <p>You have requested to reset your password. Use the OTP below to proceed:</p>
          <div style="background-color: #667eea; color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">
            This OTP will expire in <strong>${expiresInMinutes} minutes</strong>.
          </p>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, please ignore this email or contact support if you have concerns.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message from SoftCrayons. Please do not reply to this email.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `Your password reset OTP is: ${otp}. This OTP will expire in ${expiresInMinutes} minutes. If you didn't request this, please ignore this email.`,
  };
}

export function getWelcomeEmailTemplate(name: string, email: string, temporaryPassword?: string) {
  return {
    subject: "Welcome to SoftCrayons - Your Account Has Been Created",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SoftCrayons</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to SoftCrayons!</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hello ${name || "there"}!</h2>
          <p>Your account has been successfully created by an administrator.</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
            ${temporaryPassword ? `<p style="margin: 10px 0 0;"><strong>Temporary Password:</strong> ${temporaryPassword}</p>` : ""}
          </div>
          ${temporaryPassword ? `<p style="color: #e74c3c; font-weight: bold;">Please change your password after your first login for security purposes.</p>` : ""}
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/sign-in" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Sign In Now</a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 20px;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message from SoftCrayons. Please do not reply to this email.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to SoftCrayons! Your account has been created. Email: ${email}${temporaryPassword ? `. Temporary Password: ${temporaryPassword}. Please change your password after your first login.` : ""} Visit ${process.env.NEXT_PUBLIC_APP_URL}/sign-in to log in.`,
  };
}

export function getPasswordResetEmailTemplate(resetUrl: string) {
  return {
    subject: "Reset Your Password - SoftCrayons",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">SoftCrayons</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in <strong>1 hour</strong>.
          </p>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, please ignore this email or contact support if you have concerns.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message from SoftCrayons. Please do not reply to this email.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `Reset your password by clicking the following link: ${resetUrl}. This link will expire in 1 hour. If you didn't request this, please ignore this email.`,
  };
}
