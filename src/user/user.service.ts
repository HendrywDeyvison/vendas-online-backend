import { UpdatePasswordDTO } from './dtos/uptate-password.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './enum/user-type.enum';
import { createPasswordHashed, validatePassword } from '../utils/password';
import { UpdatePasswordByAdminDTO } from './dtos/update-password-by-admin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto, userType?: number): Promise<UserEntity> {
    const user = await this.findUserByEmail(createUserDto.email).catch(() => undefined);

    if (user) {
      throw new BadRequestException(`Email already existing in the system`);
    }

    const hashedPassword = await createPasswordHashed(createUserDto.password);

    return this.userRepository.save({
      ...createUserDto,
      typeUser: userType || UserType.User,
      password: hashedPassword,
    });
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUserById(userId: number): Promise<UserEntity | any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`UserId: ${userId} not found`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException(`Email: ${email} not found`);
    }

    return user;
  }

  async updatePasswordUser(
    updatePasswordDTO: UpdatePasswordDTO,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    const hashedPassword = await createPasswordHashed(updatePasswordDTO.newPassword);

    const isMatch = await validatePassword(updatePasswordDTO.oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid old password');
    }

    return this.userRepository.save({
      ...user,
      password: hashedPassword,
    });
  }

  async updatePasswordUserByAdmin(
    updatePasswordByAdminDTO: UpdatePasswordByAdminDTO,
  ): Promise<UserEntity> {
    const user = await this.findUserById(updatePasswordByAdminDTO.userId);

    const hashedPassword = await createPasswordHashed(updatePasswordByAdminDTO.newPassword);

    return this.userRepository.save({
      ...user,
      password: hashedPassword,
    });
  }
}
