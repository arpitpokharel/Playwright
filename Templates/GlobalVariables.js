import env from '../Environments/index.js';

globalThis.globalVariable = {
  env: env.name,
  baseUrl: env.baseUrl,
  username: env.username,
  password: env.password,
};

