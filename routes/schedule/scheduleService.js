const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
var ObjectID = require('mongodb').ObjectID;
const json = require('../json');

let userInsertion = async (params) => {
    try {
        var browser = params.headers["user-agent"];
        let username = params.username.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'_')
        jsonData = {
            "_id" : username,
            "browser" : {
                "name" : browser,
                "version" : browser
            },
            "os" : {
                "name" : browser,
                "version" : browser,
                "versionName" : browser
            },
            "platform" : {
                "type" : browser
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
            url: process.env.MONGO_URI,
            client: "users",
            docType: 0,
            query: jsonData
        };
        let responseData = await invoke.makeHttpCall("post", "writeData", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message:responseData.data.statusMessage.insertedId}
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
    let username = params.username.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'_');
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
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
            url: process.env.MONGO_URI,
            client: "users",
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
        let jsonData;
        if (params && params.videoass == "VA"){
            jsonData = await json.videoassData(params);
        }else if (params && params.videoass == "QUE"){
            jsonData = await json.videoassData(params); 
        }
        else {
            jsonData = await json.roomsData(params);
        }
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 0,
            query: jsonData
        };
        let responseData = await invoke.makeHttpCall("post", "writeData", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message:responseData.data.statusMessage.insertedId}
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
        var browser = params.headers["user-agent"];
        var jsonData = {
            "loggedAt" : new Date(),
            "browser" : {
                "name" : browser,
                "version" : browser
            },
            "os" : {
                "name" : browser,
                "version" : browser,
                "versionName" : browser
            },
            "platform" : {
                "type" : browser
            },
            "updatedAt" : new Date()
        }
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
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
        var objectId = new ObjectID();
        if (params && !params.verified){
            var jsonData = {
                similar : params.similar,
                rep : params.rep,
                // face : objectId   it should get insert after me api
            }
        } else if(params && params.verified) {
            var jsonData = {
                verified : params.verified,
                // passport : objectId it should get insert after me api
            }
        }
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 0,
            query:{
                filter: { "_id": params.userId },
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
let userDetails = async (params) => {
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
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
        jsonData = {
            status : 'started',
            startedAt : new Date()
        }
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
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
            url: process.env.MONGO_URI,
            client: "chats",
            docType: 1,
            query: [
                { 
                    "$addFields": {"test": { "$toString": "$_id" }} 
                },
                {
                    "$match":{"test":params.chatId}
                },
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
            url: process.env.MONGO_URI,
            client: "rooms",
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
    roomFetch
}