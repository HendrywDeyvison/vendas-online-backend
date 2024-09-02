export class PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;

  constructor(itemsPerPage: number, totalItems: number, currentPage: number, totalPages: number) {
    this.itemsPerPage = itemsPerPage;
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
  }
}

export class PaginationDto<T> {
  meta: PaginationMeta;
  data: T;

  constructor(pagenationMeta: PaginationMeta, data: T) {
    this.meta = pagenationMeta;
    this.data = data;
  }
}
