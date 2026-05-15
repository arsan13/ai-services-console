export interface Page<T> {
  totalPages: number;
  totalElements: number;
  size: number;
  content: T[];
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: PageableInfo;
  empty: boolean;
}

export interface SortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageableInfo {
  offset: number;
  sort: SortInfo;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}