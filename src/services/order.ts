import { prisma } from "../connections/prisma";
import { CreateOrderModel } from "../models/order";

export async function createOrder(model: CreateOrderModel) {
  let order: any;
  let product: any;

  await prisma.$transaction(async (tx) => {
    order = await tx.order.create({
      data: model,
    });

    product = await tx.product.update({
      where: { id: model.productId },
      data: { qty: { decrement: model.qty } },
    });
  });

  return { order, product };
}
