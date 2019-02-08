import {Entity, model, property} from '@loopback/repository';

@model()
export class Customers extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id_customer: number;

  @property({
    type: 'string',
    required: true,
  })
  customer_name: string;


  constructor(data?: Partial<Customers>) {
    super(data);
  }
}
