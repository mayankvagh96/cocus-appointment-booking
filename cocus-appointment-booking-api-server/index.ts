import express, { Express } from 'express';
import dotenv from 'dotenv';
import config from "config";
import AuthenticationRouter = require('./src/routers/AuthenticationRouter');
import AppointmentRouter = require('./src/routers/AppointmentRouter');
import log from "./src/logger/index";
const cors = require("cors");

import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/appointment-booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const connection = mongoose.connection;

connection.on('open', () => {
    log.info("Database connected");
})

dotenv.config();

// const PORT = process.env.PORT || 3000;
const PORT = config.get("serverConfig.port") as number;
const HOST = config.get("serverConfig.host") as string;

const app: Express = express();
app.use(express.json());

app.use(cors());

app.use("/api", AuthenticationRouter.getRouter());
app.use("/api/appointment", AppointmentRouter.getRouter());

app.listen(PORT, () => {
    console.log(`Running on ${PORT} ⚡`)
    log.info(`Server listing at http://${HOST}:${PORT} ⚡`);
});