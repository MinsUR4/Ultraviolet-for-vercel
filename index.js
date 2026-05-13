const express = require("express");
const path = require("path");
const { createBareServer } = require("@tomphttp/bare-server-node");

const app = express();
const bareServer = createBareServer("/bare/");

// Bare proxy FIRST
app.use((req, res, next) => {
  if (bareServer.shouldRoute(req)) {
    return bareServer.routeRequest(req, res, next);
  }
  next();
});

// ONLY serve index.html fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

module.exports = app;