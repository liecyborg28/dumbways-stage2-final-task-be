import { Request, Response, NextFunction } from "express";
import { CreateOrderModel } from "../models/order";
import { verifyToken } from "../utils/jwt";
import { createOrderSchema } from "../validations/order";
import { createOrder } from "../services/order";
import { prisma } from "../connections/prisma";

export const handleCreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = createOrderSchema.validate(req.body);

    if (error) {
      throw { status: 400, message: error.message };
    }

    const token = req.headers.authorization?.split(" ")[1];

    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const payload: CreateOrderModel = {
      ...req.body,
      userId: decoded.id,
    };

    const order = await createOrder(payload);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Create order successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const usersWithOrders = await prisma.user.findMany({
      where: { deletedAt: null },
      include: {
        orders: {
          where: { deletedAt: null },
          include: {
            product: true, // biar product ikut kebawa
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: usersWithOrders,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetOrdersByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const { sortBy, order, pageIndex, pageSize } = req.query;

    const query: any = {
      where: {
        userId: decoded.id,
        deletedAt: null,
      },
      include: {
        product: true, // 🔑 ini biar data product ikut ditampilkan
      },
    };

    // --- Sorting ---
    const validOrderFields = ["id", "qty", "createdAt", "deletedAt"];
    const validProductFields = ["name", "category", "price"];

    if (sortBy) {
      if (validOrderFields.includes(sortBy as string)) {
        // sorting di level Order
        query.orderBy = {
          [sortBy as string]: order === "asc" ? "asc" : "desc",
        };
      } else if (validProductFields.includes(sortBy as string)) {
        // sorting di level Product
        query.orderBy = {
          product: {
            [sortBy as string]: order === "asc" ? "asc" : "desc",
          },
        };
      } else {
        query.orderBy = { createdAt: "desc" };
      }
    } else {
      query.orderBy = { createdAt: "desc" };
    }

    // --- Pagination ---
    if (pageIndex && pageSize) {
      const page = Number(pageIndex);
      const size = Number(pageSize);
      query.skip = (page - 1) * size;
      query.take = size;
    } else if (pageSize) {
      query.take = Number(pageSize);
    }

    // --- Query ke DB ---
    const orders = await prisma.order.findMany(query);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};
