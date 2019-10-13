'use strict';

// import * as nconf from "nconf";

// nconf.env().argv().file({ file: "./config.json" });

export class Config {
  constructor() {}

  public get(key: string): any {
    // return nconf.get(key);
  }
}
