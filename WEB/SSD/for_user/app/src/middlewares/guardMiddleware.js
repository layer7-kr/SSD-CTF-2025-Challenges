const express = require("express");

const router = express.Router();

/**
 * 
 * @param {Object} config - {"Name": "Type"} 
 * @returns 
 */
const typeGuard = (config) => {

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next
     */
    return (req, res, next) => {
        if (!config || typeof config !== 'object' || (req.method != 'POST' && req.method != 'PUT')) return next();

        let body = Object.create(null);

        for (const name in config) {
            const type = config[name];
            const value = name in req.body && req.body[name];

            if (typeof value !== typeof type() || value === undefined || value === null) return res.sendStatus(400);
            body[name] = value;
        }

        req.body = body;
        return next();
    }
}

/**
 * 
 * @param {Array} params 
 * @param {String} mode 
 * @returns 
 */
const sqlGuard = (params, mode = 'strict') => {
    STRICT = [
        "'", '-', '/', '*', '='
    ]

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next
     */
    if (mode == 'strict') return (req, res, next) => {
        for (name of params) {
            const value = req.body[name];
            if (typeof value != 'string') return res.sendStatus(400);

            if (STRICT.some((v, i) => value.includes(v))) return res.sendStatus(400);
        }
        return next();
    };
    else return (req, res, next) => { return next(); };
}

module.exports = {
    typeGuard,
    sqlGuard
}
