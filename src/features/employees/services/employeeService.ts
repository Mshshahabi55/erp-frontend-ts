import { createJsonServerResource } from "@/shared/api";
import type { WithRawId } from "@/shared/types";
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeQueryParams,
} from "../types/employee.types";

export type { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeQueryParams };

const normalizeEmployee = (raw: WithRawId<Employee>): Employee => ({
  ...raw,
  id: String(raw.id),
});

export const employeeService = createJsonServerResource<
  Employee,
  WithRawId<Employee>,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeQueryParams
>({
  resourcePath: "/employees",
  normalize: normalizeEmployee,
  searchFields: ["fullName", "email", "position"],
  buildFilters: (params) => {
    const filters: Record<string, unknown> = {};

    if (params?.department) {
      filters.department = params.department;
    }

    if (params?.isActive !== undefined) {
      filters.isActive = params.isActive;
    }

    if (params?.sortBy) {
      filters._sort = params.sortDirection === "desc" ? `-${params.sortBy}` : params.sortBy;
    }

    return filters;
  },
});
