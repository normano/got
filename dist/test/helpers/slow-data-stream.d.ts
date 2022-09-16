/// <reference types="node" />
import { Readable } from 'stream';
import type { Clock } from '@sinonjs/fake-timers';
export default function slowDataStream(clock?: Clock): Readable;
