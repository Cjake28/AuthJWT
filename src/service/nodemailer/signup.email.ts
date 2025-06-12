// src/services/nodemailer/mail.service.ts
import { transporter } from "./config.email";
import { VERIFICATION_EMAIL_TEMPLATE } from "./templates.email";

export default async function sendSignupEmailVerification(
  email: string,
  verificationCode: string
) {
  try {
    const result = await transporter.sendMail({
      from: `"Your App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Email Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode
      ),
    });
    return result;
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw err;
  }
}
