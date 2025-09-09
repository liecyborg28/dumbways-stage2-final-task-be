import { NextFunction, Request, Response } from "express";
import { prisma } from "../connections/prisma";
import { verifyToken } from "../utils/jwt";
import {
  createProductSchema,
  deleteProductSchema,
  restoreProductSchema,
  updateProductSchema,
} from "../validations/product";
import {
  CreateProductModel,
  DeleteProductModel,
  RestoreProductModel,
  UpdateProductModel,
} from "../models/product";
import {
  createProduct,
  deleteProduct,
  restoreProduct,
  updateProduct,
} from "../services/product";

export const handleGetProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = verifyToken(token);
    (req as any).user = decoded as any;

    const { sortBy, order, minPrice, maxPrice, pageSize, pageIndex } =
      req.query;

    const query: any = {
      where: {},
    };

    // filter minPrice
    if (minPrice) {
      query.where.price = { gte: parseFloat(minPrice as string) };
    }

    // filter maxPrice
    if (maxPrice) {
      query.where.price = {
        ...(query.where.price || {}),
        lte: parseFloat(maxPrice as string),
      };
    }

    // default filter soft delete
    query.where.deletedAt = null;

    // sorting
    const validSortFields = [
      "id",
      "name",
      "category",
      "price",
      "qty",
      "createdAt",
      "deletedAt",
    ];
    if (sortBy && validSortFields.includes(sortBy as string)) {
      query.orderBy = {
        [sortBy as string]: order === "asc" ? "asc" : "desc",
      };
    } else {
      query.orderBy = { createdAt: "desc" };
    }

    // pagination
    if (pageIndex && pageSize) {
      const page = Number(pageIndex);
      const size = Number(pageSize);
      query.skip = (page - 1) * size;
      query.take = size;
    } else if (pageSize) {
      query.take = Number(pageSize);
    }

    try {
      const products = await prisma.product.findMany(query);

      res.status(200).json({
        code: 200,
        status: "success",
        message: "Get products successfully!",
        data: products,
      });
    } catch (error) {
      throw {
        status: 500,
        message: error.message,
      };
    }
  } catch (error) {
    next(error);
  }
};

export const handleCreateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = createProductSchema.validate(req.body);

    if (error) {
      throw { status: 400, message: error.message };
    }

    if (!req.file) {
      throw { status: 400, message: "No file uploaded" };
    }

    const image = req.file?.filename;

    const payload: CreateProductModel = {
      ...req.body,
      price: parseFloat(req.body.price),
      qty: parseFloat(req.body.qty),
      image,
    };

    const user = await createProduct(payload);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Create product succesfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = updateProductSchema.validate(req.body);

    if (error) {
      throw { status: 400, message: error.message };
    }

    const payload: UpdateProductModel = { ...req.body };

    const user = await updateProduct(payload);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Update product successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = deleteProductSchema.validate(req.params);

    if (error) {
      throw { status: 400, message: error.message };
    }

    const { id } = req.params;

    const payload: DeleteProductModel = { id: parseInt(id) };

    const user = await deleteProduct(payload);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Delete product succesfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const handleRestoreProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("testttt", req.params);
    const { error } = restoreProductSchema.validate(req.params);

    if (error) {
      throw { status: 400, message: error.message };
    }

    const { id } = req.params;

    const payload: RestoreProductModel = { id: parseInt(id) };

    const user = await restoreProduct(payload);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Restore product succesfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const handleUploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
    }

    const image = req.file?.filename;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        image,
      },
    });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Update product image successfully!",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
