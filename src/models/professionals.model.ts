import {Entity, model, property} from '@loopback/repository';

@model()
export class Professionals extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id_pro: number;

  @property({
    type: 'string',
    required: true,
  })
  pro_name: string;


  constructor(data?: Partial<Professionals>) {
    super(data);
  }
}
