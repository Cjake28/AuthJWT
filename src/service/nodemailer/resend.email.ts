// src/services/nodemailer/mail.service.ts
import { transporter } from "./config.email";
import { RESEND_VERIFICATION_EMAIL_TEMPLATE } from "./templates.email";
import AppError from "../../utils/AppError";

export default async function sendResendEmailVerification(
  email: string,
  verificationCode: string
) {
  try {
    const result = await transporter.sendMail({
      from: `"Your App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your New Verification Code",
      html: RESEND_VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode
      ),
    });
    return result;
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw new AppError("Failed to send Resend verification email", 500);
  }
}
