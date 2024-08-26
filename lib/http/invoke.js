var httpReq = require("request");
var Config = require("../../configuration");
const qs = require('querystring');
const axiosConfig = require("../../lib/http/axios").instance;
const userConfig = require("../../lib/http/axios").userservice;
const axiosConfigSocketIo = require("../../lib/http/axios").instance_socket_io;
const axiosConfigMapReduce = require("../../lib/http/axios").instance_mapReduce;
const axiosConfigReportService = require("../../lib/http/axios").report_serivice;
const axiosConfig_userDataService = require("../../lib/http/axios").user_instance;
const axiosConfig_roomDataService = require("../../lib/http/axios").room_instance;
const axiosConfig_commonDataService  = require("../../lib/http/axios").common_instance;
const axios = require("axios");
const { exit } = require("process");
var qArray = [];
var q = {
  url: "http://localhost:3000/",
  client: "",
  query: {},
  docType: "",
  selector: ""
},
  options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: ""
  };
module.exports = {
  makeHTTPRequest: function (reqOptions, callback, errorCallback) {
    reqOptions.gzip = true;
    reqOptions.timeout = "1200000";
    httpReq = require("request");
    httpReq(reqOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (body === "") {
          callback({ message: "no result found" });
        } else {
          var info = JSON.parse(body);
          callback(info);
        }
      } else {
        callback({ error: true, message: body != "" ? body : error }, null);
      }
    });
  },
  getSVCPostRequestJSON: function (
    req,
    res,
    cSession,
    url,
    client,
    method,
    selector,
    docType,
    callback,
    svcURL,
    errorCallback
  ) {
    try {
      console.log(req);
      var that = this;
      var requestJSON = [],
        query = cSession;
      var reqQuery = JSON.parse(JSON.stringify(q));
      options.url = svcURL;
      var reqOptions = JSON.parse(JSON.stringify(options));
      reqOptions.url = url;
      reqOptions.body = JSON.stringify(query);
      reqOptions.method = method;

      that.makeHTTPRequest(
        reqOptions,
        function (response) {
          if (!callback) {
            if (!response || response.statusCode !== 200) {
              that.sendErrorResponse(
                res,
                response.statusCode,
                response.statusMessage
              );
            } else {
              that.sendResponse(res, response);
            }
          } else {
            callback(response);
          }
        },
        errorCallback
      );
    } catch (error) {
      logs.log(
        logs.errorLevel.Error,
        "common.getPostRequestJSON : " + url + "\n" + error
      );
      if (errorCallback) {
        errorCallback(error);
      } else {
        throw error;
      }
    }
  },
  getPostRequestJSON: function (
    req,
    res,
    cSession,
    url,
    client,
    method,
    selector,
    docType,
    callback,
    svcURL,
    errorCallback
  ) {
    try {
      var that = this;
      var requestJSON = [],
        query = cSession.b;
      if (query.mid && !(query.mid instanceof Array)) {
        if (
          query.mid !== undefined &&
          query.mid !== null &&
          !query.mid._bsontype
        ) {
          query.mid = query.mid.replace(":", "");
        }
        if (
          query._id !== undefined &&
          query._id !== null &&
          !query._id._bsontype
        ) {
          query._id = query._id.replace(":", "");
        }
      }
      var reqQuery = JSON.parse(JSON.stringify(q));
      options.url = svcURL;
      var reqOptions = JSON.parse(JSON.stringify(options));
      (reqQuery.url = cSession.db);
      (reqQuery.client = client);
      (reqQuery.query = query);
      (reqQuery.database = cSession.database);
      (reqQuery.dbsource = cSession.b ? cSession.dbsource : null);
      (reqQuery.store = cSession.store);
      (reqQuery.docType = docType);
      (reqQuery.selector = selector);
      //reqQuery.res = JSON.stringify(res);
      reqOptions.url = url;
      reqOptions.body = JSON.stringify(reqQuery);
      reqOptions.method = method;

      that.makeHTTPRequest(
        reqOptions,
        function (response) {
          if (!callback) {
            if (!response || response.statusCode !== 200) {
              that.sendErrorResponse(
                res,
                response.statusCode,
                response.statusMessage
              );
            } else {
              that.sendResponse(res, response);
            }
          } else {
            callback(response);
          }
        },
        errorCallback
      );
    } catch (error) {
      logs.log(
        logs.errorLevel.Error,
        "common.getPostRequestJSON : " + url + "\n" + error
      );
      if (errorCallback) {
        errorCallback(error);
      } else {
        throw error;
      }
    }
  },
  getGetRequestJSON: function (
    req,
    res,
    cSession,
    url,
    client,
    method,
    selector,
    docType,
    callback,
    svcURL,
    errorCallback
  ) {
    try {
      var that = this;
      var requestJSON = [],
        query = cSession.q;
      if (
        query.mid !== undefined &&
        query.mid !== null &&
        !query.mid._bsontype
      ) {
        query.mid = query.mid.replace(":", "");
      }
      if (
        query._id !== undefined &&
        query._id !== null &&
        !query._id._bsontype
      ) {
        query._id = query._id.replace(":", "");
      }
      var reqQuery = JSON.parse(JSON.stringify(q));
      options.url = svcURL;
      var reqOptions = JSON.parse(JSON.stringify(options));
      (reqQuery.url = cSession.db);
      (reqQuery.client = client);
      (reqQuery.database = cSession.database);
      (reqQuery.dbsource = cSession.b ? cSession.b.dbsource : null);
      (reqQuery.query = query);
      (reqQuery.docType = docType);
      (reqQuery.selector = selector);
      reqOptions.url = url;
      reqOptions.body = JSON.stringify(reqQuery);
      reqOptions.method = method;
      that.makeHTTPRequest(
        reqOptions,
        function (data) {
          if (!data || (data.error && res)) {
            res.send(
              JSON.stringify({
                statusCode: 500,
                statusMessage: "Service not running"
              })
            );
          } else {
            callback(data);
          }
        },
        errorCallback
      );
    } catch (error) {
      logs.log(
        logs.errorLevel.Error,
        "common.getGetRequestJSON : " + url + "\n" + error
      );
      if (errorCallback) {
        errorCallback(error);
      } else {
        throw error;
      }
    }
  },
  makeHttpCall: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCall(url);
        break;
      case "post":
        return await this.makePostCall(url, postParam);
        break;
      case "put":
        return await this.makePutCall(url, postParam);
        break;
      case "patch":
        return await this.makePatchCall(url, postParam);
        break;
    }
  },
  makeGetCall: async function (url, postParam) {
    let config = axiosConfig;
    // getparam["headers"] = {
    //   Authorization: "Bearer " + cookies.token
    // };
    return await axios.get(url, config);
  },
  makePostCall: async function (url, postParam) {
    let config = axiosConfig;
    return await axios.post(url, postParam, config);
  },
  makePutCall: async function (url, postParam) {
    let config = axiosConfig;
    return await axios.put(url, postParam, config);
  },
  makePatchCall: async function (url, postParam) {
    let config = axiosConfig;
    return await axios.patch(url, postParam, config);
  },
  //socket io connection
  makeHttpCallSocket: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallSocket(url);
        break;
      case "post":
        return await this.makePostCallSocket(url, postParam);
        break;
      case "put":
        return await this.makePutCallSocket(url, postParam);
        break;
      case "patch":
        return await this.makePatchCallSocket(url, postParam);
        break;
    }
  },
  makeGetCallSocket: async function (url, postParam) {
    let config = axiosConfigSocketIo;
    // getparam["headers"] = {
    //   Authorization: "Bearer " + cookies.token
    // };
    return await axios.get(url, config);
  },
  makePostCallSocket: async function (url, postParam) {
    let config = axiosConfigSocketIo;
    return await axios.post(url, postParam, config);
  },
  makePutCallSocket: async function (url, postParam) {
    let config = axiosConfigSocketIo;
    return await axios.put(url, postParam, config);
  },
  makePatchCallSocket: async function (url, postParam) {
    let config = axiosConfigSocketIo;
    return await axios.patch(url, postParam, config);
  },
  makeHttpCallmapReduce: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallmapReduce(url);
        break;
      case "post":
        return await this.makePostCallmapReduce(url, postParam);
        break;
      case "put":
        return await this.makePutCallmapReduce(url, postParam);
        break;
      case "patch":
        return await this.makePatchCallmapReduce(url, postParam);
        break;
    }
  },
  makeGetCallmapReduce: async function (url, postParam) {
    let config = axiosConfigMapReduce;
    // getparam["headers"] = {
    //   Authorization: "Bearer " + cookies.token
    // };
    return await axios.get(url, config);
  },
  makePostCallmapReduce: async function (url, postParam) {
    let config = axiosConfigMapReduce;
    return await axios.post(url, postParam, config);
  },
  makePutCallmapReduce: async function (url, postParam) {
    let config = axiosConfigMapReduce;
    return await axios.put(url, postParam, config);
  },
  makePatchCallmapReduce: async function (url, postParam) {
    let config = axiosConfigMapReduce;
    return await axios.patch(url, postParam, config);
  },
  makeHttpCallReportService: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallReportService(url);
        break;
      case "post":
        return await this.makePostCallReportService(url, postParam);
        break;
      case "put":
        return await this.makePutCallReportService(url, postParam);
        break;
      case "patch":
        return await this.makePatchCallReportService(url, postParam);
        break;
    }
  },
  makeGetCallReportService: async function (url, postParam) {
    let config = axiosConfigReportService;
    // getparam["headers"] = {
    //   Authorization: "Bearer " + cookies.token
    // };
    return await axios.get(url, config);
  },
  makePostCallReportService: async function (url, postParam) {
    let config = axiosConfigReportService;
    return await axios.post(url, postParam, config);
  },
  makePutCallReportService: async function (url, postParam) {
    let config = axiosConfigReportService;
    return await axios.put(url, postParam, config);
  },
  makePatchCallReportService: async function (url, postParam) {
    let config = axiosConfigReportService;
    return await axios.patch(url, postParam, config);
  },
   //userservice service call
   makeHttpCalluserservice: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.userserviceGetCall(url);
        break;
      case "post":
        return await this.userservicePostCall(url, postParam);
        break;
      case "put":
        return await this.userservicePutCall(url, postParam);
        break;
      case "patch":
        return await this.userservicePatchCall(url, postParam);
        break;
      case "delete":
        return await this.userserviceDeleteCall(url);
        break;
    }
  },
  userserviceGetCall: async function (url) {
    let config = userConfig;
    // config["headers"] = {
    //   Authorization: postParam.headers
    // };
    return await axios.get(url, config);
  },
  userservicePostCall: async function (url, postParam) {
    let config = userConfig;
    // config["headers"] = {
    //   authorization: postParam.authorization
    // };
    return await axios.post(url, postParam, config);
  },
  userservicePutCall: async function (url, postParam) {
    let config = userConfig;
    return await axios.put(url, postParam, config);
  },
  userservicePatchCall: async function (url, postParam) {
    let config = userConfig;
    return await axios.patch(url, postParam, config);
  },
  userserviceDeleteCall: async function (url) {
    let config = userConfig;
    return await axios.delete(url, config);
  },
  makeHttpCall_userDataService: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCall_userDataService(url);
        break;
      case "post":
        return await this.makePostCall_userDataService(url, postParam);
        break;
      case "put":
        return await this.makePutCall_userDataService(url, postParam);
        break;
      case "patch":
        return await this.makePatchCall_userDataService(url, postParam);
        break;
      case "delete":
        return await this.makeDeleteCall_userDataService(url);
        break;
    }
  },
  makeGetCall_userDataService: async function (url) {
    let config = axiosConfig_userDataService;
    // config["headers"] = {
    //   Authorization: postParam.headers
    // };
    return await axios.get(url, config);
  },
  makePostCall_userDataService: async function (url, postParam) {
    let config = axiosConfig_userDataService;
    // config["headers"] = {
    //   authorization: postParam.authorization
    // };
    return await axios.post(url, postParam, config);
  },
  makePutCall_userDataService: async function (url, postParam) {
    let config = axiosConfig_userDataService;
    return await axios.put(url, postParam, config);
  },
  makePatchCall_userDataService: async function (url, postParam) {
    let config = axiosConfig_userDataService;
    return await axios.patch(url, postParam, config);
  },
  makeDeleteCal_userDataService: async function (url) {
    let config = axiosConfig_userDataService;
    return await axios.delete(url, config);
  },
  makeHttpCall_roomDataService: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCall_roomDataService(url);
        break;
      case "post":
        return await this.makePostCall_roomDataService(url, postParam);
        break;
      case "put":
        return await this.makePutCall_roomDataService(url, postParam);
        break;
      case "patch":
        return await this.makePatchCall_roomDataService(url, postParam);
        break;
      case "delete":
        return await this.makeDeleteCall_roomDataService(url);
        break;
    }
  },
  makeGetCall_roomDataService: async function (url) {
    let config = axiosConfig_roomDataService;
    // config["headers"] = {
    //   Authorization: postParam.headers
    // };
    return await axios.get(url, config);
  },
  makePostCall_roomDataService: async function (url, postParam) {
    let config = axiosConfig_roomDataService;
    // config["headers"] = {
    //   authorization: postParam.authorization
    // };
    return await axios.post(url, postParam, config);
  },
  makePutCall_roomDataService: async function (url, postParam) {
    let config = axiosConfig_roomDataService;
    return await axios.put(url, postParam, config);
  },
  makePatchCall_roomDataService: async function (url, postParam) {
    let config = axiosConfig_roomDataService;
    return await axios.patch(url, postParam, config);
  },
  makeDeleteCall_roomDataService: async function (url) {
    let config = axiosConfig_roomDataService;
    return await axios.delete(url, config);
  },
  makeHttpCall_commonDataService: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCall_commonDataService(url);
        break;
      case "post":
        return await this.makePostCall_commonDataService(url, postParam);
        break;
      case "put":
        return await this.makePutCall_commonDataService(url, postParam);
        break;
      case "patch":
        return await this.makePatchCall_commonDataService(url, postParam);
        break;
      case "delete":
        return await this.makeDeleteCall_commonDataService(url);
        break;
    }
  },
  makeGetCall_commonDataService: async function (url) {
    let config = axiosConfig_commonDataService;
    // config["headers"] = {
    //   Authorization: postParam.headers
    // };
    return await axios.get(url, config);
  },
  makePostCall_commonDataService: async function (url, postParam) {
    let config = axiosConfig_commonDataService;
    // config["headers"] = {
    //   authorization: postParam.authorization
    // };
    return await axios.post(url, postParam, config);
  },
  makePutCall_commonDataService: async function (url, postParam) {
    let config = axiosConfig_commonDataService;
    return await axios.put(url, postParam, config);
  },
  makePatchCall_commonDataService: async function (url, postParam) {
    let config = axiosConfig_commonDataService;
    return await axios.patch(url, postParam, config);
  },
  makeDeleteCall_commonDataService: async function (url) {
    let config = axiosConfig_commonDataService;
    return await axios.delete(url, config);
  },
};
