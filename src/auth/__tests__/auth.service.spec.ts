import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { UserEntityMock } from '../../user/__mocks__/user.mock';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { jwtMock } from '../__mocks__/jwt.mock';
import { LoginUserMock } from '../__mocks__/login-user.mock';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(UserEntityMock),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: () => jwtMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user if password and email valid', async () => {
    const user = await service.login(LoginUserMock);

    expect(user).toEqual({
      accessToken: jwtMock,
      user: new ReturnUserDto(UserEntityMock),
    });
  });

  it('should retur if password or email invalid', async () => {
    expect(service.login(LoginUserMock)).rejects.toThrow();
  });

  it('should return if email not exist', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);

    expect(service.login(LoginUserMock)).rejects.toThrow();
  });

  it('should return error in UserService', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockRejectedValue(new Error());

    expect(service.login(LoginUserMock)).rejects.toThrow();
  });
});
