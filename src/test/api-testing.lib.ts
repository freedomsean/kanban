import * as http from 'http';

export class ApiTestingLib {
  static startHttpServer(): Promise<{ app: any; server: any }> {
    return new Promise((resolve) => {
      const app = require('../app');
      // Do setTimeout, to make sure db is connected.
      setTimeout(() => {
        resolve(app);
      }, 2000);
    });
  }

  static closeHttpServer(server: http.Server): Promise<void> {
    return new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  }
}
