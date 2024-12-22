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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUrls = void 0;
const __1 = require("../..");
class GetUrls {
    constructor(urlRepository) {
        this.urlRepository = urlRepository;
    }
    execute(urlId, page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page < 1 || limit < 1) {
                throw __1.CustomError.badRequest('Page and limit must be positive integers');
            }
            return yield this.urlRepository.getUrls(urlId, page, limit, search);
        });
    }
}
exports.GetUrls = GetUrls;
//# sourceMappingURL=get-urls.use-case.js.map