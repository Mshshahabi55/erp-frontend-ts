import { createJsonServerResource } from "@/shared/api";
import type { WithRawId } from "@/shared/types";
import {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierQueryParams,
} from "../types/supplier.types";

export type { Supplier, CreateSupplierDto, UpdateSupplierDto, SupplierQueryParams };

const normalizeSupplier = (raw: WithRawId<Supplier>): Supplier => ({
  ...raw,
  id: String(raw.id),
});

export const supplierService = createJsonServerResource<
  Supplier,
  WithRawId<Supplier>,
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierQueryParams
>({
  resourcePath: "/suppliers",
  normalize: normalizeSupplier,
  searchFields: ["name", "contactName", "email"],
  buildFilters: (params) => {
    const filters: Record<string, unknown> = {};

    if (params?.isActive !== undefined) {
      filters.isActive = params.isActive;
    }

    if (params?.sortBy) {
      filters._sort = params.sortDirection === "desc" ? `-${params.sortBy}` : params.sortBy;
    }

    return filters;
  },
});
