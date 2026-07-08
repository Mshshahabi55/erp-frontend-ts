export interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// json-server returns raw rows with an id that may be numeric before normalization to string
export type WithRawId<T> = Omit<T, 'id'> & { id: string | number };

export interface JsonServerPagedResponse<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}
