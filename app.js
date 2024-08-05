
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//global error handling
const errorConfig = require("./configuration/errors");
//configure the engine
const appConfig = require("./configuration/appconfig");
var cors = require("cors");

var app = express();
appConfig.init(app, express);
app.use(cookieParser());
app.use(cors());
app.logger = require("./logger/logger");

require("./routes/auth/index")({ app: app });
require("./routes/shared/index")({ app: app });
require("./routes/schedule/index")({ app: app });


app.http = require("./lib/util/http");
app.util = require("./lib/util/parser");
app.invoke = require("./lib/http/invoke");
var request = require('request')
var CronJob = require('cron').CronJob;
const axios = require('axios'); 
new CronJob('*/2 * * * *', async function () {
  try {
    const response = await axios.get(process.env.PAUSE_ENDPOINT);
    if (response.status === 200) {
      console.log('You will see this message every 2 minutes (Pause)');
    }
  } catch (error) {
    if (error.response) {
      console.log(`PauseErrorLog====>>>> Status: ${error.response.status}`);
    } else if (error.request) {
      console.log('PauseErrorLog====>>>> No response received:', error.request);
    } else {
      console.log('PauseCatchLog====>>>>', error.message);
    }
  }
}, null, true, "Asia/Calcutta")

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



errorConfig.init(app);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
});

module.exports = app;
var server = app.listen(3002, function () {
  console.log("proctor Service...")
});
