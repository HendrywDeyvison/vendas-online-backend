import { OrderModule } from './../order/order.module';
import { CityModule } from './../city/city.module';
import { Module } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { CorreiosController } from './correios.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CityModule,
    OrderModule,
  ],
  providers: [CorreiosService],
  controllers: [CorreiosController],
})
export class CorreiosModule {}
