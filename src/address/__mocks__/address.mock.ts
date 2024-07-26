import { UserEntityMock } from '../../user/__mocks__/user.mock';
import { AddressEntity } from '../entities/address.entity';
import { cityMock } from '../../city/__mocks__/city.mock';

export const addressMock: AddressEntity = {
  id: 1234,
  userId: UserEntityMock.id,
  complement: 'Teste complemento',
  numberAddress: 123,
  cep: '12345678',
  cityId: cityMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  orders: [],
};
