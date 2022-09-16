import { Readable } from 'stream';
import delay from 'delay';
export default function slowDataStream(clock) {
    let index = 0;
    return new Readable({
        async read() {
            if (clock) {
                clock.tick(100);
            }
            else {
                await delay(100);
            }
            if (index++ < 10) {
                this.push('data\n'.repeat(100));
            }
            else {
                this.push(null);
            }
        },
    });
}
