/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from "cors";
import * as path from 'path';
import "./config";
import { mongooseConnection } from './database';
import { Server } from "http";

const app = express();

app.use(cors());
app.use(mongooseConnection);
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const bad_gateway = (req, res) => { return res.status(502).json({ status: 502, message: "Backend API Bad Gateway" }) };

app.get('/api', (req, res) => {
  return res.send({ message: 'Welcome to back-end!' });
});

app.use("*", bad_gateway);

const port = process.env.PORT || 3333;
const server = new Server(app);
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);