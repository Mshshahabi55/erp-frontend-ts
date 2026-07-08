import { createJsonServerResource } from "@/shared/api";
import type { WithRawId } from "@/shared/types";
import {
  Sale,
  CreateSaleDto,
  UpdateSaleDto,
  SaleQueryParams,
} from "../types/sale.types";

export type { Sale, CreateSaleDto, UpdateSaleDto, SaleQueryParams };

// json-server may return numeric fields as strings depending on the driver
type RawSale = Omit<WithRawId<Sale>, 'totalAmount'> & {
  totalAmount: string | number;
};

const normalizeSale = (raw: RawSale): Sale => ({
  ...raw,
  id: String(raw.id),
  totalAmount: Number(raw.totalAmount),
});

export const saleService = createJsonServerResource<
  Sale,
  RawSale,
  CreateSaleDto,
  UpdateSaleDto,
  SaleQueryParams
>({
  resourcePath: "/sales",
  normalize: normalizeSale,
  searchFields: ["invoiceNumber"],
  buildFilters: (params) => {
    const filters: Record<string, unknown> = {};

    if (params?.customerId) {
      filters.customerId = params.customerId;
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
