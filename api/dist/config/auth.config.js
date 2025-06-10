"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash_pass = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hash_pass = (password) => {
    const saltRounds = 10;
    const hashed = bcrypt_1.default.hashSync(password, saltRounds);
    return hashed;
};
exports.hash_pass = hash_pass;
//# sourceMappingURL=auth.config.js.map