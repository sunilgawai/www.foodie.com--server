import express, { Application } from "express";
import DataBase from "../database/DataBase";
import { APP_PORT } from "../config";
import { errorHandler } from "./middlewares";
import { adminRouter, authRouter, userRouter } from "./routes";
import cors from "cors";
import morgan from "morgan";

// Application init.
const app: Application = express();

// DataBase init.
DataBase.connectToDB();

// Middlewares.
// const cors_opts = { origin: 'http://localhost:3300', optionsSuccessStatus: 200 }
app.use(cors({
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Init Routes.
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);


app.use((req, res) => {
    if (req.path == '/') return res.json({ msg: 'Welcome to www.foodies.com' });

    res.send(`
    <h2>No Information Foud For This Route.</h2>
    <a href="http:localhost:4000">Home Route</a>
    `)
})

// Error Handler.
app.use(errorHandler);

app.listen(APP_PORT, () => console.log(`listening on http://localhost:${APP_PORT}`));