import { createJsonServerResource } from "@/shared/api";
import type { WithRawId } from "@/shared/types";
import {
  StockMovement,
  CreateStockMovementDto,
  StockMovementQueryParams,
} from "../types/stockMovement.types";

export type { StockMovement, CreateStockMovementDto, StockMovementQueryParams };

const normalizeStockMovement = (raw: WithRawId<StockMovement>): StockMovement => ({
  ...raw,
  id: String(raw.id),
});

// Movements are an append-only ledger - the resource's update/delete methods
// exist for type-completeness but the feature only ever lists and creates.
export const stockMovementService = createJsonServerResource<
  StockMovement,
  WithRawId<StockMovement>,
  CreateStockMovementDto,
  Partial<CreateStockMovementDto>,
  StockMovementQueryParams
>({
  resourcePath: "/stockMovements",
  normalize: normalizeStockMovement,
  searchFields: ["reason", "performedBy"],
  buildFilters: (params) => {
    const filters: Record<string, unknown> = {};

    if (params?.productId) {
      filters.productId = params.productId;
    }

    if (params?.type) {
      filters.type = params.type;
    }

    if (params?.sortBy) {
      filters._sort = params.sortDirection === "desc" ? `-${params.sortBy}` : params.sortBy;
    }

    return filters;
  },
});
