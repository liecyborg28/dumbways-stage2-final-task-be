import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface Payload {
  id: number;
  role: string;
}

export function signToken(payload: Payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1w" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as Payload;
}
