import {repository} from '@loopback/repository';
import {param, get} from '@loopback/rest';
import {CustomersRepository} from '../repositories';
import {ProfessionalsRepository} from '../repositories';
import {ServicesRepository} from '../repositories';
import {CachememRepository} from '../repositories';
const _ = require('lodash');

export class Cache_ctrlController {
  constructor(
    @repository(CustomersRepository)
    public customersRepository: CustomersRepository,
    @repository(ProfessionalsRepository)
    public professionalsRepository: ProfessionalsRepository,
    @repository(ServicesRepository)
    public servicesRepository: ServicesRepository,
    @repository(CachememRepository)
    public cacheRepository: CachememRepository,
  ) {}

  @get('/start_cache')
  async syncDatabase() {
    //this.cacheRepository.deleteAll();
    console.log('Cache Control Started...');
    const customers = await this.customersRepository.find();
    const professionals = await this.professionalsRepository.find();
    const services = await this.servicesRepository.find();

    _.map(customers, (obj: any) => {
      const {id_customer, customer_name} = obj;
      this.cacheRepository.set(`customers:${id_customer}`, {
        value: customer_name,
      });
    });

    _.map(professionals, (obj: any) => {
      const {id_pro, pro_name} = obj;
      this.cacheRepository.set(`pros:${id_pro}`, {value: pro_name});
    });

    _.map(services, (obj: any) => {
      const {id_service, service_name} = obj;
      this.cacheRepository.set(`services:${id_service}`, {value: service_name});
    });
  }
}
