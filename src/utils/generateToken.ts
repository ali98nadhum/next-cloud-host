import jwt from "jsonwebtoken";
import { JwtPayload } from "@/utils/types";
import { serialize } from "cookie";

// generate token
export function generateJWT(JwtPayload: JwtPayload): string {
  const privateKey = process.env.JWT_SECRET as string;
  const token = jwt.sign(JwtPayload, privateKey, {
    expiresIn: "30d",
  });

  return token;
}

// Set cookie with jwt
export function setCookie(jwtPayload: JwtPayload): string {
  const token = generateJWT(jwtPayload);
  const cookie = serialize("jwtToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 day
  });

  return cookie;
}
