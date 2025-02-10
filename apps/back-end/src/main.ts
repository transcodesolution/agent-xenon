/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express, { Request, Response } from 'express';
import cors from "cors";
import * as path from 'path';
import "./config";
import { mongooseConnection } from './database';
import { Server } from "http";
import responseHandler from "./helper/response-handler";
import { router } from './routes';

const app = express();

app.use(cors());
app.use(mongooseConnection);
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(responseHandler);

const bad_gateway = (req: Request, res: Response) => { return res.badGateway("badGateway", {}) };

app.get('/api', (req: Request, res: Response) =>
  res.ok("serverSuccessMsg")
);

app.use(router);
app.use("*", bad_gateway);

const port = process.env.PORT || 3333;
const server = new Server(app);
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);