"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdAdapter = void 0;
const uuid_1 = require("uuid");
class IdAdapter {
    static generateId() {
        return (0, uuid_1.v4)();
    }
}
exports.IdAdapter = IdAdapter;
