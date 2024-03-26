const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');;
const jwt_decode = require('jwt-decode');
const scheduleService = require('../schedule/sharedService');
const schedule = require('./schedule');
var ObjectID = require('mongodb').ObjectID;
const moment = require('moment');
const _schedule = require('../schedule/schedule')
let getChatDetails = async (params) => {
    decodeToken = jwt_decode(params.body.authorization)
    try {
        if (decodeToken){
            let url;
            let database;
            let tenantResponse;
            if(decodeToken && decodeToken.tenantId){
                tenantResponse = await _schedule.tenantResponse(decodeToken);
                if (tenantResponse && tenantResponse.success){
                    url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                    database = tenantResponse.message.databaseName;
                }else {
                        return { success: false, message: tenantResponse.message }
                    }
            } else {
                url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
                database = process.env.DATABASENAME;
            }
            var getdata = {
                url: url,
                database: database,
                model: "chats",
                docType: 0,
                query:{
                    filter: { "_id": params.params.chatId },
                    update: { $push:{attach: params.body.body.attach[0]} }
                }
            };
            console.log("chatputBody=====>>>",JSON.stringify(getdata.query))
            let responseData = await invoke.makeHttpCall_userDataService("post", "findOneAndUpdate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                    responseData.data.statusMessage.attach = params.body.body.attach
                    responseData.data.statusMessage.id = responseData.data.statusMessage._id
                    delete responseData.data.statusMessage._id
                    console.log("chatPut====>>>",params.params.chatId+"      "+params.body.body.attach[0])
                    return { success: true, message:responseData.data.statusMessage}
            } else {
                console.log("chatFalsePut====>>>",params.params.chatId+"      "+params.body.body.attach[0])
                return { success: false, message: 'Data Not Found' };
            }
        } else {
            return { success: false, message: 'Invalid Token Error' };
        } 
    } catch (error) {
        console.log("error=====",error)
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};

let getCandidateEventSend = async (params) => {
    try {
        let violation = []
        if(params.body.authorization){
            var decodeToken = jwt_decode(params.body.authorization);
            let url;
            let database;
            let tenantResponse;
            if(decodeToken && decodeToken.tenantId){
                tenantResponse = await _schedule.tenantResponse(decodeToken);
                if (tenantResponse && tenantResponse.success){
                    url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                    database = tenantResponse.message.databaseName;
                }else {
                        return { success: false, message: tenantResponse.message }
                    }
            } else {
                url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
                database = process.env.DATABASENAME;
            }
            if (params.body.filename){
                for(let i= 0;i< params.body.filename.length;i++){
                    let data;
                    if("string" == typeof params.body.peak ){
                        data = {
                            "image": params.body.filename[i],
                            "peak": params.body.peak,
                            "createdAt": new Date(params.body.createdAt)
                        }
                    } else {
                        data = {
                            "image": params.body.filename[i],
                            "peak": params.body.peak[i],
                            "createdAt": new Date(params.body.createdAt[i])
                        }
                    }
                    if(params.body.peak[i] == "c3"){
                        if (params.body.metadata.peak != "c3"){
                            let response = await scheduleService.fetchMetrics(params.params.roomId)
                            const c3Index = response.message.metrics.indexOf("m3");
                            const c3Weight = response.message.weights[c3Index] * response.message.metrics.length;
                            params.body.metadata.metrics["c3"] = c3Weight
                        }
                    }
                    violation.push(data)
                }
            }
            jsonData = {
                "type" : params.body.type,
                "attach" : [],
                "room" : params.params.roomId,
                "user" : decodeToken.id,
                "createdAt" :new Date(params.body.createdAtEvent),
                "metadata" : params.body.metadata,
                "violation" : violation || []
            }
            var getdata = {
                url: url,
                database: database,
                model: "chats",
                docType: 0,
                query: jsonData
            };
            let responseData = await invoke.makeHttpCall_roomDataService("post", "write", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage._id) {
                let user = {
                    "id": decodeToken.id,
                    "nickname": decodeToken.nickname,
                    "role": decodeToken.role,
                    "username": decodeToken.id
                }
                delete responseData.data.statusMessage._id
                responseData.data.statusMessage.user = user
                // let userResponse = await schedule.eventInfo(responseData.data.statusMessage._id);
                // if (userResponse && userResponse.success){
                    
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
                            metrics : params.body.metadata.metrics,
                            tenantResponse: tenantResponse
                        }
                    }
                    return { success: true, message:{data:responseData.data.statusMessage,json:json}}
                    // let score = await schedule.updateScore(json)
                    // if (score.success){
                    //     responseData.data.statusMessage.metadata.score = score.message;
                    //     return { success: true, message:responseData.data.statusMessage}
                    // } else  {
                    //     return { success: true, message:"data not found"}
                    // }
            }
        }
        else{
            return { success: false, message: 'Invalid Token Error' };
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
    try {
        var decodeToken = jwt_decode(params.body.authorization);
        let url;
        let database;
        let tenantResponse;
        if(decodeToken && decodeToken.tenantId){
            tenantResponse = await _schedule.tenantResponse(decodeToken);
            if (tenantResponse && tenantResponse.success){
                url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                database = tenantResponse.message.databaseName;
            }else {
                    return { success: false, message: tenantResponse.message }
                }
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        if (decodeToken){
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
                url: url,
                database: database,
                model: "chats",
                docType: 0,
                query: jsonData
            };
            let responseData = await invoke.makeHttpCall_roomDataService("post", "write", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage._id) {
                if (tenantResponse && tenantResponse.success){
                    responseData.data.statusMessage.tenantResponse = tenantResponse;
                }
                let chatResponse = await schedule.faceInfo(responseData.data.statusMessage);
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
        } else {
            return { success: false, message: 'Invalid Token Error' };
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
        let responseData = await invoke.makeHttpCall_userDataService("post", "aggregate", getdata);
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
        let responseData = await invoke.makeHttpCall_userDataService("post", "aggregate", getdata);
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
        let tenantResponse = await _schedule.tenantResponse(params);
        if (tenantResponse && tenantResponse.success){
            const date = moment()
            const formattedDate = date.format('YYYY-MM-DD');
            var getdata = {
                url: tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName,
				database: tenantResponse.message.databaseName,
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
                        url: tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName,
					    database: tenantResponse.message.databaseName,
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
        } else {
            return { success: false, message: tenantResponse.message }
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
        let url;
        let database;
        if(params && params.tenantResponse && params.tenantResponse.message){
            url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
            database = tenantResponse.message.databaseName;
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
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
            url: url,
			database: database,
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
        let url;
        let database;
        if(params && params.tenantResponse && params.tenantResponse.success){
            url = params.tenantResponse.message.connectionString+'/'+params.tenantResponse.message.databaseName;
            database = params.tenantResponse.message.databaseName;
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        var getdata = {
            url: url,
			database: database,
            model: "attaches",
            docType: 1,
            query:{ "_id": params.face}
        };
        let responseData = await invoke.makeHttpCall_userDataService("post", "read", getdata);
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
        let url;
        let database;
        if(params && params.tenantResponse && params.tenantResponse.success){
            url = params.tenantResponse.message.connectionString+'/'+params.tenantResponse.message.databaseName;
            database = params.tenantResponse.message.databaseName;
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        var getdata = {
            url: url,
			database: database,
            model: "chats",
            docType: 1,
            query:[
                {
                    $match: {"room": { $in: params.data },"notification": "unread","message":{ "$exists": true } } 
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
        let url;
        let database;
        if(params && params.tenantResponse && params.tenantResponse.success){
            url = params.tenantResponse.message.connectionString+'/'+params.tenantResponse.message.databaseName;
            database = params.tenantResponse.message.databaseName;
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        var getdata = {
            url: url,
			database: database,
            model: "chats",
            docType: 1,
            query:{
                filter :{_id:{$in:params.data}},
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
        let url;
        let database;
        if(params && params.tenantResponse && params.tenantResponse.success){
            url = params.tenantResponse.message.connectionString+'/'+params.tenantResponse.message.databaseName;
            database = params.tenantResponse.message.databaseName;
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        var getdata = {
            url: url,
			database: database,
            model: "rooms",
            docType: 1,
            query:{ student: params.id }
        };
        let responseData = await invoke.makeHttpCall_userDataService("post", "read", getdata);
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
        let url;
        let database;
        if(params && params.tenantResponse && params.tenantResponse.success){
            url = params.tenantResponse.message.connectionString+'/'+params.tenantResponse.message.databaseName;
            database = params.tenantResponse.message.databaseName;
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        var getdata = {
            url: url,
			database: database,
            model: "users",
            docType: 1,
            query:{
                filter: { "_id": params.decodeToken.id },
                update: { $set: {"faceArray":[{"face": params.face}]} },
                projection: {
                    id:"$_id",_id:0,browser:"$browser",os:"$os",platform:"$platform",role:"$role",labels:"$labels",
                    exclude:"$exclude",nickname:"$nickname",provider:"$provider",loggedAt:"$loggedAt",ipaddress:"$ipaddress",
                    useragent:"$useragent",referer:"$referer",createdAt:"$createdAt",similar:"$similar",face:"$face",
                    username:"$_id",
                }
            }
        };
        let responseData = await invoke.makeHttpCall_userDataService("post", "findOneAndUpdate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage ) {
            return { success: true, message: responseData.data.statusMessage }
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
        let url;
        let database;
        if(params && params.tenantResponse && params.tenantResponse.success){
            url = params.tenantResponse.message.connectionString+'/'+params.tenantResponse.message.databaseName;
            database = params.tenantResponse.message.databaseName;
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        var getdata = {
            url: url,
			database: database,
            model: "users",
            docType: 1,
            query:{
                filter: { "_id": decodeToken.id },
                update: { $set: {"passportArray":[{"passport": params.passport}]} },
                projection: {
                    id:"$_id",_id:0,browser:"$browser",os:"$os",platform:"$platform",role:"$role",labels:"$labels",
                    exclude:"$exclude",nickname:"$nickname",provider:"$provider",loggedAt:"$loggedAt",ipaddress:"$ipaddress",
                    useragent:"$useragent",referer:"$referer",createdAt:"$createdAt",similar:"$similar",face:"$face",
                    username:"$_id",passport:"$passport",verified:"$verified"
                }
            }
        };
        let responseData = await invoke.makeHttpCall_userDataService("post", "findOneAndUpdate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage ) {
            return { success: true, message: responseData.data.statusMessage }
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