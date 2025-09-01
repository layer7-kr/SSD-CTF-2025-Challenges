const express = require("express");
const pool = require("../db");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/data", authMiddleware, async (req, res) => {
    const { data_key, data_value } = req.body;

    if (!data_key || !data_value) {
        return res.status(400).json({ message: "data_key와 data_value를 입력하세요." });
    }

    try {
        await pool.query(
            "INSERT INTO datas (user_id, data_key, data_value) VALUES (?, ?, ?)",
            [req.user.id, data_key, data_value]
        );

        res.status(201).json({ message: "데이터 저장 성공" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "서버 오류" });
    }
});

router.get("/data", authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, data_key, data_value, created_at FROM datas WHERE user_id = ?",
            [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "서버 오류" });
    }
});

router.get("/data/:key", authMiddleware, async (req, res) => {
    const { key } = req.params;
    try {
        const [rows] = await pool.query(
            "SELECT id, data_key, data_value, created_at FROM datas WHERE user_id = ? AND data_key = ?",
            [req.user.id, key]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "데이터 없음" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "서버 오류" });
    }
});

router.delete("/data/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query(
            "DELETE FROM datas WHERE id = ? AND user_id = ?",
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "삭제할 데이터가 없습니다." });
        }

        res.json({ message: "데이터 삭제 성공" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "서버 오류" });
    }
});

module.exports = router;
