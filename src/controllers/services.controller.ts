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
import {Services} from '../models';
import {ServicesRepository} from '../repositories';

export class ServicesController {
  constructor(
    @repository(ServicesRepository)
    public servicesRepository : ServicesRepository,
  ) {}

  @post('/services', {
    responses: {
      '200': {
        description: 'Services model instance',
        content: {'application/json': {schema: {'x-ts-type': Services}}},
      },
    },
  })
  async create(@requestBody() services: Services): Promise<Services> {
    return await this.servicesRepository.create(services);
  }

  @get('/services/count', {
    responses: {
      '200': {
        description: 'Services model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Services)) where?: Where,
  ): Promise<Count> {
    return await this.servicesRepository.count(where);
  }

  @get('/services', {
    responses: {
      '200': {
        description: 'Array of Services model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Services}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Services)) filter?: Filter,
  ): Promise<Services[]> {
    return await this.servicesRepository.find(filter);
  }

  @patch('/services', {
    responses: {
      '200': {
        description: 'Services PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() services: Services,
    @param.query.object('where', getWhereSchemaFor(Services)) where?: Where,
  ): Promise<Count> {
    return await this.servicesRepository.updateAll(services, where);
  }

  @get('/services/{id}', {
    responses: {
      '200': {
        description: 'Services model instance',
        content: {'application/json': {schema: {'x-ts-type': Services}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Services> {
    return await this.servicesRepository.findById(id);
  }

  @patch('/services/{id}', {
    responses: {
      '204': {
        description: 'Services PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() services: Services,
  ): Promise<void> {
    await this.servicesRepository.updateById(id, services);
  }

  @put('/services/{id}', {
    responses: {
      '204': {
        description: 'Services PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() services: Services,
  ): Promise<void> {
    await this.servicesRepository.replaceById(id, services);
  }

  @del('/services/{id}', {
    responses: {
      '204': {
        description: 'Services DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.servicesRepository.deleteById(id);
  }
}
