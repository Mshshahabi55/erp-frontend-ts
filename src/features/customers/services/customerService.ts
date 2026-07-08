import { createJsonServerResource } from "@/shared/api";
import type { WithRawId } from "@/shared/types";
import {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryParams,
} from "../types/customer.types";

export type { Customer, CreateCustomerDto, UpdateCustomerDto, CustomerQueryParams };

const normalizeCustomer = (raw: WithRawId<Customer>): Customer => ({
  ...raw,
  id: String(raw.id),
});

export const customerService = createJsonServerResource<
  Customer,
  WithRawId<Customer>,
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryParams
>({
  resourcePath: "/customers",
  normalize: normalizeCustomer,
  searchFields: ["name", "email", "company"],
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
