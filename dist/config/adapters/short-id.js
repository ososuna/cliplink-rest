"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortIdAdapter = void 0;
const uuid_1 = require("uuid");
class ShortIdAdapter {
    static generateShortId() {
        return (0, uuid_1.v4)().slice(0, 8);
    }
}
exports.ShortIdAdapter = ShortIdAdapter;
