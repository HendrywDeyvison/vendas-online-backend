import { CityService } from './../city/city.service';
import { ReturnExternalCepDto } from './dtos/return-external-cep.dto';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';

@Injectable()
export class CorreiosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) {}

  URL_CEP = process.env.URL_CEP_CORREIOS; //this.configService.get<string>('URL_CEP_CORREIOS');

  async findAddressByCep(cep: string): Promise<ReturnExternalCepDto> {
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

    const city = await this.cityService.findCityByName(returnCep.localidade, returnCep.uf);

    console.log('CITY: ', city);
    return returnCep;
  }
}
