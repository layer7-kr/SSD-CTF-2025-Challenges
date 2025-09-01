const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

let EXTERNAL_PORT = 3000;

const authAPI = require(path.join(__dirname, 'apis', 'auth.js'));
const adminAPI = require(path.join(__dirname, 'apis', 'admin.js'));
const ssdAPI = require(path.join(__dirname, 'apis', 'ssd.js'));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authAPI);
app.use('/api/admin', adminAPI);
app.use('/api/ssd', ssdAPI);

app.get('/', (req, res) => {
    res.send('<h1>SSD</h1><div><p>간단한 기능이 구현된 SSD입니다.</p><a href="/diagram">Link</a></div>');
});

app.get('/diagram', (req, res) => {
    res.send([
        " ┌─────────────────────────┐",
        " │        호스트 (CPU, OS) │",
        " └───────────┬─────────────┘",
        "             │ SATA/NVMe",
        " ┌───────────▼─────────────┐",
        " │       SSD 컨트롤러       │",
        " │  (펌웨어, FTL 매핑 관리) │",
        " └───────────┬─────────────┘",
        "     ┌───────┴────────┐",
        "     │                │",
        "┌────▼────┐      ┌────▼────┐",
        "│   DRAM  │      │  NAND   │",
        "│ (캐시)  │      │ (저장소)│",
        "└─────────┘      └─────────┘",
        "     │",
        "┌────▼─────┐",
        "│ SLC 캐시 │  (NAND 일부 영역을 버퍼처럼 사용)",
        "└──────────┘"
    ].join('<br>')
    );
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile('favicon.ico');
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
    EXTERNAL_PORT,
    () => {
        console.log('Server started');
    }
)