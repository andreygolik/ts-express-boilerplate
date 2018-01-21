"use strict";

import * as express from "express";
import * as path from "path";
import { Express } from "express-serve-static-core";

export function indexRoutes(app: Express): void {
  // Index Page
  app.get("/", (req, res) => {
    res.render("index", {
      title: app.get("name")
    });
  });

  // Static routes
  app.use(express.static(path.join(__dirname, "public")));
}
