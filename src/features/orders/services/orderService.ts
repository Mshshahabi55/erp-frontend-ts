import { createJsonServerResource } from "@/shared/api";
import type { WithRawId } from "@/shared/types";
import {
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  OrderQueryParams,
} from "../types/order.types";

export type { Order, CreateOrderDto, UpdateOrderDto, OrderQueryParams };

const normalizeOrder = (raw: WithRawId<Order>): Order => ({
  ...raw,
  id: String(raw.id),
});

export const orderService = createJsonServerResource<
  Order,
  WithRawId<Order>,
  CreateOrderDto,
  UpdateOrderDto,
  OrderQueryParams
>({
  resourcePath: "/orders",
  normalize: normalizeOrder,
  searchFields: ["orderNumber"],
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
