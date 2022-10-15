module.exports = {
  sendResponse: function(res, data, jsonp) {
    res.status(200);
    if (jsonp) {
      res.jsonp(data);
    } else {
      //res.set("Connection", "close");
      res.send(data);
    }

    //res.end();
  },
  returnError: function(res, error, jsonp, errorCode) {
    errorCode = errorCode ? errorCode : 500;
    res.status(errorCode);
    if (jsonp) {
      res.jsonp({
        err: this.errorMessage[errorCode]
      });
    } else {
      res.send({
        error: this.errorMessage[errorCode]
      });
    }
  },
  writeResponse: function(res, data, jsonp, endflag) {
    res.status(200);
    if (jsonp) {
      res.jsonp(data);
    } else {
      res.write(JSON.stringify(data));
    }
  },
  sendErrorResponse: function(res, statusCode, data, jsonp) {
    // log.log(log.errorLevel.Error, statusCode + " " + data);
    if (statusCode === "ENETUNREACH") {
      res.status(500);
      res.send({
        Error: "Required service is not running. Please contact administrator"
      });
    } else {
      if (jsonp) {
        res.jsonp(data);
      } else {
        res.send(data);
      }
    }
    res.end();
  },
  customResponse: async (res, data, resCode) => {
    res.status(resCode).json(data);
  }
};
