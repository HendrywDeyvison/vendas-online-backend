import { ReturnDeliveryPriceDto } from './dtos/return-delivery-price.dto';
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

  @Get('/delivery-price/:cep')
  async findPriceByCep(@Param('cep') cep: string): Promise<ReturnDeliveryPriceDto> {
    return this.correioService.findDeliveryPrice(cep);
  }

  @Get('/delivery-price/:cep/order/:orderId')
  async findDeliveryPriceByOrderId(
    @Param('cep') cep: string,
    @Param('orderId') orderId?: number,
  ): Promise<ReturnDeliveryPriceDto> {
    return this.correioService.findDeliveryPriceByOrderId(cep, orderId);
  }
}
