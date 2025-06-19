import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

import AppError from "../../utils/AppError";

import {generateVerificationCode} from "../../utils/generateVerificationCode";
import sendResendEmailVerification from "../../service/nodemailer/resend.email"

const resendVerifyEmail = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const { email} = req.body;
  const ua = req.headers["user-agent"] || "";

  console.log("Resend verification email request from:", ua);
  
  // ✅ 1. Check if the email is provided
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const EmailLower = email.toLowerCase();

  // ✅ 2. Check if the email exists
  const user = await prisma.user.findUnique({
  where: {
    email: EmailLower,
  },
  });

  if (!user) {
    throw new AppError("Email not found", 404);
  }

  const { userId, role, isVerified, emailVerified, verificationCode, verificationCodeExpiresAt } = user;

  // ✅ 3. Check if the user is already verified
  if (isVerified && emailVerified) {
    throw new AppError("User is already verified", 400);
  }


  // ✅ 4. Check if the verificatio at least 2 minutes passed since last send
  const RESEND_COOLDOWN_MS = 2 * 60 * 1000;
  if (user.verificationCodeSentAt) {
    const lastSent = new Date(user.verificationCodeSentAt).getTime();
    const now = Date.now();

    if (now - lastSent < RESEND_COOLDOWN_MS) {
      const secondsLeft = Math.ceil((RESEND_COOLDOWN_MS - (now - lastSent)) / 1000);
      throw new AppError(`Please wait ${secondsLeft} seconds before resending.`, 429);
    }
  }

  // ✅ 5. Generate a new verification code and expiration time
  const NewverificationCode: string = generateVerificationCode();
	const NewverificationCodeSentAt: Date = new Date();
	const NewverificationCodeExpiresAt: Date = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

  // ✅ 6. Update the user with the new verification code and expiration time
  await prisma.user.update({
    where: {
      email: EmailLower,
    },
    data: {
      verificationCode: NewverificationCode,
      verificationCodeSentAt: NewverificationCodeSentAt,
      verificationCodeExpiresAt: NewverificationCodeExpiresAt,
    },
  });

  // ✅ 7. Send the verification email
  await sendResendEmailVerification(email, NewverificationCode);

  res.status(200).json({
    status: "success",
    message: "Verification email resent successfully",
  });

}


export default resendVerifyEmail;