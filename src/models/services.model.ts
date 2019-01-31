import {Entity, model, property} from '@loopback/repository';

@model()
export class Services extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id_service: number;

  @property({
    type: 'string',
    required: true,
  })
  service_name: string;


  constructor(data?: Partial<Services>) {
    super(data);
  }
}
