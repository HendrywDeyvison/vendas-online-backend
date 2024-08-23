import { categoryMock } from '../../category/__mocks__/category.mock';
import { CreateProductDTO } from '../dtos/create-product.dto';

export const createProductMock: CreateProductDTO = {
  categoryId: categoryMock.id,
  name: 'ProductMock',
  price: 123,
  image: 'imageMock',
  width: 16,
  height: 25,
  length: 11,
  weight: 0.3,
};
