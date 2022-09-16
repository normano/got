/// <reference types="node" />
import http from 'http';
import { type Express, type NextFunction } from 'express';
export declare type HttpServerOptions = {
    bodyParser?: NextFunction | false;
};
export declare type ExtendedHttpTestServer = {
    http: http.Server;
    url: string;
    port: number;
    hostname: string;
    close: () => Promise<any>;
} & Express;
declare const createHttpTestServer: (options?: HttpServerOptions) => Promise<ExtendedHttpTestServer>;
export default createHttpTestServer;
