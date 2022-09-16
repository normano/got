import https from 'https';
import express from 'express';
import pify from 'pify';
import pem from 'pem';
const createHttpsTestServer = async (options = {}) => {
    const createCsr = pify(pem.createCSR);
    const createCertificate = pify(pem.createCertificate);
    const caCsrResult = await createCsr({ commonName: 'authority' });
    const caResult = await createCertificate({
        csr: caCsrResult.csr,
        clientKey: caCsrResult.clientKey,
        selfSigned: true,
    });
    const caKey = caResult.clientKey;
    const caCert = caResult.certificate;
    const serverCsrResult = await createCsr({ commonName: options.commonName ?? 'localhost' });
    const serverResult = await createCertificate({
        csr: serverCsrResult.csr,
        clientKey: serverCsrResult.clientKey,
        serviceKey: caKey,
        serviceCertificate: caCert,
        days: options.days ?? 365,
    });
    const serverKey = serverResult.clientKey;
    const serverCert = serverResult.certificate;
    const server = express();
    server.https = https.createServer({
        key: serverKey,
        cert: serverCert,
        ca: caCert,
        requestCert: true,
        rejectUnauthorized: false,
        ciphers: options.ciphers,
        honorCipherOrder: options.honorCipherOrder,
        minVersion: options.minVersion,
        maxVersion: options.maxVersion,
    }, server);
    server.set('etag', false);
    await pify(server.https.listen.bind(server.https))();
    server.caKey = caKey;
    server.caCert = caCert;
    server.port = server.https.address().port;
    server.url = `https://localhost:${(server.port)}`;
    server.close = async () => pify(server.https.close.bind(server.https))();
    return server;
};
export default createHttpsTestServer;
