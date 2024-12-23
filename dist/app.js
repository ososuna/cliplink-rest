"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const mongodb_1 = require("./data/mongodb");
const routes_1 = require("./presentation/routes");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// (() => {
//   main();
// })();
// async function main() {
//   await MongoDatabase.connect({
//     dbName: envs.MONGO_DB_NAME,
//     mongoUrl: envs.MONGO_URL
//   });
//   new Server({ port: envs.PORT, routes: AppRoutes.routes }).start();
// }
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongodb_1.MongoDatabase.connect({
            dbName: config_1.envs.MONGO_DB_NAME,
            mongoUrl: config_1.envs.MONGO_URL
        });
        const app = (0, express_1.default)();
        // middlewares
        app.use((0, cors_1.default)({
            origin: 'http://localhost:4321', // Frontend URL
            credentials: true, // Allow cookies to be sent
        }));
        app.use(express_1.default.json());
        app.use((0, cookie_parser_1.default)());
        app.use(routes_1.AppRoutes.routes);
        app.listen(config_1.envs.PORT, () => {
            console.log(`server running on port ${config_1.envs.PORT}`);
        });
    });
}
main();
//# sourceMappingURL=app.js.map