import { UserEntityMock } from './../../user/__mocks__/user.mock';
import { CartEntity } from '../entities/cart.entity';

export const cartMock: CartEntity = {
  id: 1,
  userId: UserEntityMock.id,
  active: true,
  updatedAt: new Date(),
  createdAt: new Date(),
};
