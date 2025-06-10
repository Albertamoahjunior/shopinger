import express, { Request, Response } from "express";
const app = express();
const PORT: number = 5001;

import "./config/auth.config";

import routes from "./setup/routes";
import { connectWithDatabase, database } from "./setup/database";
import setupMiddleware from "./setup/middleware";

setupMiddleware(app);

app.get("/", (req: Request, res: Response)=>{
    res.status(200).send("Welcome to the shop API");
})

app.use("/api/v1", routes);

app.listen(PORT, async ()=>{
    console.log(`shop running on port ${PORT}`);
    await connectWithDatabase();
})
