const axios = require('axios');

let endpoint = 'http://localhost:3000/testarray?';

let a = 465;

let i = 0;
while (i < a) {
  endpoint += `c=${i}&`;
  i++;
}

let j = 0;
while (j < a) {
  endpoint += `p=${j}&`;
  j++;
}

let k = 0;
while (k < a) {
  endpoint += `s=${k}&`;
  k++;
}

endpoint = endpoint.substring(0, endpoint.length - 1);

getData = async endpoint => {
  try {
    const res = await axios.get(endpoint);
    //console.log(res.data);
    console.log('done');
  } catch (error) {
    console.log(error);
  }
};

getData(endpoint);
