const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');;
const jwt_decode = require('jwt-decode');
const scheduleService = require('../schedule/scheduleService');
const schedule = require('./schedule');
var ObjectID = require('mongodb').ObjectID;
const moment = require('moment');
let getChatDetails = async (params) => {
    decodeToken = jwt_decode(params.body.authorization)
    try {
        let userResponse = await scheduleService.chatDetails(params.params);
        if (userResponse && userResponse.success){
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
                docType: 0,
                query:{
                    filter: { "_id": userResponse.message[0]._id },
                    update: { $push:{attach: params.body.body.attach[0] }}
                }
            };
            let responseData = await invoke.makeHttpCall("post", "update", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage.nModified) {
                    userResponse.message[0].attach = params.body.body.attach
                    userResponse.message[0].id = userResponse.message[0]._id
                    delete userResponse.message[0]._id
                    return { success: true, message:userResponse.message[0]}
            } else {
                return { success: false, message: 'Data Not Found' };
            }
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};

let getCandidateEventSend = async (params) => {
    try {
        if(params.body.authorization){
            decodeToken = jwt_decode(params.body.authorization)
            jsonData = {
                "type" : params.body.type,
                "attach" : [],
                "room" : params.params.roomId,
                "user" : decodeToken.id,
                "createdAt" : new Date(),
                "metadata" : params.body.metadata,
                "violation" : params.body.violation
            }
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
                docType: 0,
                query: jsonData
            };
            let responseData = await invoke.makeHttpCall("post", "write", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage._id) {
                let userResponse = await schedule.eventInfo(responseData.data.statusMessage._id);
                if (userResponse && userResponse.success){
                    if (params.body.metadata.peak == "m3"){
                        json = {
                            timestamp:new Date(),
                            room :params.params.roomId,
                            metrics : params.body.metadata.metrics,
                            peak : params.body.metadata.peak
                        }
                    } else {
                        json = {
                            timestamp:new Date(),
                            room :params.params.roomId,
                            metrics : params.body.metadata.metrics
                        }
                    }
                    let score = await schedule.updateScore(json)
                    if (score.success){
                        userResponse.message[0].metadata.score = score.message;
                        return { success: true, message:userResponse.message[0]}
                    } else  {
                        return { success: true, message:"data not found"}
                    }
                }
            } else {
                return { success: false, message: 'Data Not Found' };
            }
        }else if(params.body){
            jsonData = {
                "type" : params.body.type,
                "attach" : [],
                "room" : params.params.roomId,
                "createdAt" : new Date(),
                "metadata" : params.body.metadata,
                "violation" : params.body.violation
            }
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
                docType: 0,
                query: jsonData
            };
            let responseData = await invoke.makeHttpCall("post", "write", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage._id) {
                let userResponse = await schedule.eventInfo(responseData.data.statusMessage._id);
                if (userResponse && userResponse.success){
                    if (params.body.metadata.peak == "m3"){
                        json = {
                            timestamp:new Date(),
                            room :params.params.roomId,
                            metrics : params.body.metadata.metrics,
                            peak : params.body.metadata.peak
                        }
                    } else {
                        json = {
                            timestamp:new Date(),
                            room :params.params.roomId,
                            metrics : params.body.metadata.metrics
                        }
                    }
                    let score = await schedule.updateScore(json)
                    if (score.success){
                        userResponse.message[0].metadata.score = score.message;
                        return { success: true, message:userResponse.message[0]}
                    } else  {
                        return { success: true, message:"data not found"}
                    }
                }
            } else {
                return { success: false, message: 'Data Not Found' };
            }
        }else{
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
let getCandidateFcaeSend = async (params) => {
    decodeToken = jwt_decode(params.body.authorization)
    try {
        jsonData = {
            "type" : params.body.type,
            "attach" :[ 
                params.body.attach[0]
            ],
            "room" : params.params.roomId,
            "user" : decodeToken.id,
            "createdAt" : new Date(),
            "metadata" : params.body.metadata
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "chats",
            docType: 0,
            query: jsonData
        };
        let responseData = await invoke.makeHttpCall("post", "write", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage._id) {
            let chatResponse = await schedule.faceInfo(responseData.data.statusMessage._id);
            if (chatResponse && chatResponse.success){
                // let attatchResponse = await schedule.attachInsertion(chatResponse.message[0])
                // if (attatchResponse.success){
                    // chatResponse.message[0].attach[0] = attatchResponse.message[0].id;
                    return { success: true, message:chatResponse.message[0]}
                // } else  {
                //     return { success: true, message:"data not found"}
                // }
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
let userInfo = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 1,
            query:[
                {
                    $match: { _id:params.id}
                },
                { $unwind: { path: "$similar", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'similar.user',
                        foreignField: '_id',
                        as: 'student',
                    }
                },
                { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
                {
                    $project:{"user.id":"$student._id",_id:0,"distance":"$similar.distance","user.face":"$student.face",
                        "user.nickname":"$student.nickname","user.username":"$student._id"}
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
let getface = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 1,
            query:[
                {
                    $match: { _id:params.id}
                },
                {
                    $project :{
                        id:"$_id",_id:0,browser:"$browser",os:"$os",platform:"$platform",role:"$role",labels:"$labels",
                        exclude:"$exclude",nickname:"$nickname",provider:"$provider",loggedAt:"$loggedAt",ipaddress:"$ipaddress",
                        useragent:"$useragent",referer:"$referer",createdAt:"$createdAt",similar:"$similar",face:"$face",
                        username:"$_id",
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
let getPassport = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 1,
            query:[
                {
                    $match: { _id:params.id}
                },
                {
                    $project :{
                        id:"$_id",_id:0,browser:"$browser",os:"$os",platform:"$platform",role:"$role",labels:"$labels",
                        exclude:"$exclude",nickname:"$nickname",provider:"$provider",loggedAt:"$loggedAt",ipaddress:"$ipaddress",
                        useragent:"$useragent",referer:"$referer",createdAt:"$createdAt",similar:"$similar",face:"$face",
                        username:"$_id",passport:"$passport",verified:"$verified"
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
let broadcastMesssage = async (params) => {
    try {
        const date = moment()
        const formattedDate = date.format('YYYY-MM-DD');
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 1,
            query:[
                {
                    $match:{
                        status:"started",
                        members:{$elemMatch:{$in:[params.user.id || params.user]}},status:"started"
                    }
                },
                {$sort:{updatedAt:-1}},
                {$limit:100},
                {
                $project:{"student": 1, id:"$_id",_id:0,test: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }}
                },
                {
                $match:{test:{$eq:formattedDate}}
                }
                ]
        };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                let messages = responseData.data.statusMessage
                let data = []
                for (const value of messages) {
                     const obj = {
                        "room": value.id,
                        "members": params.user,
                        "type":"message",
                        "metadata" : params.metadata,
                        "user": params.user,
                        "message":  params.message
                     };
                     data.push(obj)
                }
                var postdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "chats",
                    docType: 0,
                    query: data
                };
                let response = await invoke.makeHttpCall("post", "insertMany", postdata);
                if (response && response.data && response.data.statusMessage) {
                    return { success: true, message: response.data.statusMessage }
                } else {
                    return { success: false, message: 'Data Not found' }
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
let fetchurl = async (params) => {
    try {
        var url =[]
        for (const iterator of params.statusMessage[0].data){
            var data = iterator.id
            url.push(data)
        }
        const stringData = url.join(',');
        const replacedString = stringData.replace(/,/g, '.');
        if (replacedString) {
                return { success: true, message:replacedString}
        } else {
            return { success: false, message: 'url is not created' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let fetchstatus = async (params) => {
    try {
        const data = params.response.statusMessage[0].data
        var sort = -1;
        var start;
        if (params&&params.start&&params.start.query&&params.start.query.start) {
            start = parseInt(params.query.start);
        } else {
            start = 0;
        }
        var limit = parseInt(params.start.query.limit)
        var postdata = {
            url: process.env.MONGO_URI,
            database: "proctor",
            model: "rooms",
            docType: 1,
            query: [
                { "$sort": { startedAt: sort } },
                { "$skip": start },
                { "$limit": limit },
                { $group: { _id: { status: "$status" }, count: { $sum: 1 } } },
                { $project: { _id: 0, "status": "$_id.status", "count": 1 } },
            ]
        };
        let response = await invoke.makeHttpCall("post", "aggregate", postdata);
        if (response && response.data && response.data.statusMessage) {
            const message = []
            let mergedCount = 0;
            for (let obj of response.data.statusMessage) {
                if (obj.status === 'stopped' || obj.status === 'accepted') {
                    mergedCount += obj.count;
                } else if (obj.status === 'started') {
                    message.push({ "In Progress": obj.count })
                } else if (obj.status === 'paused') {
                    message.push({ "Idle": obj.count })
                } else if (obj.status === 'rejected') {
                    message.push({ "Terminated": obj.count })
                }
            }
            message.push({ "Completed": mergedCount });
            var jsonData = {
                'Completed' : 0,
                "In Progress" : 0,
                "Idle" : 0,
                'Terminated' : 0
            }
            message.forEach((item) => {
                const key = Object.keys(item)[0]; 
                const value = item[key]; 
                jsonData[key] = value;
              });
            return { success: true, message: jsonData }
        } else {
            return { success: false, message: 'Data Not found' }
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getFacePassportResponse = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "attaches",
            docType: 1,
            query:[
                // {
                //     "$addFields": { "test": { "$toString": "$_id" } }
                // },
                {
                    "$match": { "_id": params }
                },
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
let unreadmessagefetch = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database: "proctor",
            model: "chats",
            docType: 1,
            query:[
                {
                    $match: {"room": { $in: params },"notification": "unread","message":{ "$exists": true } } 
                },
                {
                    $project: {"_id":0,"notification": 1 ,"message" :1,"user" :1,"createdAt":1,"_id" :1}
                },
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: responseData.data.statusMessage }
        } else {
            return { success: false, message: 'Data Not Found' }
        }
    }
    catch (error) {
      if (error && error.code == 'ECONNREFUSED') {
        return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
      } else {
        return { success: false, message: error }
      }
    }
  };

let unreadchat = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database: "proctor",
            model: "chats",
            docType: 1,
            query:{
                filter :{_id:{$in:params}},
                update :{$set:{notification:"read"}}
            } 
        };
        let responseData = await invoke.makeHttpCall("post", "updatedataMany", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage.nModified>0) {
            return { success: true, message: "Record updated sucessfully" }
        } else {
            return { success: false, message: 'Data Not Found' }
        }
    }
    catch (error) {
      if (error && error.code == 'ECONNREFUSED') {
        return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
      } else {
        return { success: false, message: error }
      }
    }
  };

let getUserRoomsCount = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database: "proctor",
            model: "rooms",
            docType: 1,
            query:[
                {
                    $match:{ student: params.id }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: responseData.data.statusMessage }
        } else {
            return { success: false, message: 'Data Not Found' }
        }
    }
    catch (error) {
      if (error && error.code == 'ECONNREFUSED') {
        return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
      } else {
        return { success: false, message: error }
      }
    }
};
let GetFaceInsertionResponse = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database: "proctor",
            model: "users",
            docType: 0,
            query:{
                filter: { "_id": decodeToken.id },
                update: { $set: {"faceArray":[{"face": params}]} }
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage && responseData.data.statusMessage.nModified>0) {
            return { success: true, message: "record updated successfully" }
        } else {
            return { success: false, message: 'record updation failed' }
        }
    }
    catch (error) {
      if (error && error.code == 'ECONNREFUSED') {
        return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
      } else {
        return { success: false, message: error }
      }
    }
};
let GetPassportInsertionResponse = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database: "proctor",
            model: "users",
            docType: 0,
            query:{
                filter: { "_id": decodeToken.id },
                update: { $set: {"passportArray":[{"passport": params}]} }
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage && responseData.data.statusMessage.nModified>0) {
            return { success: true, message: "record updated successfully" }
        } else {
            return { success: false, message: 'record updation failed' }
        }
    }
    catch (error) {
      if (error && error.code == 'ECONNREFUSED') {
        return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
      } else {
        return { success: false, message: error }
      }
    }
};
module.exports = {
    getChatDetails,
    getCandidateEventSend,
    getCandidateFcaeSend,
    userInfo,
    getface,
    getPassport,
    broadcastMesssage,
    fetchurl,
    fetchstatus,
    getFacePassportResponse,
    unreadchat,
    unreadmessagefetch,
    getUserRoomsCount,
    GetFaceInsertionResponse,
    GetPassportInsertionResponse
}