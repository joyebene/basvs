import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

console.log(ACCESS_SECRET, REFRESH_SECRET);
console.log("joy");



export interface TokenPayload {
  id: string;
  email?: string;
}

/* Access Token */
export const signAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
};

/* Refresh Token */
export const signRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

/* Verify Tokens */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
};
