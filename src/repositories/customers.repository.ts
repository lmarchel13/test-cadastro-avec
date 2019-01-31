import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Customers} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CustomersRepository extends DefaultCrudRepository<
  Customers,
  typeof Customers.prototype.id_customer
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Customers, dataSource);
  }
}
