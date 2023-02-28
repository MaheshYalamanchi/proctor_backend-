const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const jwt_decode = require('jwt-decode');
const { ObjectID } = require("mongodb");
let getcount = async (params) => {
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "chats",
            docType: 1,
            query: [
                {
                    "$match": {
                        "room": params.room,
                        "type": { "$regex": params.type, "$options": 'i' }
                    }
                },
                {
                    "$group": { "_id": null, "incidents": { "$sum": 1 } }
                },
                {
                    "$project": { "_id": 0 }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData) {
            return responseData;
        } else {
            return "Data Not Found";
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getAttach = async (params) => {
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "attaches",
            docType: 1,
            query: [
                {
                    "$addFields": { "test": { "$toString": "$_id" } }
                },
                {
                    "$match": { "test": params }
                },
                {
                    "$project": { "id": "$_id","filename":"$filename","mimetype":"$mimetype","_id":0 }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData) {
            return responseData;
        } else {
            return "Data Not Found";
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let faceResponse = async (params) => {
    decodeToken = jwt_decode(params.authorization);
    try {
        jsonData = {
            // "_id" :new ObjectID(params.message.face),
            "user" : decodeToken.id,
            "filename" : params.myfile.originalFilename,
            "mimetype" : params.myfile.mimetype,
            "size" : params.myfile.size,
            "createdAt" : new Date(),
            "attached" : true,
            "metadata" : {
                "distance" : 0,
                "threshold" : 0.25,
                "verified" : true,
                "objectnew" : "",
                "similar" :params.message.similar||[],
                "rep" : params.rep
            },
        }
        var getdata = {
            url: process.env.MONGO_URI,
            client: "attaches",
            docType: 0,
            query: jsonData
        };
        let responseData = await invoke.makeHttpCall("post", "write", getdata);
        if (responseData && responseData.data.iid) {
            return ({success:true,message :responseData.data.iid}) ;
        } else {
            return "Data Not Found";
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let passportResponse = async (params) => {
    decodeToken = jwt_decode(params.authorization);
    try {
        jsonData = {
            // "_id" :new ObjectID(params.message.passport),
            "user" : decodeToken.id,
            "filename" : params.myfile.originalFilename,
            "mimetype" : params.myfile.mimetype,
            "size" : params.myfile.size,
            "createdAt" : new Date(),
            "attached" : true,
            "metadata" : {
                "distance" : 0,
                "objectnew" : "",
                "rep" : params.rep
            },
        }
        var getdata = {
            url: process.env.MONGO_URI,
            client: "attaches",
            docType: 0,
            query: jsonData
        };
        let responseData = await invoke.makeHttpCall("post", "write", getdata);
        if (responseData && responseData.data.iid) {
            return ({success:true,message :responseData.data.iid}) ;
        } else {
            return "Data Not Found";
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
    getcount,
    getAttach,
    faceResponse,
    passportResponse
}