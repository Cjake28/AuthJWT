import jwt from "jsonwebtoken";
import "dotenv/config";

type Payload = {
    userId: number; // User ID
    email: string; // User email
    role: string; // User role
}

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export const generateAccessToken = (payload: Payload)  => {
  return jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: "1h" } // Access token expires in 1 hour
  );
};

export const generateRefreshToken = (userId: number) => {
    return jwt.sign(
      {
        sub: userId,  // User ID
        type: "refresh"
      },
      REFRESH_SECRET,
      { expiresIn: "7d" } // Refresh token expires in 7 days
    );
  };

