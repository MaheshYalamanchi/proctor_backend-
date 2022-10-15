var httpReq = require("request");
var Config = require("../../configuration");
const qs = require('querystring');
const axiosConfig = require("../../lib/http/axios").instance;
const axiosConfigpolyglot = require("../../lib/http/axios").instance_polyglot;
const axiosConfigpolyglotcms = require("../../lib/http/axios").instance_polyglot_cms;
const openedxaxiosConfig = require('../../lib/http/axios').openedx_instance;
const courseaxiosConfig = require('../../lib/http/axios').course_instance; 
const useraxiosConfig = require('../../lib/http/axios').user_instance; 
const auditaxiosConfig = require('../../lib/http/axios').audit_instance;  
const nodebbaxiosConfig = require('../../lib/http/axios').nodebb_instance;  
const elasticaxiosConfig = require('../../lib/http/axios').elastic_instance; 
const NotifyaxiosConfig = require('../../lib/http/axios').notification_instance; 
const portalaxiosConfig = require('../../lib/http/axios').portal_instance;  
const smartServiceaxiosConfig = require('../../lib/http/axios').instance_SMARTSERVICE;
const stepConfig = require('../../lib/http/axios').stepServiceInstance; 
const axios = require("axios");
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
  makeHttpCallpolyglot: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallpolyglot(url);
        break;
      case "post":
        return await this.makePostCallpolyglot(url, postParam);
        break;
      case "put":
        return await this.makePutCallpolyglot(url, postParam);
        break;
      case "patch":
        return await this.makePatchCallpolyglot(url, postParam);
        break;
    }
  },
  makeGetCallpolyglot: async function (url, postParam) {
    let config = axiosConfigpolyglot;
    // getparam["headers"] = {
    //   Authorization: "Bearer " + cookies.token
    // };
    return await axios.get(url, config);
  },
  makePostCallpolyglot: async function (url, postParam) {
    let config = axiosConfigpolyglot;
    return await axios.post(url, qs.stringify(postParam), config);
  },
  makePutCallpolyglot: async function (url, postParam) {
    let config = axiosConfigpolyglot;
    return await axios.put(url, postParam, config);
  },
  makePatchCallpolyglot: async function (url, postParam) {
    let config = axiosConfigpolyglot;
    return await axios.patch(url, postParam, config);
  },
  //////////////////////
  makeHttpCallpolyglotCMS: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallpolyglotcms(url);
        break;
      case "post":
        return await this.makePostCallpolyglotcms(url, postParam);
        break;
      case "put":
        return await this.makePutCallpolyglotcms(url, postParam);
        break;
      case "patch":
        return await this.makePatchCallpolyglotcms(url, postParam);
        break;
    }
  },
  makeGetCallpolyglotcms: async function (url, postParam) {
    let config = axiosConfigpolyglotcms;
    // getparam["headers"] = {
    //   Authorization: "Bearer " + cookies.token
    // };
    return await axios.get(url, config);
  },
  makePostCallpolyglotcms: async function (url, postParam) {
    let config = axiosConfigpolyglotcms;
    return await axios.post(url, postParam, config);
  },
  makePutCallpolyglotcms: async function (url, postParam) {
    let config = axiosConfigpolyglotcms;
    return await axios.put(url, postParam, config);
  },
  makePatchCallpolyglotcms: async function (url, postParam) {
    let config = axiosConfigpolyglotcms;
    return await axios.patch(url, postParam, config);
  },
  openedxCall: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.openedxCallGetCall(url);
        break;
      case "post":
        return await this.openedxCallPostCall(url, postParam);
        break;
      case "put":
        return await this.openedxCallPutCall(url, postParam);
        break;
      case "patch":
        return await this.openedxCallPatchCall(url, postParam);
        break;
    }
  },
  openedxCallGetCall: async function (url, postParam) {
    let config = openedxaxiosConfig;
    return axios.get(url, config);
  },
  openedxCallPostCall: async function (url, postParam) {
    let config = openedxaxiosConfig;
    return await axios.post(url, qs.stringify(postParam), config)
  },
  openedxCallPutCall: async function (url, postParam) {
    let config = openedxaxiosConfig;
    return await axios.put(url, postParam, config);
  },
  openedxCallPatchCall: async function (url, postParam) {
    let config = openedxaxiosConfig;
    return await axios.patch(url, postParam, config);
  },
  courseCall: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.courseCallGet(url);
        break;
      case "post":
        return await this.courseCallPost(url, postParam);
        break;
      case "put":
        return await this.courseCallPut(url, postParam);
        break;
      case "patch":
        return await this.courseCallPatch(url, postParam);
        break;
    }
  },
  courseCallGet: async function (url, postParam) {
    let config = courseaxiosConfig;
    return axios.get(url, config);
  },
  courseCallPost: async function (url, postParam) {
    let config = courseaxiosConfig;
    return await axios.post(url, postParam, config)
  },
  courseCallPut: async function (url, postParam) {
    let config = courseaxiosConfig;
    return await axios.put(url, postParam, config);
  },
  courseCallPatch: async function (url, postParam) {
    let config = courseaxiosConfig;
    return await axios.patch(url, postParam, config);
  },

  userCall: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.userCallGet(url);
        break;
      case "post":
        return await this.userCallPost(url, postParam);
        break;
      case "put":
        return await this.userCallPut(url, postParam);
        break;
      case "patch":
        return await this.userCallPatch(url, postParam);
        break;
    }
  },
  userCallGet: async function (url, postParam) {
    let config = useraxiosConfig;
    return axios.get(url, config);
  },
  userCallPost: async function (url, postParam) {
    let config = useraxiosConfig;
    return await axios.post(url, postParam, config)
  },
  userCallPut: async function (url, postParam) {
    let config = useraxiosConfig;
    return await axios.put(url, postParam, config);
  },
  userCallPatch: async function (url, postParam) {
    let config = useraxiosConfig;
    return await axios.patch(url, postParam, config);
  },

  auditCall: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.auditCallGet(url);
        break;
      case "post":
        return await this.auditCallPost(url, postParam);
        break;
      case "put":
        return await this.auditCallPut(url, postParam);
        break;
      case "patch":
        return await this.auditCallPatch(url, postParam);
        break;
    }
  },
  auditCallGet: async function (url, postParam) {
    let config = auditaxiosConfig;
    return axios.get(url, config);
  },
  auditCallPost: async function (url, postParam) {
    let config = auditaxiosConfig;
    return await axios.post(url, postParam, config)
  },
  auditCallPut: async function (url, postParam) {
    let config = auditaxiosConfig;
    return await axios.put(url, postParam, config);
  },
  auditCallPatch: async function (url, postParam) {
    let config = auditaxiosConfig;
    return await axios.patch(url, postParam, config);
  },

  nodebbCall: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.nodebbCallGet(url);
        break;
      case "post":
        return await this.nodebbCallPost(url, postParam);
        break;
      case "put":
        return await this.nodebbCallPut(url, postParam);
        break;
      case "patch":
        return await this.nodebbCallPatch(url, postParam);
        break;
    }
  },
  nodebbCallGet: async function (url, postParam) {
    let config = nodebbaxiosConfig;
    return axios.get(url, config);
  },
  nodebbCallPost: async function (url, postParam) {
    let config = nodebbaxiosConfig;
    return await axios.post(url, qs.stringify(postParam), config)
  },
  nodebbCallPut: async function (url, postParam) {
    let config = nodebbaxiosConfig;
    return await axios.put(url, postParam, config);
  },
  nodebbCallPatch: async function (url, postParam) {
    let config = nodebbaxiosConfig;
    return await axios.patch(url, postParam, config);
  },

  elasticCall: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.elasticCallGetCall(url);
        break;
      case "post":
        return await this.elasticCallPostCall(url, postParam);
        break;
      case "put":
        return await this.elasticCallPutCall(url, postParam);
        break;
      case "patch":
        return await this.elasticCallPatchCall(url, postParam);
        break;
    }
  },
  elasticCallGetCall: async function (url, postParam) {
    let config = elasticaxiosConfig;
    return axios.get(url, config);
  },
  elasticCallPostCall: async function (url, postParam) {
    let config = elasticaxiosConfig;
    return await axios.post(url,postParam, config)
  },
  elasticCallPutCall: async function (url, postParam) {
    let config = elasticaxiosConfig;
    return await axios.put(url, postParam, config);
  },
  elasticCallPatchCall: async function (url, postParam) {
    let config = elasticaxiosConfig;
    return await axios.patch(url, postParam, config);
  },

  NotifyCall: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.NotifyCallGetCall(url);
        break;
      case "post":
        return await this.NotifyCallPostCall(url, postParam);
        break;
      case "put":
        return await this.NotifyCallPutCall(url, postParam);
        break;
      case "patch":
        return await this.NotifyCallPatchCall(url, postParam);
        break;
    }
  },
  NotifyCallGetCall: async function (url, postParam) {
    let config = NotifyaxiosConfig;
    return axios.get(url, config);
  },
  NotifyCallPostCall: async function (url, postParam) {
    let config = NotifyaxiosConfig;
    return await axios.post(url,postParam, config)
  },
  NotifyCallPutCall: async function (url, postParam) {
    let config = NotifyaxiosConfig;
    return await axios.put(url, postParam, config);
  },
  NotifyCallPatchCall: async function (url, postParam) {
    let config = NotifyaxiosConfig;
    return await axios.patch(url, postParam, config);
  },

  portal_call: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.portalCallGet(url);
        break;
      case "post":
        return await this.portalCallPost(url, postParam);
        break;
      case "put":
        return await this.portalCallPut(url, postParam);
        break;
      case "patch":
        return await this.portalCallPatch(url, postParam);
        break;
    }
  },
  portalCallGet: async function (url, postParam) {
    let config = portalaxiosConfig;
    return axios.get(url, config);
  },
  portalCallPost: async function (url, postParam) {
    let config = portalaxiosConfig;
    return await axios.post(url, postParam, config)
  },
  portalCallPut: async function (url, postParam) {
    let config = portalaxiosConfig;
    return await axios.put(url, postParam, config);
  },
  portalCallPatch: async function (url, postParam) {
    let config = portalaxiosConfig;
    return await axios.patch(url, postParam, config);
  },
  smartServiceCallPost: async function (url, postParam) {
    let config = smartServiceaxiosConfig;
    return await axios.post(url, postParam, config);
  },
  // step service

  makeHttpCallStep: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallStep(url, postParam);//postParam => header param
      case "post":
        return await this.makePostCallStep(url, postParam);
      case "put":
        return await this.makePutCallStep(url, postParam);
      case "patch":
        return await this.makePatchCallStep(url, postParam);
    }
  },
  makeGetCallStep: async function (url, headerParam='') {
    let config = stepConfig; 
    if(headerParam.apicall != 'undefinded' && headerParam.apicall == 'logout'){      
      config.headers["access-token"] = headerParam.token
    }
    return await axios.get(url, config);
  },
  makePostCallStep: async function (url, postParam) {
    let config = stepConfig;
    // console.log("stepConfig=>",stepConfig)
    // console.log("url=>",url)
    // console.log("postParam=>",postParam)
    return await axios.post(url, postParam, config);
  },
  makePutCallStep: async function (url, postParam) {
    let config = stepConfig;
    return await axios.put(url, postParam, config);
  },
  makePatchCallStep: async function (url, postParam) {
    let config = stepConfig;
    return await axios.patch(url, postParam, config);
  }
};
