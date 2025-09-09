import {
  CreateProductModel,
  UpdateProductModel,
  DeleteProductModel,
  RestoreProductModel,
} from "../models/product";
import { prisma } from "../connections/prisma";

export async function createProduct(model: CreateProductModel) {
  const product = await prisma.product.create({
    data: model,
  });

  return product;
}

export async function updateProduct(model: UpdateProductModel) {
  const product = await prisma.product.update({
    where: { id: model.id },
    data: model.data as object,
  });

  return product;
}

export async function deleteProduct(model: DeleteProductModel) {
  const product = await prisma.product.update({
    where: { id: model.id },
    data: { deletedAt: new Date() },
  });

  return product;
}

export async function restoreProduct(model: RestoreProductModel) {
  const product = await prisma.product.update({
    where: { id: model.id },
    data: { deletedAt: null },
  });

  return product;
}
