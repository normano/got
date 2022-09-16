/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { Buffer } from 'buffer';
import https from 'https';
import type { SecureContextOptions } from 'tls';
import express from 'express';
export declare type HttpsServerOptions = {
    commonName?: string;
    days?: number;
    ciphers?: SecureContextOptions['ciphers'];
    honorCipherOrder?: SecureContextOptions['honorCipherOrder'];
    minVersion?: SecureContextOptions['minVersion'];
    maxVersion?: SecureContextOptions['maxVersion'];
};
export declare type ExtendedHttpsTestServer = {
    https: https.Server;
    caKey: Buffer;
    caCert: Buffer;
    url: string;
    port: number;
    close: () => Promise<any>;
} & express.Express;
declare const createHttpsTestServer: (options?: HttpsServerOptions) => Promise<ExtendedHttpsTestServer>;
export default createHttpsTestServer;
