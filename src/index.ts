import {ApiServerApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {ApiServerApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new ApiServerApplication(options);
  await app.boot();
  await app.migrateSchema();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
