const crypto = require('crypto');
const bcrypt = require("bcryptjs");

(async () => {
    const password = crypto.randomBytes(64).toString('hex');
    console.log(password);
    console.log(await bcrypt.hash(password, 10))
})()