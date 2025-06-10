import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import cors from 'cors';
import './../config/passport.config'; // Import the passport configuration

//working with session stores 
const postgre_sql_store = connectPgSimple(session);
const session_store = new postgre_sql_store({
    conString: "postgresql://postgres.qygpfjkqjgvlhpfyurjo:shopmanager-albertlife@aws-0-ap-south-1.pooler.supabase.com:6543/postgres", // Replace with your actual connection string or env variable
});

export default (app: Express) => {
    //serving up my static stuff
    app.use(express.static("./public/images/inventory"));

    //request autorization
    const corsOptions = {
        origin: '*',
        credentials: true,
        optionSuccessStatus : 200,
    };

    app.use(cors(corsOptions));

    app.use(express.json());
    app.use(cookieParser("web-secret"));
    app.use(
        session({
            secret: "web-secret",
            resave: true,
            saveUninitialized: true,
            store: session_store,
        })
    );

    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`$(req.method):$(req.url)`);
        next();
    });

    app.use(passport.initialize());
    app.use(passport.session());
};
