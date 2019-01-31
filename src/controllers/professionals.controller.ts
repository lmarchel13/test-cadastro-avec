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
import {Professionals} from '../models';
import {ProfessionalsRepository} from '../repositories';

export class ProfessionalsController {
  constructor(
    @repository(ProfessionalsRepository)
    public professionalsRepository : ProfessionalsRepository,
  ) {}

  @post('/pro', {
    responses: {
      '200': {
        description: 'Professionals model instance',
        content: {'application/json': {schema: {'x-ts-type': Professionals}}},
      },
    },
  })
  async create(@requestBody() professionals: Professionals): Promise<Professionals> {
    return await this.professionalsRepository.create(professionals);
  }

  @get('/pro/count', {
    responses: {
      '200': {
        description: 'Professionals model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Professionals)) where?: Where,
  ): Promise<Count> {
    return await this.professionalsRepository.count(where);
  }

  @get('/pro', {
    responses: {
      '200': {
        description: 'Array of Professionals model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Professionals}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Professionals)) filter?: Filter,
  ): Promise<Professionals[]> {
    return await this.professionalsRepository.find(filter);
  }

  @patch('/pro', {
    responses: {
      '200': {
        description: 'Professionals PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() professionals: Professionals,
    @param.query.object('where', getWhereSchemaFor(Professionals)) where?: Where,
  ): Promise<Count> {
    return await this.professionalsRepository.updateAll(professionals, where);
  }

  @get('/pro/{id}', {
    responses: {
      '200': {
        description: 'Professionals model instance',
        content: {'application/json': {schema: {'x-ts-type': Professionals}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Professionals> {
    return await this.professionalsRepository.findById(id);
  }

  @patch('/pro/{id}', {
    responses: {
      '204': {
        description: 'Professionals PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() professionals: Professionals,
  ): Promise<void> {
    await this.professionalsRepository.updateById(id, professionals);
  }

  @put('/pro/{id}', {
    responses: {
      '204': {
        description: 'Professionals PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() professionals: Professionals,
  ): Promise<void> {
    await this.professionalsRepository.replaceById(id, professionals);
  }

  @del('/pro/{id}', {
    responses: {
      '204': {
        description: 'Professionals DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.professionalsRepository.deleteById(id);
  }
}
