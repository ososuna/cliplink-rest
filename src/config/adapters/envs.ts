import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
  JWT_SEED: get('JWT_SEED').required().asString(), // openssl rand -hex 32 to generate safe jwt seed
  JWT_ACCESS_EXPIRATION: get('JWT_ACCESS_EXPIRATION').required().asString(),
  JWT_REFRESH_EXPIRATION: get('JWT_REFRESH_EXPIRATION').required().asString(),
  GITHUB_CLIENT_ID: get('GITHUB_CLIENT_ID').required().asString(),
  GITHUB_CLIENT_SECRET: get('GITHUB_CLIENT_SECRET').required().asString(),
  GITHUB_CALLBACK_URL: get('GITHUB_CALLBACK_URL').required().asString(),
  GOOGLE_CLIENT_ID: get('GOOGLE_CLIENT_ID').required().asString(),
  GOOGLE_CLIENT_SECRET: get('GOOGLE_CLIENT_SECRET').required().asString(),
  GOOGLE_CALLBACK_URL: get('GOOGLE_CALLBACK_URL').required().asString(),
  RESEND_API_KEY: get('RESEND_API_KEY').required().asString(),
  WEB_APP_URL: get('WEB_APP_URL').required().asString(),
};
