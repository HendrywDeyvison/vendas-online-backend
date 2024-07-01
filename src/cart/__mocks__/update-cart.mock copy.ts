import { UpdateCartDTO } from './../dtos/update-cart.dto';
import { productMock } from '../../product/__mocks__/product.mock';

export const updateCartMock: UpdateCartDTO = {
  productId: productMock.id,
  amount: 1,
};
