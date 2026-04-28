require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const os = require("os");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

const vetRoutes = require("./routes/vets");
app.use("/api/vets", vetRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "PawAid API is running!" });
});

// This line is important for deployment —
// any URL that isn't an API route serves your index.html
app.get("*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
const HOST = "0.0.0.0";

function getNetworkUrls(port) {
  const interfaces = os.networkInterfaces();
  const urls = [];

  for (const entries of Object.values(interfaces)) {
    if (!entries) continue;

    for (const entry of entries) {
      const isIpv4 = entry.family === "IPv4" || entry.family === 4;
      if (isIpv4 && !entry.internal) {
        urls.push(`http://${entry.address}:${port}`);
      }
    }
  }

  return urls;
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);

      const networkUrls = getNetworkUrls(PORT);
      if (networkUrls.length > 0) {
        console.log("🌐 Network URL(s):");
        networkUrls.forEach((url) => console.log(`   ${url}`));
      }
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });
