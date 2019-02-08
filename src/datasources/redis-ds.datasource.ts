import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './redis-ds.datasource.json';

export class RedisDSDataSource extends juggler.DataSource {
  static dataSourceName = 'redisDS';

  constructor(
    @inject('datasources.config.redisDS', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
