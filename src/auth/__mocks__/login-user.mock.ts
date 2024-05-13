import { UserEntityMock } from '../../user/__mocks__/user.mock';
import { LoginDto } from '../dtos/login.dto';

export const LoginUserMock: LoginDto = {
  email: UserEntityMock.email,
  password: 'hendryw123',
};
