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
                
                let userResponse = await schedule.eventInfo(responseData.data.statusMessage._id);
                if (userResponse && userResponse.success){
                    json = {
                        timestamp:new Date(),
                        room :params.params.roomId,
                        metrics : params.body.metadata.metrics
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
                let userResponse = await schedule.eventInfo(responseData.data.statusMessage._id);
                if (userResponse && userResponse.success){
                    json = {
                        timestamp:new Date(),
                        room :params.params.roomId,
                        metrics : params.body.metadata.metrics
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
                let attatchResponse = await schedule.attachInsertion(chatResponse.message[0])
                if (attatchResponse.success){
                    chatResponse.message[0].attach[0] = attatchResponse.message[0].id;
                    return { success: true, message:chatResponse.message[0]}
                } else  {
                    return { success: true, message:"data not found"}
                }
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
        var urldata = "/#!/side/vision?id=" + url
        const result = urldata.replace(/,/g, '.');
        if (url) {
                return { success: true, message:result}
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

module.exports = {
    getChatDetails,
    getCandidateEventSend,
    getCandidateFcaeSend,
    userInfo,
    getface,
    getPassport,
    broadcastMesssage,
    fetchurl
}