import path from 'path';
import dotenv from 'dotenv';

// Determine env: CLI arg or default 'prod'
const envName =
  process.env.ENV ||
  process.argv.find(arg => arg.startsWith('--env='))?.split('=')[1] ||
  'prod';

// Load the corresponding .env file
dotenv.config({ path: path.resolve(`.env.${envName}`) });

if (!process.env.BASE_URL) {
  throw new Error(`BASE_URL is missing in .env.${envName}`);
}
if (!process.env.USERNAME || !process.env.PASSWORD) {
  throw new Error(`USERNAME/PASSWORD missing in .env.${envName}`);
}

const environment = {
  name: envName,
  baseUrl: process.env.BASE_URL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

console.log(`🌍 Running tests on environment: ${envName}`);
export default environment;
