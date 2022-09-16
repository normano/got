import http from 'http';
import { promisify } from 'util';
import is from '@sindresorhus/is';
import { temporaryFile } from 'tempy';
import FakeTimers from '@sinonjs/fake-timers';
import got from '../../source/index.js';
import createHttpsTestServer from './create-https-test-server.js';
import createHttpTestServer from './create-http-test-server.js';
const generateHook = ({ install, options: testServerOptions }) => ({
    async exec(t, run) {
        const clock = install ? FakeTimers.install() : FakeTimers.createClock();
        // Re-enable body parsing to investigate https://github.com/sindresorhus/got/issues/1186
        const server = await createHttpTestServer(is.plainObject(testServerOptions) ? testServerOptions : {
            bodyParser: {
                type: () => false,
            },
        });
        const options = {
            context: {
                avaTest: t.title,
            },
            handlers: [
                (options, next) => {
                    const result = next(options);
                    clock.tick(0);
                    // @ts-expect-error FIXME: Incompatible union type signatures
                    result.on('response', () => {
                        clock.tick(0);
                    });
                    return result;
                },
            ],
        };
        const preparedGot = got.extend({ prefixUrl: server.url, ...options });
        try {
            await run(t, server, preparedGot, clock);
        }
        finally {
            await server.close();
        }
        if (install) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            clock.uninstall();
        }
    },
});
export const withBodyParsingServer = generateHook({ install: false, options: {} });
export default generateHook({ install: false });
export const withServerAndFakeTimers = generateHook({ install: true });
const generateHttpsHook = (options, installFakeTimer = false) => ({
    async exec(t, run) {
        const fakeTimer = installFakeTimer ? FakeTimers.install() : undefined;
        const server = await createHttpsTestServer(options);
        const preparedGot = got.extend({
            context: {
                avaTest: t.title,
            },
            handlers: [
                (options, next) => {
                    const result = next(options);
                    fakeTimer?.tick(0);
                    // @ts-expect-error FIXME: Incompatible union type signatures
                    result.on('response', () => {
                        fakeTimer?.tick(0);
                    });
                    return result;
                },
            ],
            prefixUrl: server.url,
            https: {
                certificateAuthority: server.caCert,
                rejectUnauthorized: true,
            },
        });
        try {
            await run(t, server, preparedGot, fakeTimer);
        }
        finally {
            await server.close();
        }
        if (installFakeTimer) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            fakeTimer.uninstall();
        }
    },
});
export const withHttpsServer = generateHttpsHook;
// TODO: Remove this when `create-test-server` supports custom listen.
export const withSocketServer = {
    async exec(t, run) {
        const socketPath = temporaryFile({ extension: 'socket' });
        const server = http.createServer((request, response) => {
            server.emit(request.url, request, response);
        });
        server.socketPath = socketPath;
        // @ts-expect-error TypeScript doesn't accept `callback` with no arguments
        await promisify(server.listen.bind(server))(socketPath);
        try {
            await run(t, server);
        }
        finally {
            await promisify(server.close.bind(server))();
        }
    },
};
