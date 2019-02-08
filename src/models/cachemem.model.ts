import {Entity, model, property} from '@loopback/repository';

@model()
export class Cachemem extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  value: string;
  /*
  @property({
    type: 'string',
  })
  value?: string;
*/
  constructor(data?: Partial<Cachemem>) {
    super(data);
  }
}
