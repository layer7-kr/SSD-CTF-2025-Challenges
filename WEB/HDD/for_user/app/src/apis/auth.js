const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { typeGuard } = require("../middlewares/guardMiddleware");

const SECRET_KEY = process.env.SECRET_KEY ?? "SECRET_KEY";
const router = express.Router();

router.post("/register", typeGuard({
    username: String,
    password: String
}), async (req, res) => {
    const { username, password } = req.body;

    if (username == 'admin') return res.sendStatus(401);

    const user_id = db.getNextId(db.DB_FOLDER);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            id: user_id,
            username,
            password: hashedPassword
        };
        db.write({
            user_id: user_id,
            data_id: "1",
            data: JSON.stringify(user)
        });
        res.status(201).json({ message: "회원가입 성공", user_id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "서버 오류" });
    }
});

router.post("/login", typeGuard({
    user_id: String,
    password: String
}), async (req, res) => {
    const { user_id, password } = req.body;
    try {
        if (!db.exist({ user_id, data_id: "1" })) return res.status(401);
        const user = db.read({ user_id, data_id: "1" });
        const parsed = JSON.parse(user)

        const isMatch = await bcrypt.compare(password, parsed.password);
        if (!isMatch) {
            return res.status(401);
        }
        const token = jwt.sign(
            { id: parsed.id, username: parsed.username, email: parsed.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );
        res.json({ message: "로그인 성공", token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "서버 오류" });
    }
});

module.exports = router;
