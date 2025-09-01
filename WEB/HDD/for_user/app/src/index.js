const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const { rateLimit } = require('express-rate-limit');

require('dotenv').config();

const authAPI = require('./apis/auth');
const hddAPI = require('./apis/hdd');

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', limiter, authAPI);
app.use('/api/hdd', hddAPI);

app.get('/', (req, res) => {
    return res.send('<h1>HDD</h1><div><p>간단한 기능이 구현된 HDD입니다.</p></div>');
});

app.get("/xss", (req, res) => {
    return res.send(req.query.xss);
});

app.get('/favicon.ico', (req, res) => {
    return res.sendFile(path.join(__dirname, 'favicon.ico'));
});

// https://stackoverflow.com/questions/36113101/handling-404-500-and-exceptions-in-node-js-and-express
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    console.log(err);
    res.sendStatus(err?.status ?? 500);
    return;
});

app.listen(
    process.env.PORT ?? 3000,
    () => {
        const db = require('./db');
        db.write({
            user_id: '1',
            data: JSON.stringify({
                id: '1',
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD
            })
        });
        db.write({
            user_id: '1',
            data: process.env.FLAG ?? 'SSD{REDACTED}'
        });
    }
)