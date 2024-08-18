import { ReturnCepDto } from './dtos/return-cep.dto';
import { CorreiosService } from './correios.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('correios')
export class CorreiosController {
  constructor(private readonly correioService: CorreiosService) {}

  @Get('/:cep')
  async findAddressByCep(@Param('cep') cep: string): Promise<ReturnCepDto> {
    return await this.correioService.findAddressByCep(cep);
  }
}
