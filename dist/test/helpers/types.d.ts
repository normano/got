/// <reference types="node" />
import type { Server } from 'http';
import type { TestServer } from 'create-test-server';
export declare type ExtendedHttpServer = {
    socketPath: string;
} & Server;
export declare type ExtendedTestServer = {
    hostname: string;
    sslHostname: string;
} & TestServer;
export declare type InstalledClock = any;
export declare type GlobalClock = any;
