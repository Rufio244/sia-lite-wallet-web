const express = require("express");
const router = express.Router();
const { protect } = require("./auth-core");
const crypto = require("crypto");

router.use(protect);

function makeCardNum() {
  return Array.from({length:4}, () => crypto.randomBytes(2).toString("hex").toUpperCase())
    .join("-");
}

router.post("/issue", (req, res) => {
  const card = {
    id: crypto.randomUUID(),
    number: makeCardNum(),
    holder: req.usr.user,
    limit: req.body.limit || 0,
    active: true
  };
  res.json({ ok: true, card });
});

router.get("/my", (req, res) => {
  res.json([{ number: "XXXX-XXXX-XXXX-XXXX", holder: req.usr.user }]);
});

module.exports = { router };

