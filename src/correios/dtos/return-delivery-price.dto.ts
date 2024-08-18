import { DeliveryPrice } from './reponse-price-correios';
export class ReturnDeliveryPriceDto {
  id: number;
  name: string;
  price: string;
  custom_price: string;
  discount: string;
  currency: string;
  delivery_time: number;
  delivery_range: object;

  constructor(deliveryPrice: DeliveryPrice) {
    this.id = deliveryPrice.id;
    this.name = deliveryPrice.name;
    this.price = deliveryPrice.price;
    this.custom_price = deliveryPrice.custom_price;
    this.discount = deliveryPrice.discount;
    this.currency = deliveryPrice.currency;
    this.delivery_time = deliveryPrice.delivery_time;
    this.delivery_range = deliveryPrice.delivery_range;
  }
}
