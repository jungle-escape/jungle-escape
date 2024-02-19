// import "dotenv/config";

// import cors from "cors";
// import path from "path";
// import express from "express";
// import * as http from "http";
// import pn from "./custom_modules/playnetwork/src/server/index.js";
// import FileLevelProvider from "./file-level-provider.js";
// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);


// const app = express();
// app.use(cors());

// const pnPath = path.resolve(__dirname, "./custom_modules/playnetwork/dist/pn.js");
// const decodedPnPath = decodeURIComponent(pnPath);
// app.get("/pn.js", (_, res) => {
//   res.sendFile(decodedPnPath);
// });

// const server = http.createServer(app);
// server.listen(8080, "0.0.0.0");

// const componentsPath = path.resolve(__dirname, "components");
// const decodedComponentsPath = decodeURIComponent(componentsPath);
// const templatesPath = path.resolve(__dirname, "templates");
// const decodedTemplatesPath = decodeURIComponent(templatesPath);
// const levelsPath = path.resolve(__dirname, "levels");
// const decodedLevelsPath = decodeURIComponent(levelsPath);

// await pn.start({
//   redisUrl: 'redis://localhost:6379',
//   scriptsPath: decodedComponentsPath,
//   templatesPath: decodedTemplatesPath,
//   server: server,
//   useAmmo: true,
//   levelProvider: new FileLevelProvider(decodedLevelsPath),
// });

import "dotenv/config";

import cors from "cors";
import path from "path";
import express from "express";
import * as http from "http";
//for window
import os from "os";
import { fileURLToPath } from "url";
import pn from "./custom_modules/playnetwork/src/server/index.js";
import FileLevelProvider from "./file-level-provider.js";
//for window
const __filename =
  os.platform() === "win32"
    ? fileURLToPath(import.meta.url)
    : new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const pnPath = path.resolve(
  __dirname,
  "./custom_modules/playnetwork/dist/pn.js"
);
const decodedPnPath = decodeURIComponent(pnPath);
app.get("/pn.js", (_, res) => {
  res.sendFile(decodedPnPath);
});

const server = http.createServer(app);
server.listen(8080, "0.0.0.0");

const componentsPath = path.resolve(__dirname, "components");
const decodedComponentsPath = decodeURIComponent(componentsPath);
const templatesPath = path.resolve(__dirname, "templates");
const decodedTemplatesPath = decodeURIComponent(templatesPath);
const levelsPath = path.resolve(__dirname, "levels");
const decodedLevelsPath = decodeURIComponent(levelsPath);

await pn.start({
  redisUrl: "redis://localhost:6379",
  scriptsPath: decodedComponentsPath,
  templatesPath: decodedTemplatesPath,
  server: server,
  useAmmo: true,
  levelProvider: new FileLevelProvider(decodedLevelsPath),
});