import { ReturnOrderDTO } from './../order/dtos/return-order.dto';
import { OrderService } from './../order/order.service';
import { SizeProduct } from './dtos/size-product.dto';
import { ReturnCepDto } from './dtos/return-cep.dto';
import { CityService } from './../city/city.service';
import { ReturnExternalCepDto } from './dtos/return-external-cep.dto';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { ReturnDeliveryPriceDto } from './dtos/return-delivery-price.dto';

@Injectable()
export class CorreiosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
    private readonly orderService: OrderService,
  ) {}

  URL_CEP = process.env.URL_CEP_CORREIOS;
  URL_DELIVERY_PRICE = process.env.URL_MELHOR_ENVIO;
  TOKEN_DELIVERY_PRICE = process.env.TOKEN_MELHOR_ENVIO;
  CEP_COMPANY = process.env.CEP_COMPANY;
  CONFIG_AXIOS = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${this.TOKEN_DELIVERY_PRICE}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Aplicação (email para contato técnico)', // Substitua pelo seu email de contato técnico
    },
  };

  async findAddressByCep(cep: string): Promise<ReturnCepDto> {
    const returnCep = await this.httpService.axiosRef
      .get<ReturnExternalCepDto>(this.URL_CEP.replace('{CEP}', cep))
      .then((resp) => {
        const { data } = resp;

        if (data.erro) {
          throw new NotFoundException('CEP not found');
        }

        return data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(`Error  in connection request ${error.message}`);
      });

    const city = await this.cityService
      .findCityByName(returnCep.localidade, returnCep.uf)
      .catch(() => undefined);

    return new ReturnCepDto(returnCep, city?.id, city?.stateId);
  }

  async findDeliveryPrice(
    cepClient: string,
    products?: SizeProduct[],
  ): Promise<ReturnDeliveryPriceDto> {
    const data = {
      from: {
        postal_code: this.CEP_COMPANY,
      },
      to: {
        postal_code: cepClient,
      },
      products,
    };

    console.log('TESTE: ', products);

    return this.httpService.axiosRef
      .post(this.URL_DELIVERY_PRICE, data, this.CONFIG_AXIOS)
      .then((resp) => resp.data.map((price) => new ReturnDeliveryPriceDto(price)))
      .catch((error: AxiosError) => {
        throw new BadRequestException(`Error in request delivery price, Error: ${error.message}`);
      });
  }

  async findDeliveryPriceByOrderId(cep: string, orderId: number): Promise<any> {
    const order: ReturnOrderDTO[] = await this.orderService.findOrdersByUserId(undefined, orderId);

    const products = order[0].ordersProduct.map(
      (order) => new SizeProduct(order.product, order.amount),
    );

    return this.findDeliveryPrice(cep, products);
  }
}
