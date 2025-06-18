import { Request, Response, Send} from "express";
import { PrismaClient } from "@prisma/client";

import bcrypt from 'bcrypt';

import AppError from "../../utils/AppError";
import { generateVerificationCode } from '../../utils/generateVerificationCode';

import sendSignupEmailVerification from "../../service/nodemailer/signup.email"

type signupReqBody = {
	firstname: string,
	surname: string | null,
	email: string,
	password: string,
}

// type createUserData = signupReqBody &  {
// 	isVerified: boolean,
// 	emailVerified: boolean,
// 	verificationCode: string,
// 	verificationCodeSentAt: Date,
// 	verificationCodeExpiresAt: Date
// }


export const signup = async (req: Request, res: Response): Promise<void> =>{
	const prisma = new PrismaClient();
	const {firstname, surname, email, password}: signupReqBody = req.body;

	if (!firstname || !email || !password){
		throw new AppError("Please provide all required fields", 400);
	}

	const EmailLower: string = email.toLowerCase();

	const user = await prisma.user.findUnique({
		where: { email: EmailLower }
	});

	const isEmailVerified = user?.emailVerified ?? false;

	const isVerified = user?.isVerified ?? false;

	if (isEmailVerified && isVerified){
		console.log ("User already exists and email is verified");
		throw new AppError("Account already exists", 400);
	}

	if (isEmailVerified && !isVerified) {
		console.log ("User suspended");
		throw new AppError("User suspended", 400);
	}

	if (user) {
		const deleteUser = await prisma.user.delete({where: {email: EmailLower}})

		if (deleteUser) {
			console.log("Deleted user with email:", EmailLower);
		}
	}


	const encryptedPassword: string = await bcrypt.hash(password, 10);

	const verificationCode: string = generateVerificationCode();
	const verificationCodeSentAt: Date = new Date();
	const verificationCodeExpiresAt: Date = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes

	try {
    await sendSignupEmailVerification(email, verificationCode);
  } catch (err) {
    // map any mail‑service failure into your AppError
    throw new AppError(
      "Could not send verification email. Please try again later.",
      500
    );
  }

  const newUser = await prisma.user.create({
		data: {
			firstName: firstname,
			lastName: surname ?? "",
			email: EmailLower,
			password: encryptedPassword,
			isVerified: false,
			emailVerified: false,
			verificationCode: verificationCode,
			verificationCodeSentAt: verificationCodeSentAt,
			verificationCodeExpiresAt: verificationCodeExpiresAt,
		}
	});

	res.status(201).json({ success: true, message: "User created successfully" });
}