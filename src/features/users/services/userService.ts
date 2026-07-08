import { createJsonServerResource } from "@/shared/api";
import type { WithRawId, PagedResponse } from "@/shared/types";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserQueryParams,
} from "../types/user.types";

export type { User, CreateUserDto, UpdateUserDto, UserQueryParams };

// Raw rows may still carry a password field from creation - normalize strips
// it so it's structurally impossible for a `password` to leak into the `User`
// read shape anywhere in the app.
type RawUser = WithRawId<User> & { password?: string };

const normalizeUser = (raw: RawUser): User => {
  const { password: _password, ...user } = raw;
  return { ...user, id: String(user.id) };
};

const ROLE_FILTER_FETCH_LIMIT = 100;

const userResource = createJsonServerResource<
  User,
  RawUser,
  CreateUserDto,
  UpdateUserDto,
  UserQueryParams
>({
  resourcePath: "/users",
  normalize: normalizeUser,
  searchFields: ["fullName", "username", "email"],
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

export const userService = {
  ...userResource,

  // json-server can't filter on an array field (`roles`) server-side - verified
  // empirically, `roles:contains=admin` returns nothing even when matches exist.
  // So when a role filter is active, fetch broadly (search/status still applied
  // server-side) and filter + paginate the role dimension here instead.
  async getAll(params?: UserQueryParams): Promise<PagedResponse<User>> {
    if (!params?.role) {
      return userResource.getAll(params);
    }

    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const { data: matching } = await userResource.getAll({ ...params, page: 1, limit: ROLE_FILTER_FETCH_LIMIT });
    const roleFiltered = matching.filter((user) => user.roles.includes(params.role!));

    const start = (page - 1) * limit;
    return {
      data: roleFiltered.slice(start, start + limit),
      total: roleFiltered.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(roleFiltered.length / limit)),
    };
  },
};
