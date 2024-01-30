const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');

let getcount = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "chats",
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
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "attaches",
            docType: 1,
            query: [
                // {
                //     "$addFields": { "test": { "$toString": "$_id" } }
                // },
                {
                    "$match": { "_id": params }
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
    // decodeToken = jwt_decode(params.authorization);
    try {
        jsonData = {
            // "_id" :new ObjectID(params.message.face),
            "user" : params.decodeToken.id,
            "filename" : params.originalFilename,
            "mimetype" : params.mimetype,
            "size" : params.size,
            "createdAt" : new Date(),
            "attached" : true,
            "metadata" : {
                "distance" : params.distance,
                "threshold" : params.threshold,
                "verified" : params.verified,
                "objectnew" : "",
                "similar" :params.message||[],
                "rep" : params.rep
            },
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "attaches",
            docType: 0,
            query: jsonData
        };
        let responseData = await invoke.makeHttpCall_userDataService("post", "write", getdata);
        if (responseData && responseData.data.statusMessage._id) {
            if(params.decodeToken.role === "administrator"){
                responseData.data.statusMessage.id = responseData.data.statusMessage._id;
                delete responseData.data.statusMessage._id;
                delete responseData.data.statusMessage.attached;
                // delete responseData.data.statusMessage.metadata;
                delete responseData.data.statusMessage.__v;
                return ({success:true,message :responseData.data.statusMessage}) ;
            }else{
                responseData.data.statusMessage.id = responseData.data.statusMessage._id;
                delete responseData.data.statusMessage._id;
                delete responseData.data.statusMessage.__v;
            return ({success:true,message :responseData.data.statusMessage}) ;
            }
        } else {
            return ({success:false,message :"Data not found"});
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let passportResponse1 = async (params) => {
    try {
        jsonData = {
            "user" : params.decodeToken.id,
            "filename" : params.myfile.originalFilename,
            "mimetype" : params.myfile.mimetype,
            "size" : params.myfile.size,
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "attaches",
            docType: 0,
            query: jsonData
        };
        let responseData = await invoke.makeHttpCall_userDataService("post", "write", getdata);
        if (responseData && responseData.data.statusMessage._id) {
            responseData.data.statusMessage.id = responseData.data.statusMessage._id;
            delete responseData.data.statusMessage._id;
            delete responseData.data.statusMessage.__v;
            return ({success: true,message: responseData.data.statusMessage}) ;
        } else {
            return ({success: false, message: "attach insertion failed"});
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let passportResponse2 = async (params) => {
    try {
        jsonData = {
            "attached" : true,
            "metadata" : {
                "distance" : 0,
                "objectnew" : ""
                // "rep" : params.rep
            },
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "attaches",
            docType: 0,
            query: {
                filter: {_id: params.message.id},
                update: { $set: jsonData }
            }
        };
        let responseData = await invoke.makeHttpCall_userDataService("post", "updateOne", getdata);
        if (responseData && responseData.data.statusMessage.nModified>0) {
            return ({success: true, message: "record updated successfully"}) ;
        } else {
            return ({success: true,message: "record updated failed"});
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
    passportResponse1,
    passportResponse2,
}