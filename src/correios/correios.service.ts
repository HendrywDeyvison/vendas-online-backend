import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class CorreiosService {
  constructor(private readonly httpService: HttpService) {}

  URL_CEP = process.env.URL_CEP_CORREIOS; //this.configService.get<string>('URL_CEP_CORREIOS');

  async findAddressByCep(cep: string): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef
      .get(this.URL_CEP.replace('{CEP}', cep))
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
  }
}
