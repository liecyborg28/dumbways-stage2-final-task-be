import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../connections/prisma";
import { transferPointsSchema } from "../validations/user";

export async function handleUploadProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      throw { status: 400, message: "No file uploaded" };
    }

    const image = req.file?.filename;

    const token = req.headers.authorization?.split(" ")[1];

    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: { image },
    });

    res.status(201).json({ message: "User profile picture updated", user });
  } catch (error) {
    next(error);
  }
}

export const handleTransferPoints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const { error } = transferPointsSchema.validate(req.body);

    if (error) {
      throw { status: 400, message: error.message };
    }

    const { amount, receiverId } = req.body;

    const senderId = decoded.id;

    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId } }),
      prisma.user.findUnique({ where: { id: receiverId } }),
    ]);

    if (!sender)
      throw {
        status: 404,
        message: "Sender not found",
      };

    if (!receiver)
      throw {
        status: 404,
        message: "Receiver not found",
      };

    const convertAmount = amount / 1000;

    if (sender.points * 1000 < amount)
      res.status(400).json({ code: 400, message: "Insufficient points" });

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: senderId },
        data: { points: { decrement: convertAmount } },
      });

      await tx.user.update({
        where: { id: receiverId },
        data: { points: { increment: convertAmount } },
      });
    });

    const [updateSender, updateReceiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId } }),
      prisma.user.findUnique({ where: { id: receiverId } }),
    ]);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Transfer points successfully!",
      data: { sender: updateSender, receiver: updateReceiver },
    });
  } catch (error) {
    next(error);
  }
};
