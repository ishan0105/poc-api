import express from 'express';
import cors from 'cors';
import devRouter from './src/routers/router';

const expressapp: express.Application = express();

expressapp.use(cors());

expressapp.use(express.json());

expressapp.use('/', devRouter);

export const app: express.Application = expressapp;
