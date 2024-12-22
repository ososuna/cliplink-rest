"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
const env_var_1 = require("env-var");
/**
* @envs Adapter pattern
* @description This file allows us to easily modify only one file
* in case we decide to use different third-party packages,
* helping us avoid coupling with those packages.
* @author Oswaldo Osuna
*/
exports.envs = {
    PORT: (0, env_var_1.get)('PORT').required().asPortNumber(),
    MONGO_URL: (0, env_var_1.get)('MONGO_URL').required().asString(),
    MONGO_DB_NAME: (0, env_var_1.get)('MONGO_DB_NAME').required().asString(),
    JWT_SEED: (0, env_var_1.get)('JWT_SEED').required().asString(), // openssl rand -hex 32 to generate safe jwt seed
    GITHUB_CLIENT_ID: (0, env_var_1.get)('GITHUB_CLIENT_ID').required().asString(),
    GITHUB_CLIENT_SECRET: (0, env_var_1.get)('GITHUB_CLIENT_SECRET').required().asString(),
    GITHUB_CALLBACK_URL: (0, env_var_1.get)('GITHUB_CALLBACK_URL').required().asString(),
    GOOGLE_CLIENT_ID: (0, env_var_1.get)('GOOGLE_CLIENT_ID').required().asString(),
    GOOGLE_CLIENT_SECRET: (0, env_var_1.get)('GOOGLE_CLIENT_SECRET').required().asString(),
    GOOGLE_CALLBACK_URL: (0, env_var_1.get)('GOOGLE_CALLBACK_URL').required().asString(),
};
