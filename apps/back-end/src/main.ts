/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express, { Request, Response } from 'express';
import cors from "cors";
import * as path from 'path';
import { config } from './config';
import { mongooseConnection } from './database';
import { Server } from "http";
import responseHandler from "./helper/response-handler";
import { router } from './routes';
import { createGoogleOAuth } from './helper/third-party-oauth';
import { getMemoryUsage } from './utils/memory-usage';
import { createSocketServer } from './helper/socket';
import checkForRoundStatus from './controllers/cron-automation/round-status-update';

getMemoryUsage();
const app = express();

app.use(cors({ origin: config.CORS }));
app.use(mongooseConnection);
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(responseHandler);

createGoogleOAuth();

const bad_gateway = (req: Request, res: Response) => { return res.badGateway("badGateway", {}) };

app.get('/api', (req: Request, res: Response) =>
  res.ok("serverSuccessMsg")
);

app.use(router);
app.use("*", bad_gateway);

app.use((error: Error, req: Request, res: Response) => res.internalServerError(error.message, error, "customMessage"));

const port = process.env.PORT || 3333;
const server = new Server(app);
createSocketServer(server);
checkForRoundStatus.start();
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);