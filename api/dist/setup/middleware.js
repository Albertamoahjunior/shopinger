"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
//working with session stores 
const postgre_sql_store = (0, connect_pg_simple_1.default)(express_session_1.default);
const session_store = new postgre_sql_store({
    conString: "postgresql://postgres.qygpfjkqjgvlhpfyurjo:shopmanager-albertlife@aws-0-ap-south-1.pooler.supabase.com:6543/postgres", // Replace with your actual connection string or env variable
});
exports.default = (app) => {
    //serving up my static stuff
    app.use(express_1.default.static("./public/images/inventory"));
    //request autorization
    const corsOptions = {
        origin: '*',
        credentials: true,
        optionSuccessStatus: 200,
    };
    app.use((0, cors_1.default)(corsOptions));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)("web-secret"));
    app.use((0, express_session_1.default)({
        secret: "web-secret",
        resave: true,
        saveUninitialized: true,
        store: session_store,
    }));
    app.use((req, res, next) => {
        console.log(`$(req.method):$(req.url)`);
        next();
    });
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
};
//# sourceMappingURL=middleware.js.map