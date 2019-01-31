import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {param, get} from '@loopback/rest';

import axios from 'axios';

export class MyController {
  constructor() {}

  @get('/test/{c}/{p}/{s}', {
    responses: {
      '200': {
        description: 'Customers/Professionals/Services',
        content: {'application/json': {schema: {}}},
      },
    },
  })
  async getAllData(
    @param.path.number('c') idCustomer: number,
    @param.path.number('p') idPro: number,
    @param.path.number('s') idService: number,
  ) {
    const URL = 'http://192.168.1.224:3000';
    const customerName = await axios.get(`${URL}/customers/${idCustomer}`);
    const proName = await axios.get(`${URL}/pro/${idPro}`);
    const serviceName = await axios.get(`${URL}/services/${idService}`);

    return {
      customer_name: customerName.data.customer_name,
      pro_name: proName.data.pro_name,
      service_name: serviceName.data.service_name,
    };
  }
}
