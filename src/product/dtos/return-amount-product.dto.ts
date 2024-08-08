export class ReturnAmountProductDto {
  category_id: number;
  total: number;

  constructor(amountCategory) {
    this.category_id = amountCategory.categoryId;
    this.total = amountCategory.productCount;
  }
}
