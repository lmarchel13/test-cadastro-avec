import {repository, AnyType} from '@loopback/repository';
import {param, get} from '@loopback/rest';
import {CustomersRepository} from '../repositories';
import {ProfessionalsRepository} from '../repositories';
import {ServicesRepository} from '../repositories';
import {CachememRepository} from '../repositories';

const _ = require('lodash');

export class MyController {
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

  /**
   * FUNÇÕES AUXILIARES
   */

  async insertRedis(k: string, v: string) {
    console.log('Inserindo dados no Redis...');
    this.cacheRepository.set(k, {value: v});
    const _ = this.cacheRepository.get(k);
    if (_) {
      console.log('Dados inseridos com sucesso..');
    }
  }

  /**
   * API ENDPOINT - POSTGRESQL
   */

  @get('/test/{customerID}/{proID}/{serviceID}', {
    responses: {
      '200': {
        description: 'Customers/Professionals/Services',
        content: {'application/json': {schema: {}}},
      },
    },
  })
  async getAllData(
    @param.path.number('customerID') idCustomer: number,
    @param.path.number('proID') idPro: number,
    @param.path.number('serviceID') idService: number,
  ) {
    const customers = await this.customersRepository.findById(idCustomer);
    const professionals = await this.professionalsRepository.findById(idPro);
    const services = await this.servicesRepository.findById(idService);

    return {
      customer_name: customers.customer_name,
      pro_name: professionals.pro_name,
      service_name: services.service_name,
    };
  }

  @get('/testarray/', {
    responses: {
      '200': {
        description: 'Customers/Professionals/Services from Database',
        content: {'application/json': {schema: {}}},
      },
    },
  })
  async getListOfIDs(
    @param.array('c', 'query', {type: 'number'}) customers: number[],
    @param.array('p', 'query', {type: 'number'})
    professionals: number[],
    @param.array('s', 'query', {type: 'number'}) services: number[],
  ) {
    let customersIDs: any = new Object();
    let professionalsIDs: any = new Object();
    let servicesIDs: any = new Object();

    if (customers) {
      if (customers.length > 1) {
        await Promise.all(
          customers.map(async id => {
            const cust = await this.customersRepository.findById(id);
            if (cust) {
              customersIDs[id] = cust.customer_name;
            } else {
              customersIDs[id] = 'NOT FOUND';
            }
          }),
        );
      } else {
        const cust = await this.customersRepository.findById(customers[0]);
        const {id_customer, customer_name} = cust;
        customersIDs[id_customer] = customer_name;
      }
    }

    if (professionals) {
      if (professionals.length > 1) {
        await Promise.all(
          professionals.map(async id => {
            const pro = await this.professionalsRepository.findById(id);
            if (pro) {
              professionalsIDs[id] = pro.pro_name;
            } else {
              professionalsIDs[id] = 'NOT FOUND';
            }
          }),
        );
      } else {
        const pro = await this.professionalsRepository.findById(
          professionals[0],
        );
        const {id_pro, pro_name} = pro;
        professionalsIDs[id_pro] = pro_name;
      }
    }

    if (services) {
      if (services.length > 1) {
        await Promise.all(
          services.map(async id => {
            const serv = await this.servicesRepository.findById(id);
            if (serv) {
              servicesIDs[id] = serv.service_name;
            } else {
              servicesIDs[id] = 'NOT FOUND';
            }
          }),
        );
      } else {
        const serv = await this.servicesRepository.findById(services[0]);
        const {id_service, service_name} = serv;
        servicesIDs[id_service] = service_name;
      }
    }

    return {
      customers: customersIDs,
      professionals: professionalsIDs,
      services: servicesIDs,
    };
  }

  /**
   * API ENDPOINT - REDIS
   */

  @get('/redistest/{customerID}/{proID}/{serviceID}', {
    responses: {
      '200': {
        description: 'Customers/Professionals/Services',
        content: {'application/json': {schema: {}}},
      },
    },
  })
  async getAllDataFromRedis(
    @param.path.number('customerID') idCustomer: number,
    @param.path.number('proID') idPro: number,
    @param.path.number('serviceID') idService: number,
  ) {
    let customer: any;
    const _customer = await this.cacheRepository.get(`customers:${idCustomer}`);
    if (_customer == null) {
      customer = this.customersRepository.findById(idCustomer);
    } else {
      customer = _customer.value;
    }

    let pro: any;
    const _pro = await this.cacheRepository.get(`pros:${idPro}`);
    if (_pro == null) {
      pro = this.professionalsRepository.findById(idPro);
    } else {
      pro = _pro.value;
    }

    let service: any;
    const _service = await this.cacheRepository.get(`services:${idService}`);
    if (_service == null) {
      service = this.servicesRepository.findById(idService);
    } else {
      service = _service.value;
    }

    return {
      customer_name: customer,
      pro_name: pro,
      service_name: service,
    };
  }

