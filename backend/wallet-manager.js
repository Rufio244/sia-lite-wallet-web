const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const db = require("./db-schema");
const { protect, ownerOnly } = require("./auth-core");

router.use(protect);

function makeAddr() {
  return "107b" + crypto.randomBytes(30).toString("hex");
}

router.post("/create", (req, res) => {
  const addr = makeAddr();
  const { label = "" } = req.body;
  db.prepare("INSERT INTO wallets (user_id,address,label) VALUES (?,?,?)")
    .run(req.usr.id, addr, label);
  res.json({ ok: true, address: addr, label });
});

router.get("/my", (req, res) => {
  res.json(db.prepare("SELECT * FROM wallets WHERE user_id=?").all(req.usr.id));
});

router.get("/all", ownerOnly, (req, res) => {
  res.prepare("SELECT w.*,u.username FROM wallets w JOIN users u ON w.user_id=u.id")
    .all((e, r) => res.json(r));
});

module.exports = { router };

