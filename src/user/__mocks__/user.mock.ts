import { UserEntity } from '../../user/entities/user.entity';
import { UserType } from '../enum/user-type.enum';

export const UserEntityMock: UserEntity = {
  cpf: '12312312312',
  createdAt: new Date(),
  email: 'hendryw@gmail.com',
  id: 12345,
  name: 'nameMock',
  password: '$2b$10$BhaMKrzUdPJFaHLcdvls7.lFMHojH9/sG/jwrp.Is0YXIlpBe4gI.',
  phone: '12345678',
  typeUser: UserType.User,
  updatedAt: new Date(),
  addresses: [],
  orders: [],
};
