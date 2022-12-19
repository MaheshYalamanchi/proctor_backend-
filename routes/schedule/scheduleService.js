const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
var ObjectID = require('mongodb').ObjectID;

let userInsertion = async (params) => {
    try {
        var browser = params.headers["user-agent"]; 
        jsonData = {
            "_id" : params.username,
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
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: [
                {
                    $match :{ _id : params.username}
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
        jsonData = {
            "_id" : params.id,
            "timesheet" : {
                "xaxis" : [],
                "yaxis" : []
            },
            "invites" : [],
            "quota" : 0,
            "concurrent" : 0,
            "members" : [ 
                "Proctortest", 
                "afserp", 
                "balajiproctor", 
                "defaultproctor"
            ],
            "addons" : [ 
                "track", 
                "record", 
                "finish", 
                "auto", 
                "screen", 
                "chat", 
                "preview", 
                "check", 
                "face", 
                "passport", 
                "content", 
                "upload"
            ],
            "metrics" : [ 
                "b1", 
                "b2", 
                "b3", 
                "c1", 
                "c2", 
                "c3", 
                "k1", 
                "m1", 
                "n2", 
                "s1", 
                "s2", 
                "c4"
            ],
            "weights" : [ 
                1, 
                3, 
                1, 
                2, 
                1, 
                100, 
                1, 
                2, 
                1, 
                1, 
                1, 
                100
            ],
            "status" : "created",
            "tags" : [ 
                params.nickname
            ],
            "subject" : params.subject,
            "locale" : null,
            "timeout" : 90,
            "rules" : "https://info.lntiggnite.com/Video/clip_en.html",
            "threshold" : 0,
            "createdAt" : new Date(),
            "updatedAt" : new Date(),
            "api" : null,
            "comment" : "kjsabdkjqq",
            "complete" : false,
            "conclusion" : null,
            "deadline" : null,
            "stoppedAt" : null,
            "timezone" : null,
            "url" : null,
            "lifetime" : null,
            "error" : null,
            "scheduledAt" : new Date(),
            "duration" : null,
            "incidents" : null,
            "integrator" : "sdk",
            "ipaddress" : null,
            "score" : null,
            "signedAt" : null,
            "startedAt" : null,
            "useragent" : null,
            "proctor" : null,
            "student" : params.username,
            "template" : "default"
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
let usersDetailsUpdate = async (params) => {
    try {
        var objectId = new ObjectID();
        var jsonData = {
            thresold : params.thresold,
            distance : params.distance,
            verified : params.verified,
            similar : params.similar,
            rep : params.rep,
            face : objectId
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
            status : 'started'
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
                    $match :{ _id : params.chatId}
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
    chatDetails
}