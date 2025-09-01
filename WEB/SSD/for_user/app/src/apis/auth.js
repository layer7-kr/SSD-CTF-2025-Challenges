const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const SECRET_KEY = process.env.SECRET_KEY ?? "SECRET_KEY";
const { typeGuard } = require("../middlewares/guardMiddleware");

const router = express.Router();

router.post("/register", typeGuard({
    username: String,
    email: String,
    password: String
}), async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "회원가입 성공" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "서버 오류" });
    }
});

router.post("/login", typeGuard({
    email: String,
    password: String
}), async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({ message: "로그인 성공", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "서버 오류" });
    }
});

module.exports = router;
