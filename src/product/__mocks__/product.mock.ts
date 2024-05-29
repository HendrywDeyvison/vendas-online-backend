import { categoryMock } from '../../category/__mocks__/category.mock';
import { ProductEntity } from '../entities/product.entity';

export const productMock: ProductEntity = {
  id: 1,
  name: 'Product mock',
  categoryId: categoryMock.id,
  price: 123.12,
  image: 'http://image.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};
