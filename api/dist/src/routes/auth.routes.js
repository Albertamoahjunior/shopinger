"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = express_1.default.Router();
router.post("/login", passport_1.default.authenticate('local'), auth_controller_1.default.login);
router.post("/signup", auth_controller_1.default.sign_up_customer);
router.get("/logout", auth_controller_1.default.log_out);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map