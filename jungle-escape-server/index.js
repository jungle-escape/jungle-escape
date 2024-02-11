import "dotenv/config";

import cors from "cors";
import path from "path";
import express from "express";
import * as http from "http";
// import * as https from 'https';
// import fs from 'fs';
import pn from "./custom_modules/playnetwork/src/server/index.js";

import FileLevelProvider from "./file-level-provider.js";

const app = express();
app.use(cors());
app.get("/pn.js", (_, res) => {
  res.sendFile(path.resolve("./custom_modules/playnetwork/dist/pn.js"));
});

// const key = fs.readFileSync('./ssl/localhost.key', 'utf8');
// const cert = fs.readFileSync('./ssl/localhost.crt', 'utf8');
// const credentials = { key, cert };

const server = http.createServer(app);
// const server = https.createServer(credentials, app);
server.listen(8080, "0.0.0.0");

await pn.start({
  redisUrl: 'redis://localhost:6379',
  scriptsPath: "components",
  templatesPath: "templates",
  server: server,
  useAmmo: true,
  levelProvider: new FileLevelProvider("levels"),
});
