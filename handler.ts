/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'; // eslint-disable-line import/no-unresolved
import { app } from './app';

const serverless = require('serverless-http'); // eslint-disable-line  @typescript-eslint/no-var-requires

const expressapp: express.Application = app;

const handlerApp = serverless(expressapp);

export const handler = async (event: APIGatewayEvent, context: Context): Promise<ProxyResult> => {
  const server = await handlerApp(event, context);
  return server;
};
