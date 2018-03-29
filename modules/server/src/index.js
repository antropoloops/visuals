/* eslint-disable no-console */
const logger = require("winston");
const app = require("./app");
const config = require("config");
const ip = require("ip");

const port = config.get("port");
const server = app.listen(port);

console.log("IP", ip.address());
const oscServer = require("./osc");

oscServer.open();

oscServer.on("open", () => {
  console.log("OSC server started");
  console.log("OSC", oscServer, Object.keys(oscServer));
});

process.on("unhandledRejection", (reason, p) =>
  logger.error("Unhandled Rejection at: Promise ", p, reason)
);

server.on("listening", () =>
  logger.info(
    "Antropoloops server started on http://%s:%d",
    app.get("host"),
    port
  )
);
