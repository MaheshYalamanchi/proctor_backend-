"use strict";
(function(appConfig) {
    // *** main dependencies *** //
    
    // const express = require("express");
    const path = require("path");
    const cookieParser = require("cookie-parser");
    const logger = require("morgan");
    const bodyParser = require("body-parser");
  
  
    // *** load environment variables *** //
    require("dotenv").config();
  
    appConfig.init = function(app, express) {
      // view engine setup
      app.set("views", path.join(__dirname, "../views"));
      app.set("view engine", "ejs");
  
      app.use(logger("dev"));
      // app.use(express.json());
      // app.use(
      //   express.urlencoded({
      //     extended: true
      //   })
      // );
      // app.use(
      //   bodyParser.urlencoded({
      //     extended: true
      //   })
      // );
      app.use(cookieParser("secret"));
    //   app.use(
    //     // session({
    //     //   secret: "valucart",
    //     //   proxy: true,
    //     //   resave: true,
    //     //   saveUninitialized: true
    //     // })
    //   );
    
      /**bodyParser.json(options)
       * Parses the text as JSON and exposes the resulting object on req.body.
       */
      app.use(function(req, res, next) {
        // res.locals.flashdata = req.flash();
        // res.locals.moment = moment;
        // res.locals._ = _;
        res.locals.baseURL = req.headers.host;
        next();
      });
      // app.use(bodyParser.json());
      app.use(bodyParser.json({limit: '1000mb', extended: true}))
      app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}))
      app.use(express.static(path.join(__dirname, "../public")));
    };
  })(module.exports);
  