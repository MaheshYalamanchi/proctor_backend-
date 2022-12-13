const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');

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
            return { success: true, message: { data: responseData.data.statusMessage, pos: start, total_count: count } }
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
                    $match : params.username
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
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: { data: responseData.data.statusMessage, pos: start, total_count: count } }
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
}