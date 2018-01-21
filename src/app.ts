"use strict";

import * as express from "express";
import * as favicon from "serve-favicon";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import * as cors from "cors";
import * as helmet from "helmet";
import * as lusca from "lusca";
import expressValidator = require("express-validator");
import { Express } from "express-serve-static-core";

/*** Configs *****************************************************************/
import { Config } from "./config/config";
import { logger } from "./config/logger";

const config: Config = new Config();

/*** Express configuration ***************************************************/
const app: Express = express();

app.set("name", config.get("name"));
app.set("port", config.get("port") || 3000);
app.set("env", config.get("env") || "production");

logger.info(`Application started in ${app.get("env")} mode`);

// Morgan logger
app.use(require("morgan")(
  app.get("env") === "development" ? "dev" : "short",
  // attach morgan to winston
  { stream: { write: (message: string) => logger.verbose(message.slice(0, -1))}},
));

// Security middleware
app.use(cors());
app.use(helmet());
app.disable("x-powered-by");
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(favicon(path.join(__dirname, "public", "images", "favicon.png")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

/*** Routes ******************************************************************/
require("./routes").indexRoutes(app);

/*** Error Handler ***********************************************************/
interface ResponseError extends Error { status?: number; }

// 404
app.use((req: express.Request, res: express.Response, next: Function) => {
  const err: ResponseError = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err: ResponseError, req: express.Request, res: express.Response, next: Function) => {
  res.status(err.status || 500)
    .render("error", {
      title: app.get("name"),
      message: err.message,
      error: app.get("env") === "development" ? err : {},
    });
});

/*****************************************************************************/
module.exports = app;
