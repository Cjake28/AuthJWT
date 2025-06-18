import {Request, Response, NextFunction} from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

import AppError from '../../utils/AppError';    

import { generateAccessToken, generateRefreshToken } from '../../utils/generateJWT';
import setTokensCookie from '../../utils/setTokensCookie';

type User = {
	email: string;
	code:string;
}

type Payload = {
    userId: number; // User ID
    email: string; // User email
    role: string; // User role
}
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
	const prisma = new PrismaClient();
	const { email, code }: User = req.body;

	const EmailLower = email.toLowerCase();
	console.log(email, code)
	// ✅ 1. Check if the fields are complete
	if (!EmailLower || !code) {
		throw new AppError('Complete the fields', 400);
	}

	const verCode_and_expiresAt = await prisma.user.findUnique({
		where: {
			email: EmailLower,
		},
	});

	// ✅ 3. Check if the email exists
	if (!verCode_and_expiresAt) {
		throw new AppError('Email not found', 404);
	}

	const {userId, role, verificationCode, verificationCodeExpiresAt } = verCode_and_expiresAt;

	// ✅ 4. Check if the verification code has expired
	if (!verificationCodeExpiresAt || new Date(verificationCodeExpiresAt) < new Date()) {
		throw new AppError('Verification code expired, please try again', 400);
	}
	
	// ✅ 5. Check if the verification code is correct
	if (verificationCode !== code) {
		throw new AppError('Wrong verification code', 400);
	}

	const updateUser = await prisma.user.update({
		where: {
			email: EmailLower,
		},
		data: {
			isVerified: true,
			emailVerified: true,
			verificationCode: null,
			verificationCodeExpiresAt: null,
		},
	});

	// ✅ 10. Generate JWT tokens with user ID
	const userPayload: Payload = {userId, email: EmailLower, role};
	const accessToken = generateAccessToken(userPayload);
	const refreshToken = generateRefreshToken(userId);

	const createToken = await prisma.userSession.create({
		data: {
			userId: userId,
			refreshToken: refreshToken,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
			isValid: true,
		}
		});
	
	setTokensCookie(res, accessToken, refreshToken);

	res.status(200).json({
		status: 'success',
		message: 'Email verified successfully',
		data: {
			user: {
				id: userId,
				email: EmailLower,
				role,
			},
			accessToken,
			refreshToken,
		},
	});

}
