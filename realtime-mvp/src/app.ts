import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import { Server } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  SocketStateModel,
  StoreState,
} from './types';

const corsOrigin = 'http://localhost:5173';

export const port = process.env.PORT || 7071;

export const defaultSocketAppState = {
  storeStates: {},
  scannedLogs: {},
  connectedAdmins: [],
  // We treat this like a collection of devices to access their settings even after disconnecting and reconnecting
  deviceCollection: [],
  profiles: [],
  stores: [],
  deviceTypes: [],
  connectedClients: [],
  storeManagers: [],
  temporaryIds: [],
};

export const defaultStoreState: StoreState = {
  connectedDevices: [],
  printers: [],
  printJobs: [],
  cart: { storeCart: [] },
};

export const SocketAppState: SocketStateModel = {
  ...JSON.parse(JSON.stringify(defaultSocketAppState)),
};

export const app = express();
// Allow cross origin
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Enable compression for improved performance.
// app.use(compression());

// Set security headers for enhanced security.
// app.use(helmet());

export const server = http.createServer(app);

export const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: {
    methods: ['GET', 'POST'],
    origin: corsOrigin,
  },
});
