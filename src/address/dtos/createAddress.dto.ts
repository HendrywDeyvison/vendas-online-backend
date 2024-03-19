import { Optional } from '@nestjs/common';
import { IsInt, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @Optional()
  complement: string;

  @IsInt()
  numberAddress: number;

  @IsString()
  cep: string;

  @IsInt()
  cityId: number;
}
