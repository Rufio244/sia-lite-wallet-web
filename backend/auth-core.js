const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const db = require("./db-schema");

const JWT_SECRET = process.env.JWT_SECRET || "dev_change_me";
const OWNER_PASS = "usbpum244(neng)";

async function hashPass(pw) { return bcrypt.hash(pw, 12); }
async function checkPass(pw, hash) { return bcrypt.compare(pw, hash); }

function makeToken(user) {
  return jwt.sign(
    { id: user.id, user: user.username, isOwner: !!user.is_owner },
    JWT_SECRET, { expiresIn: "30d" }
  );
}

router.post("/login", async (req, res) => {
  const { user, pass } = req.body;
  const u = db.prepare("SELECT * FROM users WHERE username=?").get(user);
  if (!u) return res.json({ e: "ไม่พบผู้ใช้" });
  if (!(await checkPass(pass, u.password_hash))) return res.json({ e: "ผิด" });
  res.json({ ok: true, token: makeToken(u), isOwner: !!u.is_owner });
});

router.post("/reg", async (req, res) => {
  const { user, pass } = req.body;
  const isOwner = pass === OWNER_PASS ? 1 : 0;
  const h = await hashPass(pass);
  db.prepare("INSERT INTO users (username,password_hash,is_owner) VALUES (?,?,?)")
    .run(user, h, isOwner);
  res.json({ ok: true, isOwner });
});

function protect(req, res, next) {
  const t = req.headers.authorization?.replace("Bearer ","");
  if (!t) return res.status(401).json({e:"ต้องเข้าสู่ระบบ"});
  try { req.usr = jwt.verify(t, JWT_SECRET); next(); }
  catch { res.status(401).json({e:"Token ไม่ถูก"}); }
}

function ownerOnly(req, res, next) {
  if (!req.usr.isOwner) return res.status(403).json({e:"เฉพาะเจ้าของ"});
  next();
}

module.exports = { router, protect, ownerOnly };

