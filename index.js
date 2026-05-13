const express = require("express");
const path = require("path");
const { createBareServer } = require("@tomphttp/bare-server-node");

const app = express();
const bareServer = createBareServer("/bare/");

// =====================
// Serve static frontend
// =====================
app.use(express.static(path.join(__dirname)));

// =====================
// Bare proxy routing
// =====================
app.use((req, res, next) => {
  if (bareServer.shouldRoute(req)) {
    return bareServer.routeRequest(req, res, next);
  }
  next();
});

// =====================
// SPA fallback (ONLY if you want index.html routing)
// =====================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Export for Vercel (IMPORTANT)
module.exports = app;