export interface Page<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: T[];
}