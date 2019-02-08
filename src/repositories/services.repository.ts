import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Services} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ServicesRepository extends DefaultCrudRepository<
  Services,
  typeof Services.prototype.id_service
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Services, dataSource);
  }
}
