import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { signToken, verifyToken } from "../utils/jwt";
import { register, login, reset } from "../services/auth";
import { prisma } from "../connections/prisma";
import { loginSchema, registerSchema, resetSchema } from "../validations/auth";
import { LoginModel, RegisterModel, ResetModel } from "../models/auth";

export async function handleRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error } = registerSchema.validate(req.body);

    if (error) {
      throw { status: 400, message: error.message };
    }

    if (!req.file) {
      throw { status: 400, message: "No file uploaded" };
    }

    const image = req.file?.filename;

    const payload: RegisterModel = {
      ...req.body,
      image,
    };

    const user = await register(payload);

    res.status(201).json({
      code: 200,
      status: "success",
      message: "User registered",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error } = loginSchema.validate(req.body);

    if (error) {
      throw { status: 400, message: error.message };
    }

    const { email, password } = req.body;

    const payload: LoginModel = {
      email,
      password,
    };

    const token = await login(payload);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Login successfully",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
}

export async function handleReset(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error } = resetSchema.validate(req.body);

    if (error) {
      throw { status: 400, message: error.message };
    }

    const { email, password, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      throw { status: 401, message: "Wrong email or password" };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    let payload: ResetModel = { email, newPassword };

    const updateUser = await reset(payload);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "User updated",
      data: updateUser,
    });
  } catch (error) {
    next(error);
  }
}
