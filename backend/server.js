require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3899;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const auth = require("./auth-core");
const wallet = require("./wallet-manager");
const tps = require("./tps-connect");
const card = require("./card-service");

app.use("/api/auth", auth.router);
app.use("/api/wallet", wallet.router);
app.use("/api/tps", tps.router);
app.use("/api/card", card.router);

app.get("/api/status", (req, res) => {
  res.json({
    system: "Rufio Sia Wallet",
    version: "2.1.0",
    owner: "usbpum244(neng)",
    online: true
  });
});

app.listen(PORT, () => {
  console.log(`✅ ทำงานที่พอร์ต ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
});

