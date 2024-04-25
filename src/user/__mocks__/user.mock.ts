import { UserEntity } from '../../user/entities/user.entity';
import { UserType } from '../enum/user-type.enum';

export const UserEntityMock: UserEntity = {
  cpf: '12312312312',
  createdAt: new Date(),
  email: 'email@email.com',
  id: 12345,
  name: 'nameMock',
  password: '123456',
  phone: '12345678',
  typeUser: UserType.User,
  updatedAt: new Date(),
  addresses: [],
};
