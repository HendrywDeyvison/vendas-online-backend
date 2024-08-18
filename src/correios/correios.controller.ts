import { ReturnExternalCepDto } from './dtos/return-external-cep.dto';
import { CorreiosService } from './correios.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('correios')
export class CorreiosController {
  constructor(private readonly correioService: CorreiosService) {}

  @Get('/:cep')
  async findAddressByCep(@Param('cep') cep: string): Promise<ReturnExternalCepDto> {
    return await this.correioService.findAddressByCep(cep);
  }
}
