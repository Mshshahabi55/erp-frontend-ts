import apiClient from './apiClient';
import type { JsonServerPagedResponse, PagedResponse } from '@/shared/types';

export interface JsonServerListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface JsonServerResourceConfig<Domain, Raw, ListParams extends JsonServerListParams> {
  /** e.g. "/customers" */
  resourcePath: string;
  /** Maps a raw json-server row (numeric/string id, unnormalized fields) to the domain shape. */
  normalize: (raw: Raw) => Domain;
  /** Fields searched with a case-insensitive OR-contains match when `params.search` is set. */
  searchFields?: string[];
  /** Extra exact-match filters derived from list params (e.g. `category`). */
  buildFilters?: (params?: ListParams) => Record<string, unknown>;
}

export interface JsonServerResource<Domain, CreateDto, UpdateDto, ListParams extends JsonServerListParams> {
  getAll: (params?: ListParams) => Promise<PagedResponse<Domain>>;
  getById: (id: string) => Promise<Domain>;
  create: (data: CreateDto) => Promise<Domain>;
  update: (id: string, data: UpdateDto) => Promise<Domain>;
  delete: (id: string) => Promise<void>;
}

/**
 * Builds a strongly-typed CRUD client for a json-server resource, handling this
 * backend's pagination/search query conventions and raw-id normalization once
 * so individual feature services only need to declare their shape and mapping.
 */
export function createJsonServerResource<
  Domain extends { id: string },
  Raw,
  CreateDto,
  UpdateDto,
  ListParams extends JsonServerListParams = JsonServerListParams
>(config: JsonServerResourceConfig<Domain, Raw, ListParams>): JsonServerResource<Domain, CreateDto, UpdateDto, ListParams> {
  const { resourcePath, normalize, searchFields, buildFilters } = config;

  return {
    async getAll(params) {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 10;
      const queryParams: Record<string, unknown> = { _page: page, _per_page: limit };

      const searchTerm = params?.search?.trim();
      if (searchTerm && searchFields?.length) {
        queryParams._where = JSON.stringify({
          or: searchFields.map((field) => ({ [field]: { contains: searchTerm } })),
        });
      }

      if (buildFilters) {
        Object.assign(queryParams, buildFilters(params));
      }

      const response = await apiClient.get<JsonServerPagedResponse<Raw>>(resourcePath, {
        params: queryParams,
      });

      return {
        data: response.data.data.map(normalize),
        total: response.data.items,
        page,
        limit,
        totalPages: response.data.pages,
      };
    },

    async getById(id) {
      const response = await apiClient.get<Raw>(`${resourcePath}/${id}`);
      return normalize(response.data);
    },

    async create(data) {
      const response = await apiClient.post<Raw>(resourcePath, {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return normalize(response.data);
    },

    async update(id, data) {
      // PATCH (not PUT) - callers pass partial UpdateDto objects, and PUT
      // would replace the whole record, silently wiping any field not
      // included (e.g. createdAt, or fields owned by a separate flow like
      // an order's status).
      const response = await apiClient.patch<Raw>(`${resourcePath}/${id}`, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      return normalize(response.data);
    },

    async delete(id) {
      await apiClient.delete(`${resourcePath}/${id}`);
    },
  };
}
