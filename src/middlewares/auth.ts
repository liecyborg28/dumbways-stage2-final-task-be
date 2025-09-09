import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw { status: 401, message: "Unauthorized" };
    }

    const decoded = verifyToken(token);
    (req as any).user = decoded as any;
    next();
  } catch (error) {
    throw { status: 401, message: "Invalid token" };
  }
}

export function authorize(...roles: ("user" | "admin")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw {
          status: 401,
          message: "No token provided or invalid format",
        };
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token) as any;

      // simpan payload user di req.user biar bisa dipakai di route lain
      (req as any).user = decoded;

      if (!roles.includes(decoded.role)) {
        throw {
          status: 403,
          message: "You are not allowed to access this resource with your role",
        };
      }

      next();
    } catch (err: any) {
      next(err);
    }
  };
}
