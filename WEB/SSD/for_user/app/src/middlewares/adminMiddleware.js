function adminMiddleware(req, res, next) {
    if (req.user && req.user.role !== "admin") {
        return res.sendStatus(403);
    }
    return next();
}

module.exports = { adminMiddleware };
