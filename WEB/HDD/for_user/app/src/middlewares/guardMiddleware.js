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
        if (!config || typeof config !== 'object' || (req.method != 'POST' && req.method != 'PUT' && req.method != 'DELETE')) return next();

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

module.exports = {
    typeGuard
}
