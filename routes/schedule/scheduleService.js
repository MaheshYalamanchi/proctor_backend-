const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const schedule = require("./schedule")
var ObjectID = require('mongodb').ObjectID;
const json = require('../json');
function getOperatingSystemInfo(browser) {
    try{
        const userAgent = browser;
        let osName = 'Unknown';
        let osVersion = 'Unknown';
      
        // Check for Windows
        if (userAgent.indexOf('Win') !== -1) {
          osName = 'Windows';
          if (userAgent.indexOf('Windows NT 10.0') !== -1) osVersion = 'Windows 10';
          else if (userAgent.indexOf('Windows NT 6.3') !== -1) osVersion = 'Windows 8.1';
          else if (userAgent.indexOf('Windows NT 6.2') !== -1) osVersion = 'Windows 8';
          else if (userAgent.indexOf('Windows NT 6.1') !== -1) osVersion = 'Windows 7';
          else if (userAgent.indexOf('Windows NT 6.0') !== -1) osVersion = 'Windows Vista';
          else if (userAgent.indexOf('Windows NT 5.1') !== -1) osVersion = 'Windows XP';
        }
        // Check for macOS
        else if (userAgent.indexOf('Mac') !== -1) {
          osName = 'macOS';
          const regex = /Mac OS X (\d+[._]\d+[._]\d+)/;
          const match = userAgent.match(regex);
          if (match) osVersion = match[1].replace(/_/g, '.');
        }
        // Check for Linux
        else if (userAgent.indexOf('Linux') !== -1) {
          osName = 'Linux';
        }
        // Check for Android
        else if (userAgent.indexOf('Android') !== -1) {
          osName = 'Android';
          const regex = /Android (\d+[._]\d+)/;
          const match = userAgent.match(regex);
          if (match) osVersion = match[1].replace(/_/g, '.');
        }
        // Check for iOS
        else if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) {
          osName = 'iOS';
          const regex = /OS (\d+[._]\d+[._]\d+)/;
          const match = userAgent.match(regex);
          if (match) osVersion = match[1].replace(/_/g, '.');
        }
      
        return { name: osName, version: osVersion };
    }catch(error){
        console.log(error,'while capturing os')
    }
  }
function getBrowserInfo(userAgent){
   try {
    if (userAgent.includes('Firefox/')) {
        console.log(`Firefox v${userAgent.split('Firefox/')[1]}`)
        return (`Firefox v${userAgent.split('Firefox/')[1]}`)
    } else if (userAgent.includes('Edg/')) {
        console.log(`Edg v${userAgent.split('Edg/')[1]}`)
        return (`Edg v${userAgent.split('Edg/')[1]}`)
    } else if (userAgent.includes('Chrome/')) {
        console.log(`Chrome v${userAgent.split('Chrome/')[1]}`)
        return (`Chrome v${userAgent.split('Chrome/')[1]}`)
    } else if (userAgent.includes('Safari/')) {
        // Safari
    }
   } catch (error) {
    console.log(error,'while capturing browser')
   }
}
  
