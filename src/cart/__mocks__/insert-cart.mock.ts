import { productMock } from './../../product/__mocks__/product.mock';
import { InsertCartDTO } from '../dtos/insert-cart.dto';

export const InsertCartMock: InsertCartDTO = {
  productId: productMock.id,
  amount: 1,
};
