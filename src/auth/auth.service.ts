import { UserService } from '../user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { LoginDto } from './dtos/login.dto';
import { ReturnLoginDto } from './dtos/returnLogin.dto';
import { JwtService } from '@nestjs/jwt';
import { ReturnUserDto } from '../user/dtos/returnUser.dto';
import { LoginPayloadDto } from './dtos/loginPayload.dto';
import { validatePassword } from '../utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLoginDto> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDto.email)
      .catch(() => undefined);

    const isMatch = user && (await validatePassword(loginDto.password, user.password));

    if (!isMatch) {
      throw new NotFoundException('Email or passwors invalid');
    }

    return {
      accessToken: await this.jwtService.signAsync({ ...new LoginPayloadDto(user) }),
      user: new ReturnUserDto(user),
    };
  }
}
