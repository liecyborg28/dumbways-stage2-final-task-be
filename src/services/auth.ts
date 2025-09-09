import bcrypt from "bcrypt";
import { prisma } from "../connections/prisma";
import { signToken } from "../utils/jwt";
import { LoginModel, RegisterModel, ResetModel } from "../models/auth";

export async function register(model: RegisterModel) {
  try {
    const hashed = await bcrypt.hash(model?.password, 10);

    const payload: RegisterModel = {
      ...model,
      password: hashed,
    };

    const user = await prisma.user.create({ data: payload });

    return user;
  } catch (error) {}
}

export async function login(model: LoginModel) {
  const user = await prisma.user.findUnique({ where: { email: model?.email } });

  const isMatch = await bcrypt.compare(model.password, user.password);
  if (!isMatch) throw new Error("Wrong password");

  const token = signToken({ id: user.id, role: user.role });
  return token;
}

export async function reset(model: ResetModel) {
  const hashed = await bcrypt.hash(model.newPassword, 10);

  const user = await prisma.user.update({
    where: { email: model.email },
    data: {
      password: hashed,
    },
  });
  return user;
}
