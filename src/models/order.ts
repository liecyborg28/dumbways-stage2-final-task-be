export class CreateOrderModel {
  userId: number;
  productId: number;
  qty: number;
}

export class GetOrdersModel {
  sortBy?: string;
  order?: string;
  pageIndex?: number;
  pageSize?: number;
}

export class GetUserOrderModel {
  id: number;
}
