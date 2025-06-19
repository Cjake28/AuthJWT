import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import AppError from "../../utils/AppError";

import { generateAccessToken, generateRefreshToken } from '../../utils/generateJWT';
import setTokensCookie from '../../utils/setTokensCookie';

type SigninReqBody = {
  email: string;
  password: string;
};

type Payload = {
	userId: number; // User ID
	email: string; // User email
	role: string; // User role
}

const signin = async(
	req: Request, 
	res: Response, 
	next: NextFunction
	): Promise<void> => {

	const prisma = new PrismaClient();
  const { email, password }: SigninReqBody = req.body;

	// 1. Validate
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

	const EmailLower = email.toLowerCase();

	// 2. Lookup user
  const user = await prisma.user.findUnique({
    where: { email: EmailLower },
  });
	
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

	const { userId, role, isVerified, emailVerified, password: hashedPassword } = user;

	// 3. Check verification status
  if (!emailVerified || !isVerified) {
    throw new AppError("Email not verified or account suspended", 403);
  }

	// 4. Compare password
  const passwordMatches = await bcrypt.compare(password, hashedPassword);
  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

	// 5. Generate tokens
	const userPayload: Payload = {userId, email: EmailLower, role};
	const accessToken = generateAccessToken(userPayload);
	const refreshToken = generateRefreshToken(userId);

	// 6. Set cookies
  setTokensCookie(res, accessToken, refreshToken);

	// 7. Send response
  res.status(200).json({
    success: true,
    data: {
      user: {
        userId,
        email: EmailLower,
        role,
      }
    }
  });

}

export default signin;