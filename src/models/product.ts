export class CreateProductModel {
  name: string;
  category: string;
  image: string;
  price: number;
  qty: number;
}

export class GetProductsModel {
  sortBy?: string;
  order?: string;
  minPrice?: number;
  maxPrice?: number;
  pageIndex?: number;
  pageSize?: number;
}

export class UpdateProductModel {
  id: number;
  data: ProductDataModel;
}

export class ProductDataModel {
  name?: string;
  category?: string;
  price?: string;
  qty?: string;
}

export class DeleteProductModel {
  id: number;
}
export class RestoreProductModel {
  id: number;
}
