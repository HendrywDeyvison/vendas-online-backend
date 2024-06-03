import { categoryMock } from '../../category/__mocks__/category.mock';
import { CreateProductDTO } from '../dtos/create-product.dto';

export const createProductMock: CreateProductDTO = {
  categoryId: categoryMock.id,
  name: 'ProductMock',
  price: 123,
  image: 'imageMock',
};
