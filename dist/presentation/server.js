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
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class Server {
    constructor(options) {
        this.app = (0, express_1.default)();
        const { port = 3000, routes } = options;
        this.port = port;
        this.routes = routes;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // middlewares
            this.app.use((0, cors_1.default)({
                origin: 'http://localhost:4321', // Frontend URL
                credentials: true, // Allow cookies to be sent
            }));
            this.app.use(express_1.default.json());
            this.app.use((0, cookie_parser_1.default)());
            // this.app.use(express.urlencoded({ extended: true })); // x-www-formurlencoder
            this.app.use(this.routes);
            this.app.listen(this.port, () => {
                console.log(`server running on port ${this.port}`);
            });
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map