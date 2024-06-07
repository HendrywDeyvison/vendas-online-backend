import { UpdatePasswordDTO } from '../dtos/uptate-password.dto';

export const updatePasswordUserMock: UpdatePasswordDTO = {
  newPassword: '123',
  oldPassword: 'abc',
};

export const updatePasswordUserInvalidMock: UpdatePasswordDTO = {
  newPassword: 'teste',
  oldPassword: 'teste2',
};
