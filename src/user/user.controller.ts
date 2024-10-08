import { ReturnUserDto } from './dtos/returnUser.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';
import { UpdatePasswordDTO } from './dtos/uptate-password.dto';
import { UserId } from '../decorators/user-id-decorator';
import { UpdatePasswordByAdminDTO } from './dtos/update-password-by-admin.dto';

@Roles(UserType.User, UserType.Admin, UserType.Root)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserType.Root)
  @UsePipes(ValidationPipe)
  @Post('/byAdmin')
  async createAdmin(@Body() dataUser: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(dataUser, UserType.Admin);
  }

  @Roles(UserType.User, UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() dataUser: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(dataUser);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/all')
  async getAllUsers(): Promise<ReturnUserDto[]> {
    return (await this.userService.getAllUsers()).map(
      (userEntity) => new ReturnUserDto(userEntity),
    );
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(await this.userService.getUserByIdUsingRelations(userId));
  }

  @Roles(UserType.User, UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Patch()
  async updatePasswordUser(
    @Body() updatePassword: UpdatePasswordDTO,
    @UserId() userId: number,
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(await this.userService.updatePasswordUser(updatePassword, userId));
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Patch('/byAdmin')
  async updatePasswordUserByAdmin(
    @Body() updatePasswordByAdminDTO: UpdatePasswordByAdminDTO,
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.updatePasswordUserByAdmin(updatePasswordByAdminDTO),
    );
  }

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Get('')
  async getInfoUser(@UserId() userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(await this.userService.getUserByIdUsingRelations(userId));
  }
}
