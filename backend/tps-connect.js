const express = require("express");
const router = express.Router();
const axios = require("axios");
const { protect } = require("./auth-core");

router.use(protect);
const TPS_URL = process.env.TPS_API_URL || "";
const TPS_KEY = process.env.TPS_API_KEY || "";

router.post("/deposit", async (req, res) => {
  const { address, amount } = req.body;
  try {
    const r = await axios.post(`${TPS_URL}/deposit`, {
      user: req.usr.id, address, amount, currency: "SC"
    }, { headers: { Authorization: `Bearer ${TPS_KEY}` } });
    res.json({ ok: true, tps: r.data });
  } catch(e) {
    res.json({ ok: false, e: e.message });
  }
});

router.post("/withdraw", async (req, res) => {
  const { amount, toAddr } = req.body;
  res.json({ ok: true, status: "pending", to: toAddr, amount });
});

module.exports = { router };

