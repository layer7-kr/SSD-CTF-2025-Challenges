const express = require("express");

const pool = require("../db");

const { typeGuard, sqlGuard } = require("../middlewares/guardMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/users", adminMiddleware, authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, username, email, role, created_at FROM users"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "서버 오류" });
    }
});

// TODO
router.post("/dev", adminMiddleware, authMiddleware, typeGuard({
    username: String,
    email: String
}), sqlGuard([
    'username', 'email'
]), async (req, res) => {
    const { username, email } = req.body;

    try {
        const [rows] = await pool.query(
            `SELECT id, username, email, role, created_at FROM users WHERE username='${username}' AND email='${email}'`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "서버 오류" });
    }
});

module.exports = router;
