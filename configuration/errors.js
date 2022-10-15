(function(errorConfig) {
    "use strict";
  
    // *** error handling *** //
  
    errorConfig.init = function(app) {
      // catch 404 and forward to error handler
      app.use(function(req, res, next) {
        const err = new Error("Not Found");
        err.status = 404;
        res.render("404");
      });
  
      // development error handler (will print stacktrace)
      if (app.get("env") === "development") {
        app.use(function(err, req, res, next) {
          res.status(err.status || 500).json({
            message: err.message,
            error: err
          });
        });
      }
  
      // production error handler (no stacktraces leaked to user)
      app.use(function(err, req, res, next) {
        res.status(err.status || 500).json({
          message: err.message,
          error: {}
        });
      });
      app.post("/", function(req, res) {
       // console.log(req.body);
      });
    };
  })(module.exports);
  error_404 = function(res) {
    res.render("404");
  };
  