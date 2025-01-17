import "./utils/instrument"
import * as Sentry from "@sentry/node";
import express, { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import Log from "./utils/loggers";
import Config from "./utils/config";
import sequelize  from './config/db';
//Import the models
import './models'
import authRoute from './routes/userRoutes';
import carListingRoute from './routes/carListingRoutes'
import uploadRoutes from './routes/uploadRoutes'
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
const port: number = Config.serverPort 
const version: string = "v1";



app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: false }));
app.get("/health", (req: Request, res: Response) => {
  res.send(`Welcome to Cardel ${process.env.SERVER_NAME} Service`);
});

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });

 //use Routes for api 
app.use('/auth',authRoute)
app.use('/carlisting', carListingRoute)
app.use('/upload', uploadRoutes)
app.use('/uploads', express.static('uploads'));


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

Sentry.captureException(new Error("Manual test error from Sentry"))
// but before any and other error-handling middlewares are defined
Sentry.setupExpressErrorHandler(app);
app.listen(port, async() => {
  Log.success(`API is Alive and running 🚀 on port ${port}`);
  await sequelize.sync({ alter: false });
});