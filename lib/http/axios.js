let instance = {
  baseURL: process.env.DATA_SERVICE_ENDPOINT,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};
let instance_polyglot = {
  baseURL: process.env.EXTERNAL_PORT,
  timeout: 50000000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json"
  }
};
let instance_polyglot_cms = {
  baseURL: process.env.CMS_EXTERNAL_PORT,
  timeout: 50000000,
  headers: {
    "Content-Type": "application/json",
    "Accept" : "application/json"
  }
};
let openedx_instance = {
  baseURL: process.env.EXTERNAL_PORT,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    "Accept": "application/json"
  }
};
let course_instance = {
  baseURL: process.env.course_service,
  headers: { 
    "Authorization" : process.env.service_authToken,
    "Content-Type": "application/json" }
};
let user_instance = {
  baseURL: process.env.user_service,
  headers: { 
    "Authorization" : process.env.service_authToken,
    "Content-Type": "application/json" }
};
let audit_instance = {
  baseURL: process.env.AUDIT_URL,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};
let nodebb_instance = {
  baseURL: process.env.NODEBB_URL,
  timeout: 50000000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Accept" : "*/*",
    "Connection" : "keep-alive",
    "Accept-Encoding" : "gzip, deflate, br"
  }
};
let elastic_instance = {
  baseURL: process.env.ELASTICSEARCH,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};
let notification_instance = {
  baseURL: process.env.NOTIFICATION_URL,
  timeout: 50000000,
  headers: {  
    "Authorization" : process.env.service_authToken,
    "Content-Type": "application/json" 
  }
};

let portal_instance = {
  baseURL: process.env.PORTAL_URL,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};

let instance_SMARTSERVICE = {
  baseURL: process.env.SMARTSERVICEURL,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};

let stepServiceInstance = {
  baseURL: process.env.stepURL,
  timeout: 50000000,
  headers: { "Content-Type": "application/json"}
}

module.exports = {
  instance,
  instance_polyglot,
  instance_polyglot_cms,
  openedx_instance,
  course_instance,
  user_instance,
  audit_instance,
  nodebb_instance,
  elastic_instance,
  notification_instance,
  portal_instance,
  stepServiceInstance,
  
};
