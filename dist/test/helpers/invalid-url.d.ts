/// <reference types="node" />
import type { ExecutionContext } from 'ava';
export default function invalidUrl(t: ExecutionContext, error: TypeError & NodeJS.ErrnoException, url: string): void;
