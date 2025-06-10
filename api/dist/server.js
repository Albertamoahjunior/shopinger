"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 5001;
require("./config/auth.config");
const routes_1 = __importDefault(require("./setup/routes"));
const database_1 = require("./setup/database");
const middleware_1 = __importDefault(require("./setup/middleware"));
(0, middleware_1.default)(app);
app.get("/", (req, res) => {
    res.status(200).send("Welcome to the shop API");
});
app.use("/api/v1", routes_1.default);
app.listen(PORT, async () => {
    console.log(`shop running on port ${PORT}`);
    await (0, database_1.connectWithDatabase)();
});
//# sourceMappingURL=server.js.map