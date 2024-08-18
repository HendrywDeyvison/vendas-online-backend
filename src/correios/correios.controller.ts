import { CorreiosService } from './correios.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('correios')
export class CorreiosController {
  constructor(private readonly correioService: CorreiosService) {}

  @Get('/:cep')
  async findAddressByCep(@Param('cep') cep: string): Promise<any> {
    return await this.correioService.findAddressByCep(cep);
  }
}
