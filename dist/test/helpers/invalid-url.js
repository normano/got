export default function invalidUrl(t, error, url) {
    t.is(error.code, 'ERR_INVALID_URL');
    if (error.message === 'Invalid URL') {
        t.is(error.input, url);
    }
    else {
        t.is(error.message.slice('Invalid URL: '.length), url);
    }
}
