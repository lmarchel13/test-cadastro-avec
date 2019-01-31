import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Professionals} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProfessionalsRepository extends DefaultCrudRepository<
  Professionals,
  typeof Professionals.prototype.id_pro
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Professionals, dataSource);
  }
}
