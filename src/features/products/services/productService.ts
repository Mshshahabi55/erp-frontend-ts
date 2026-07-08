import { createJsonServerResource } from "@/shared/api";
import type { WithRawId } from "@/shared/types";
import { LOW_STOCK_THRESHOLD } from "@/shared/constants";
import { Product, CreateProductDto, UpdateProductDto, ProductQueryParams } from "../types/product.types";

export type { Product, CreateProductDto, UpdateProductDto, ProductQueryParams };

// json-server may return numeric fields as strings depending on the driver
type RawProduct = Omit<WithRawId<Product>, 'price' | 'stock'> & {
  price: string | number;
  stock: string | number;
};

const normalizeProduct = (raw: RawProduct): Product => ({
  ...raw,
  id: String(raw.id),
  price: Number(raw.price),
  stock: Number(raw.stock),
});

const productResource = createJsonServerResource<
  Product,
  RawProduct,
  CreateProductDto,
  UpdateProductDto,
  ProductQueryParams
>({
  resourcePath: "/products",
  normalize: normalizeProduct,
  searchFields: ["name", "sku"],
  buildFilters: (params) => {
    const filters: Record<string, unknown> = {};

    if (params?.category) {
      filters.category = params.category;
    }

    if (params?.stockStatus === "out-of-stock") {
      filters["stock:eq"] = 0;
    } else if (params?.stockStatus === "low-stock") {
      filters["stock:gt"] = 0;
      filters["stock:lte"] = LOW_STOCK_THRESHOLD;
    } else if (params?.stockStatus === "in-stock") {
      filters["stock:gt"] = LOW_STOCK_THRESHOLD;
    }

    if (params?.sortBy) {
      filters._sort = params.sortDirection === "desc" ? `-${params.sortBy}` : params.sortBy;
    }

    return filters;
  },
});

export const productService = productResource;
