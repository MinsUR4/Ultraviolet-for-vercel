const http = require("node:http");
const { createBareServer } = require("@tomphttp/bare-server-node");
const express = require("express");
const path = require("path");

const bareServer = createBareServer("/bare/");
const app = express();

// Serve all static files from the project root
app.use(express.static(path.join(__dirname), { index: "index.html" }));

// Fallback for any unmatched routes
app.use((req, res) => {
  res.status(404).send("Not found.");
});

const httpServer = http.createServer((req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

httpServer.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

httpServer.listen(8000, () => {
  console.log("HTTP server listening on port 8000");
});