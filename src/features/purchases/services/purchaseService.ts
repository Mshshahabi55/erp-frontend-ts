import { createJsonServerResource } from "@/shared/api";
import type { WithRawId } from "@/shared/types";
import {
  Purchase,
  CreatePurchaseDto,
  UpdatePurchaseDto,
  PurchaseQueryParams,
} from "../types/purchase.types";

export type { Purchase, CreatePurchaseDto, UpdatePurchaseDto, PurchaseQueryParams };

// json-server may return numeric fields as strings depending on the driver
type RawPurchase = Omit<WithRawId<Purchase>, 'totalAmount'> & {
  totalAmount: string | number;
};

const normalizePurchase = (raw: RawPurchase): Purchase => ({
  ...raw,
  id: String(raw.id),
  totalAmount: Number(raw.totalAmount),
});

export const purchaseService = createJsonServerResource<
  Purchase,
  RawPurchase,
  CreatePurchaseDto,
  UpdatePurchaseDto,
  PurchaseQueryParams
>({
  resourcePath: "/purchases",
  normalize: normalizePurchase,
  searchFields: ["purchaseNumber"],
  buildFilters: (params) => {
    const filters: Record<string, unknown> = {};

    if (params?.supplierId) {
      filters.supplierId = params.supplierId;
    }

    if (params?.status) {
      filters.status = params.status;
    }

    if (params?.sortBy) {
      filters._sort = params.sortDirection === "desc" ? `-${params.sortBy}` : params.sortBy;
    }

    return filters;
  },
});