  @get('/redistestarray/', {
    responses: {
      '200': {
        description: 'Customers/Professionals/Services from REDIS DATABASE',
        content: {'application/json': {schema: {}}},
      },
    },
  })
  async getListOfIDsFromRedis(
    @param.array('c', 'query', {type: 'number'}) customers: number[],
    @param.array('p', 'query', {type: 'number'})
    professionals: number[],
    @param.array('s', 'query', {type: 'number'}) services: number[],
  ) {
    let customersIDs: any = new Object();
    let professionalsIDs: any = new Object();
    let servicesIDs: any = new Object();

    /**
     * Customers loop
     */

    if (customers) {
      if (customers.length > 1) {
        await Promise.all(
          customers.map(async id => {
            const key = `customers:${id}`;
            try {
              const cust = await this.cacheRepository.get(key);
              if (cust) {
                customersIDs[id] = cust.value;
              } else {
                const _cust = await this.customersRepository.findById(id);
                if (_cust) {
                  customersIDs[id] = _cust.customer_name;
                  this.insertRedis(key, _cust.customer_name);
                } else {
                  customersIDs[id] = 'NOT FOUND';
                  console.log(`ID ${id} não encontrado em nenhuma database...`);
                }
              }
            } catch (error) {
              console.log(error);
            }
          }),
        );
      } else {
        const id = customers[0];
        const key = `customers:${id}`;
        try {
          const cust = await this.cacheRepository.get(key);
          if (cust) {
            customersIDs[id] = cust.value;
          } else {
            const _cust = await this.customersRepository.findById(id);
            if (_cust) {
              customersIDs[id] = _cust.customer_name;
            } else {
              customersIDs[id] = 'NOT FOUND';
              console.log(`ID ${id} não encontrado em nenhuma database...`);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    /**
     * Professionals loop
     */

    if (professionals) {
      if (professionals.length > 1) {
        await Promise.all(
          professionals.map(async id => {
            const key = `pros:${id}`;
            try {
              const pro = await this.cacheRepository.get(key);
              if (pro) {
                professionalsIDs[id] = pro.value;
              } else {
                const _pro = await this.professionalsRepository.findById(id);
                if (_pro) {
                  professionalsIDs[id] = _pro.pro_name;
                } else {
                  professionalsIDs[id] = 'NOT FOUND';
                  console.log(`ID ${id} não encontrado em nenhuma database...`);
                }
              }
            } catch (error) {
              console.log(error);
            }
          }),
        );
      } else {
        const id = professionals[0];
        const key = `pros:${id}`;
        try {
          const pro = await this.cacheRepository.get(key);
          if (pro) {
            professionalsIDs[id] = pro.value;
          } else {
            const _pro = await this.professionalsRepository.findById(id);
            if (_pro) {
              professionalsIDs[id] = _pro.pro_name;
            } else {
              professionalsIDs[id] = 'NOT FOUND';
              console.log(`ID ${id} não encontrado em nenhuma database...`);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    /**
     * Services loop
     */

    if (services) {
      if (services.length > 1) {
        await Promise.all(
          services.map(async id => {
            const key = `services:${id}`;
            try {
              const serv = await this.cacheRepository.get(key);
              if (serv) {
                servicesIDs[id] = serv.value;
              } else {
                const _serv = await this.servicesRepository.findById(id);
                if (_serv) {
                  servicesIDs[id] = _serv.service_name;
                } else {
                  servicesIDs[id] = 'NOT FOUND';
                  console.log(`ID ${id} não encontrado em nenhuma database...`);
                }
              }
            } catch (error) {
              console.log(error);
            }
          }),
        );
      } else {
        const id = services[0];
        const key = `services:${id}`;
        try {
          const serv = await this.cacheRepository.get(key);
          if (serv) {
            servicesIDs[id] = serv.value;
          } else {
            const _serv = await this.servicesRepository.findById(id);
            if (_serv) {
              servicesIDs[id] = _serv.service_name;
            } else {
              servicesIDs[id] = 'NOT FOUND';
              console.log(`ID ${id} não encontrado em nenhuma database...`);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return {
      customers: customersIDs,
      professionals: professionalsIDs,
      services: servicesIDs,
    };
  }
}
