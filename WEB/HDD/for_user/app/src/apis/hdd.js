const express = require("express");
const router = express.Router();
const db = require("../db");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { typeGuard } = require("../middlewares/guardMiddleware");

router.post(
    "/write",
    authMiddleware,
    typeGuard({ data: String, data_id: String }),
    (req, res) => {
        try {
            const { data, data_id } = req.body;
            const id = db.write({ user_id: req.user.id, data_id, data });
            res.json({ message: "Data written", data_id: id });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

router.get(
    "/read/:user_id/:data_id",
    authMiddleware,
    (req, res) => {
        try {
            const { user_id, data_id } = req.params;

            if (user_id != req.user.id && req.user.username != 'admin') return res.sendStatus(403);

            const data = db.read({ user_id, data_id });
            res.json({ data });
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }
);

router.put(
    "/update",
    authMiddleware,
    typeGuard({ data_id: String, newData: String }),
    (req, res) => {
        try {
            const { data_id, newData } = req.body;
            db.update({ user_id: req.user.id, data_id: data_id, newData });
            res.json({ message: "Data updated" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

router.delete(
    "/remove",
    authMiddleware,
    typeGuard({ data_id: String }),
    (req, res) => {
        try {
            const { data_id } = req.body;
            db.remove({ user_id: req.user.id, data_id: data_id });
            res.json({ message: "Data removed" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

router.put(
    "/change-owner",
    authMiddleware,
    typeGuard({ new_user_id: String, data_id: String }),
    (req, res) => {
        try {
            const { new_user_id, data_id } = req.body;
            db.change_owner({
                old_user_id: req.user.id,
                new_user_id: new_user_id,
                data_id: data_id
            });
            res.json({ message: "Owner changed" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

module.exports = router;
