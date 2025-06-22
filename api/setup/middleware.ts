import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import session, { SessionOptions } from "express-session";
// import connectRedis from "connect-redis";
import passport from "passport";
import cors from 'cors';
// import redisClient from "./../config/redis";
import './../config/passport.config';

// const RedisStore = connectRedis(session)

// const redisStore = new RedisStore({
//     client: redisClient,
//     prefix: "shopmanager:",
// })

export default (app: Express) => {
    app.use(express.static("./public/images/inventory"));

    const corsOptions = {
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser("web-secret"));
    app.use(
        session({
            secret: "web-secret",
            resave: true,
            saveUninitialized: true,
            // store: redisStore,
        })
    );

    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`${req.method}: ${req.url}`);
        next();
    });

    app.use(passport.initialize());
    app.use(passport.session());
};