let userInsertion = async (params) => {
    try {
        var browser = params.headers["user-agent"];
        const osInfo = getOperatingSystemInfo(browser);
        const browserInfo = getBrowserInfo(browser);


        let username = params.username.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'_')
        jsonData = {
            "_id" : username,
            "browser" : {
                "name" : browserInfo,
                "version" : browserInfo
            },
            "os" : {
                "name" : osInfo.name,
                "version" : osInfo.version,
                "versionName" : osInfo.version
            },
            "platform" : {
                "type" : osInfo.version
            },
            "role" : "student",
            "labels" : [],
            "exclude" : [],
            "rep" : [],
            "nickname" : params.nickname,
            "provider" : "jwt",
            "loggedAt" : new Date(),
            "ipaddress" : "127.0.0.1",
            "useragent" : browser,
            "referer" : params.headers.referer,
            "createdAt" : new Date,
            "similar" : []
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 0,
            query: jsonData
        };
        let responseData = await invoke.makeHttpCall("post", "insert", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message:responseData.data.statusMessage}
        } else {
            return { success: false, message: 'Data Not Found' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let userFetch = async (params) => {
    try {
        let username = params.username.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'_');
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 1,
            query: [
                {
                    $match :{ _id : username}
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message:responseData.data.statusMessage}
        } else {
            return { success: false, message: 'Data Not Found' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let userUpdate = async (params) => {
    try {
        jsonData = {
            loggedAt : new Date()
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 0,
            query:{
                filter: { "_id": params._id },
                update: { $set: jsonData }
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage.nModified) {
            return { success: true, message: responseData.data.statusMessage}
        } else {
            return { success: false, message: 'Data Not Found' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let roomInsertion = async (params) => {
    try {
        //create read function 
        //get date from db searching is db.getCollection('rooms').find({template:"default"})
        //bind the addons key
        //let jsonData;
        var getdata = {
            url:process.env.MONGO_URI,
            database: "proctor",
            model: "rooms",
            docType: 1,
            query: {_id:params.template}
        };
        let response = await invoke.makeHttpCall("post", "read", getdata);
        if (response && response.data && response.data.statusMessage) {
            let jsonData;
            if (params && params.videoass == "VA"){
                jsonData = await json.videoassData(params);
                jsonData.members = response.data.statusMessage[0].members
                jsonData.metrics=response.data.statusMessage[0].metrics
                jsonData.weights=response.data.statusMessage[0].weights
                jsonData.addons=response.data.statusMessage[0].addons
                
            }else if (params && params.videoass == "QUE"){
                jsonData = await json.videoassData(params); 
                jsonData.members = response.data.statusMessage[0].members 
                jsonData.metrics=response.data.statusMessage[0].metrics
                jsonData.weights=response.data.statusMessage[0].weights
                jsonData.addons=response.data.statusMessage[0].addons
            }
            else {
                jsonData = await json.roomsData(params);
                jsonData.addons=response.data.statusMessage[0].addons
                jsonData.threshold=response.data.statusMessage[0].threshold
                jsonData.rules=response.data.statusMessage[0].rules
                jsonData.members = response.data.statusMessage[0].members
                jsonData.metrics=response.data.statusMessage[0].metrics
                jsonData.weights=response.data.statusMessage[0].weights
                jsonData.addons=response.data.statusMessage[0].addons
            }
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "rooms",
                docType: 0,
                query: jsonData
            };
            let responseData = await invoke.makeHttpCall("post", "insert", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message:responseData.data.statusMessage}
            } else {
                return { success: false, message: 'Data Not Found' };
            }
        } else {
            return { success: false, message: 'Data Not Found' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let roomUpdate = async (params) => {
    try {
        let fetchTemplateData=await fetchTemplate(params)
        var browser = params.headers["user-agent"];
        const osInfo = getOperatingSystemInfo(browser);
        const browserInfo = getBrowserInfo(browser);
        var jsonData = {
            "metrics":fetchTemplateData.message.metrics,
            "weights":fetchTemplateData.message.weights,
            "addons":fetchTemplateData.message.addons,
            "loggedAt" : new Date(),
            "browser" : {
                "name" : browserInfo,
                "version" : browserInfo
            },
            "os" : {
                "name" : osInfo.name,
                "version" : osInfo.version,
                "versionName" : osInfo.version
            },
            "platform" : {
                "type" : browser
            },
            "updatedAt" : new Date()
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 0,
            query:{
                filter: { "_id": params.id },
                update: { $set: jsonData }
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage.nModified ) {
            return { success: true, message: responseData.data.statusMessage}
        } else {
            return { success: true, message: 'Data Not Found' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let usersDetailsUpdate = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 0,
            query:{
                filter: { "_id": params.decodeToken.id },
                // update: { $set: { verified: params.verified} }
                update: { $set: { verified: true } }
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage.nModified) {
            return { success: true, message: responseData.data.statusMessage}
        } else {
            return { success: false, message: 'Data Not Found' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let userDetails = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 1,
            query: [
                {
                    $match :{ _id : params.id}
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message:responseData.data.statusMessage}
        } else {
            return { success: false, message: 'Data Not Found' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getCandidateDetailsUpdate = async (params) => {
    try {
        let roomsData = await schedule.getRoomDetails(params);
        if(roomsData && roomsData.success){
            let jsonData;
            if (roomsData.message && (roomsData.message.startedAt == null)){
                jsonData = {
                    status : 'started',
                    startedAt : new Date(),
                    ipaddress: params.body.ipAddress
                }
            } else {
                jsonData = {
                    status : 'started',
                    ipaddress: params.body.ipAddress,
                    updatedAt: new Date()
                }
            }
            var getdata = {   
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "rooms",
                docType: 0,
                query:{
                    filter: { "_id": params.query.id },
                    update: { $set: jsonData }
                }
            };
            let responseData = await invoke.makeHttpCall("post", "update", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage.nModified) {
                return { success: true, message: responseData.data.statusMessage}
            } else {
                return { success: false, message: 'Data Not Found' };
            }
        } else {
            return { success: roomsData.success , message: roomsData.message };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getCandidateDetailsUpdateStop = async (params) => {
    try {
        jsonData = {
            status : 'stopped',
            stoppedAt : new Date()
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 0,
            query:{
                filter: { "_id": params.id },
                update: { $set: jsonData }
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage.nModified) {
            return { success: true, message: responseData.data.statusMessage}
        } else {
            return { success: false, message: 'Data Not Found' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let chatDetails = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "chats",
            docType: 1,
            query: [
                { $match: { "_id": params.chatId } },
                {
                    "$project":{
                        "_id":1,"type":"$type","room":"$room","user":"$user","createdAt":"$createdAt","metadata":"$metadata","attach":"$attach"
                    }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message:responseData.data.statusMessage}
        } else {
            return { success: false, message: 'Data Not Found' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let roomFetch = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 1,
            query: [
                {
                    $match :{ _id : params.id}
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message:responseData.data.statusMessage}
        } else {
            return { success: false, message: 'Data Not Found' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};

let fetchTemplate =async(params)=>{
    try {
        let F = params.template
        data = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 1,
            query: [
                { $match: { _id: F, "status" : "template"} },
                { $project: { weights: 1,metrics:1 } },
            ]
        };
        let result = await invoke.makeHttpCall("post", "aggregate", data)
        if (result && result.data && result.data.statusMessage.length) {
            return { success: true, message: result.data.statusMessage[0] }
        } else {
            return { success: true, message: 'Data Not Found' }
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
}
let errorupdate =async(params)=>{
    try {
        const date = new Date()
        const object = {
            error : params.body,
            "createdAt": date
          }
        data = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 0,
            query: {
                filter: { "_id": params.id },
                update: { 
                    $push: { "errorlog" : object},
                    $set: { error : params.body}
                }
            }
        };
        let result = await invoke.makeHttpCall("post", "update", data)
        if (result && result.data && result.data.statusMessage) {
            return { success: true, message: result.data.statusMessage }
        } else {
            return { success: true, message: 'Data Not Found'  }
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
}
module.exports = {
    userInsertion,
    userFetch,
    userUpdate,
    roomInsertion,
    roomUpdate,
    usersDetailsUpdate,
    userDetails,
    getCandidateDetailsUpdate,
    chatDetails,
    roomFetch,
    getCandidateDetailsUpdateStop,
    errorupdate
}