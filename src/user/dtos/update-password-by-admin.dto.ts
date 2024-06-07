import { IsNumber, IsString } from 'class-validator';

export class UpdatePasswordByAdminDTO {
  @IsNumber()
  userId: number;

  @IsString()
  newPassword: string;
}
