import {DefaultKeyValueRepository} from '@loopback/repository';
import {Cachemem} from '../models';
import {RedisDSDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CachememRepository extends DefaultKeyValueRepository<
  Cachemem
 > {
  constructor(
    @inject('datasources.redisDS') dataSource: RedisDSDataSource,
  ) {
    super(Cachemem, dataSource);
  }
}
