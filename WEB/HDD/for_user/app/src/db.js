const path = require('path');
const fs = require('fs');

const DB_FOLDER = path.join(__dirname, process.env.DB_FOLDER ?? 'database');

if (fs.existsSync(DB_FOLDER)) fs.rmdirSync(DB_FOLDER, { force: true, recursive: true });
fs.mkdirSync(DB_FOLDER);
const DB_COUNTER_FILE = path.join(DB_FOLDER, '0');
fs.writeFileSync(DB_COUNTER_FILE, '0');

function isNumeric(v) {
    return typeof v == 'string' &&
        (/^-?\d+$/.test(v) || /^(\.|\d)+$/.test(v));
}

const assert = (v, cb) => cb(v) ? '' : (new Error('Assertion Failed'));

function getNextId(folder) {
    let current = 0;
    const DB_COUNTER_FILE = path.join(folder, '0');
    if (fs.existsSync(DB_COUNTER_FILE)) {
        current = parseInt(fs.readFileSync(DB_COUNTER_FILE, 'utf8')) || 0;
    }
    current++;
    fs.writeFileSync(DB_COUNTER_FILE, current.toString());
    return current.toString();
}

function write({ user_id, data_id, data }) {
    assert(user_id, isNumeric) || assert(data, (v) => typeof v == 'string');

    const USER_FOLDER = path.join(DB_FOLDER, user_id);
    if (!fs.existsSync(USER_FOLDER)) fs.mkdirSync(USER_FOLDER);

    if (!data_id) {
        data_id = getNextId(USER_FOLDER);
    } else {
        getNextId(USER_FOLDER); // counter++;
        assert(data_id, isNumeric);
    }

    const OUTPUT_PATH = path.join(USER_FOLDER, data_id);

    fs.writeFileSync(OUTPUT_PATH, data);

    return data_id;
}

function exist({ user_id, data_id }) {
    assert(user_id, isNumeric) || assert(data_id, isNumeric);

    const USER_FOLDER = path.join(DB_FOLDER, user_id);
    if (!fs.existsSync(USER_FOLDER)) return false;

    const FILE_PATH = path.join(USER_FOLDER, data_id);
    return fs.existsSync(FILE_PATH);
}

function read({ user_id, data_id }) {
    assert(user_id, isNumeric) || assert(data_id, isNumeric);

    const FILE_PATH = path.join(DB_FOLDER, user_id, data_id);
    if (!fs.existsSync(FILE_PATH)) throw new Error('File not found');

    return fs.readFileSync(FILE_PATH, 'utf8');
}

function update({ user_id, data_id, newData }) {
    assert(user_id, isNumeric) || assert(data_id, isNumeric) || assert(newData, (v) => typeof v == 'string');

    const FILE_PATH = path.join(DB_FOLDER, user_id, data_id);
    if (!fs.existsSync(FILE_PATH)) throw new Error('File not found');

    fs.writeFileSync(FILE_PATH, newData);
}

function remove({ user_id, data_id }) {
    assert(user_id, isNumeric) || assert(data_id, isNumeric);

    const FILE_PATH = path.join(DB_FOLDER, user_id, data_id);
    if (!fs.existsSync(FILE_PATH)) throw new Error('File not found');

    fs.unlinkSync(FILE_PATH);
}

function change_owner({ old_user_id, new_user_id, data_id }) {
    assert(old_user_id, isNumeric) || assert(new_user_id, isNumeric) || assert(data_id, isNumeric);

    const OLD_PATH = path.join(DB_FOLDER, old_user_id, data_id);
    if (!fs.existsSync(OLD_PATH)) throw new Error('File not found');

    if (new_user_id == '0') throw new Error('No admin');
    const NEW_USER_FOLDER = path.join(DB_FOLDER, new_user_id);
    if (!fs.existsSync(NEW_USER_FOLDER)) throw new Error('User not found');

    const NEW_USER_AUTH_PATH = path.join(NEW_USER_FOLDER, '1');

    if (fs.lstatSync(NEW_USER_AUTH_PATH).isFile()) throw new Error('User already exists');
    const NEW_PATH = path.join(NEW_USER_FOLDER, data_id);
    fs.renameSync(OLD_PATH, NEW_PATH);
}

module.exports = {
    DB_FOLDER,
    write,
    read,
    update,
    remove,
    change_owner,
    getNextId,
    exist
};
