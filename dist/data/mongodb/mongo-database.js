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
exports.MongoDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const winston_1 = __importDefault(require("winston"));
class MongoDatabase {
    static connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dbName, mongoUrl } = options;
            const logger = winston_1.default.createLogger({
                level: 'info',
                format: winston_1.default.format.json(),
                defaultMeta: { service: 'user-service' },
                transports: [
                    //
                    // - Write all logs with importance level of `error` or higher to `error.log`
                    //   (i.e., error, fatal, but not other levels)
                    //
                    new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
                    //
                    // - Write all logs with importance level of `info` or higher to `combined.log`
                    //   (i.e., fatal, error, warn, and info, but not trace)
                    //
                    new winston_1.default.transports.File({ filename: 'combined.log' }),
                ],
            });
            try {
                yield mongoose_1.default.connect(mongoUrl, { dbName });
                console.log('mongo connection succesful ✅');
            }
            catch (error) {
                console.log('mongo connection error ❌');
                logger.error(`Error connecting to mongo: ${error}`);
                throw error;
            }
        });
    }
}
exports.MongoDatabase = MongoDatabase;
//# sourceMappingURL=mongo-database.js.map