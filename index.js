const express = require("express");
const path = require("path");
const { createBareServer } = require("@tomphttp/bare-server-node");

const app = express();
const bareServer = createBareServer("/bare/");

// =====================
// 1. Bare proxy FIRST
// =====================
app.use((req, res, next) => {
  if (bareServer.shouldRoute(req)) {
    return bareServer.routeRequest(req, res, next);
  }
  next();
});

// =====================
// 2. Static files SECOND
// =====================
app.use(express.static(path.join(__dirname), {
  extensions: ["js", "css", "html"]
}));

// =====================
// 3. ONLY fallback for HTML pages
//    (NOT JS FILES)
// =====================
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/uv/") || req.path.endsWith(".js")) {
    return next(); // IMPORTANT: do NOT hijack JS files
  }

  res.sendFile(path.join(__dirname, "index.html"));
});

module.exports = app;