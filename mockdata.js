const axios = require('axios');

const mockCustomerData = async (endpoint, id, name) => {
  const res = await axios.post(endpoint, {
    id_customer: id,
    customer_name: `${name} ${id}`,
  });
};

const mockProData = async (endpoint, id, name) => {
  const res = await axios.post(endpoint, {
    id_pro: id,
    pro_name: `${name} ${id}`,
  });
};

const mockServiceData = async (endpoint, id, name) => {
  const res = await axios.post(endpoint, {
    id_service: id,
    service_name: `${name} ${id}`,
  });
};

const endpoint = 'http://192.168.0.186:3000';
const customerEndpoint = endpoint + '/customers';
const proEndpoint = endpoint + '/pro';
const serviceEndpoint = endpoint + '/services';

const size = 1000;
let i = 0;
while (i <= size) {
  mockCustomerData(customerEndpoint, i, 'Customer');
  mockProData(proEndpoint, i, 'Pro');
  mockServiceData(serviceEndpoint, i, 'Service');
  i++;
}
