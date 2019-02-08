import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Customers} from '../models';
import {CustomersRepository} from '../repositories';
import {CachememRepository} from '../repositories';

export class CustomersController {
  constructor(
    @repository(CustomersRepository)
    public customersRepository: CustomersRepository,
    @repository(CachememRepository)
    public cacheRepository: CachememRepository,
  ) {}

  async insertRedis(k: string, v: string) {
    console.log('Inserindo dados no Redis...');
    this.cacheRepository.set(k, {value: v});
    const _ = this.cacheRepository.get(k);
    if (_) {
      console.log('Dados inseridos com sucesso..');
    }
  }

  @post('/customers', {
    responses: {
      '200': {
        description: 'Customers model instance',
        content: {'application/json': {schema: {'x-ts-type': Customers}}},
      },
    },
  })
  async create(@requestBody() customers: Customers): Promise<Customers> {
    const key = `customers:${customers.id_customer}`;
    this.cacheRepository.set(key, {value: customers.customer_name});
    return await this.customersRepository.create(customers);
  }

  @get('/customers/count', {
    responses: {
      '200': {
        description: 'Customers model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Customers)) where?: Where,
  ): Promise<Count> {
    return await this.customersRepository.count(where);
  }

  @get('/customers', {
    responses: {
      '200': {
        description: 'Array of Customers model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Customers}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Customers))
    filter?: Filter,
  ): Promise<Customers[]> {
    return await this.customersRepository.find(filter);
  }

  @patch('/customers', {
    responses: {
      '200': {
        description: 'Customers PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() customers: Customers,
    @param.query.object('where', getWhereSchemaFor(Customers)) where?: Where,
  ): Promise<Count> {
    return await this.customersRepository.updateAll(customers, where);
  }

  @get('/customers/{id}', {
    responses: {
      '200': {
        description: 'Customers model instance',
        content: {'application/json': {schema: {'x-ts-type': Customers}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Customers> {
    return await this.customersRepository.findById(id);
  }

  @patch('/customers/{id}', {
    responses: {
      '204': {
        description: 'Customers PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() customers: Customers,
  ): Promise<void> {
    await this.customersRepository.updateById(id, customers);
  }

  @put('/customers/{id}', {
    responses: {
      '204': {
        description: 'Customers PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() customers: Customers,
  ): Promise<void> {
    const key = `customers:${id}`;
    this.cacheRepository.set(key, {value: customers.customer_name});
    await this.customersRepository.replaceById(id, customers);
  }

  @del('/customers/{id}', {
    responses: {
      '204': {
        description: 'Customers DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const key = `customers:${id}`;
    this.cacheRepository.delete(key);
    await this.customersRepository.deleteById(id);
  }
}
