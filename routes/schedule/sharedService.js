const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const schedule = require("../auth/sehedule");
const jwt_decode = require('jwt-decode');
var jwt = require('jsonwebtoken');
const TOKEN_KEY ="eime6Daeb2xanienojaefoh4";
const tokenService = require('../../routes/proctorToken/tokenService');
const scheduleservice = require('../auth/schedule.service');
const scheduleService = require('../schedule/scheduleService');
const shared = require("../../routes/shared/shared");
const logger = require('../../logger/logger');
const _ = require('lodash');
const _schedule = require('../schedule/schedule')

let getCandidateMessageSend = async (params) => {
    try {
        var decodeToken = jwt_decode(params.headers.authorization);
        let url;
        let database;
        let tenantResponse;
        if(decodeToken && decodeToken.tenantId){
            tenantResponse = await _schedule.getTennant(decodeToken);
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
            params.body.createdAt = new Date();
            params.body.room = params.params.roomId;
            params.body.user = decodeToken.id;
            delete params.body.headers;
            if(params.params.roomId == "sendToAll"){
                var data = {
                    url: url,
                    database: database,
                    model: "rooms",
                    docType: 1,
                    query: [
                        { $match: { "members": decodeToken.id }},
                        { $group: {_id: params.params.roomId, count: { $sum: 1 }}},
                        {$project: {_id: 1,count: 1 }}
                    ]
                };
                let response = await invoke.makeHttpCall("post", "aggregate", data)
                if(response && response.data && response.data.statusMessage[0].count){
                    jsonData = {
                        count : response.data.statusMessage[0].count,
                        data : params,
                        tenantResponse: tenantResponse
                    }
                    let responseData = await schedule.chatincidents(jsonData)
                    if (responseData && responseData.data && responseData.data.statusMessage) {
                        // let result = await schedule.MessageSend(responseData.data.statusMessage._id);
                        return { success: true, message: responseData.data.statusMessage }
                    } else {
                        return { success: false, message: 'Data Not Found' };
                    }
                }else{
                    return { success: false, message: 'Data Not Found' }
                }
            }else{
                params.body.notification = "unread"
                var getdata = {
                    url: url,
                    database: database,
                    model: "chats",
                    docType: 0,
                    query: params.body
                };
                let response = await invoke.makeHttpCall("post", "write", getdata);
                if (response && response.data && response.data.statusMessage._id) {
                    if (tenantResponse && tenantResponse.success){
                        response.data.statusMessage.tenantResponse = tenantResponse;
                    }
                    let responseData = await schedule.MessageSend(response.data.statusMessage);
                    if (responseData && responseData.data && responseData.data.statusMessage) {
                        // let messageData=responseData.data.statusMessage[0]
                        // messageData.attach = messageData.attach.filter(obj => Object.keys(obj).length !== 0);
                        return { success: true, message: responseData.data.statusMessage[0] }
                    } else {
                        return { success: false, message: 'Data Not Found' };
                    }
                } else {
                    return { success: false, message: 'Data Not Found' };
                }
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
let getMessageTemplates = async (params) => {
    try {
        start = 0;
        count = 0;
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "Blank",
            docType: 1,
            query: params
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
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
let roomUserDatails = async (params) => {
    try {
        let decodeToken = jwt_decode(params.authorization);
        let url;
        let database;
        let tenantResponse;
        if(decodeToken && decodeToken.tenantId){
            tenantResponse = await _schedule.getTennant(decodeToken);
            if (tenantResponse && tenantResponse.success){
                url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                database = tenantResponse.message.databaseName;
            } else {
                return { success: false, message: tenantResponse.message }
            }
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        var getdata = {
            url: url,
            database: database,
            model: "rooms",
            docType: 1,
            query: [
                { $match: { _id: params.userId} }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            responseData.data.statusMessage[0].id = responseData.data.statusMessage[0]._id;
            delete responseData.data.statusMessage[0]._id;
            return { success: true, message: responseData.data.statusMessage[0] }
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
let MessageTemplates = async (params) => {
    try {
        start = 0;
        count = 0;
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "Blank",
            docType: 1,
            query: params
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
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
let getNewChatMessagesV2 = async (params) => {
    try {
        if (params) {
            return { success: true, message: { data: {} , success:true} }
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
let getFaceResponse = async (params) => {
    
    try {
        decodeToken = jwt_decode(params.authorization);
        if (decodeToken){
            let url;
            let database;
            let tenantResponse;
            if(decodeToken && decodeToken.tenantId){
                tenantResponse = await _schedule.getTennant(decodeToken);
                if (tenantResponse && tenantResponse.success){
                    url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                    database = tenantResponse.message.databaseName;
                    decodeToken.tenantResponse = tenantResponse;
                }else {
                        return { success: false, message: tenantResponse.message }
                    }
            } else {
                url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
                database = process.env.DATABASENAME;
            }
            let takePhotoThreshHold,validationVal;
            let userResponse = await scheduleService.userDetails(decodeToken);
            if (userResponse && userResponse.success){
                var distance = 0;
                if (userResponse.message[0].rep.length === params.rep.length){
                    var A=0
                    _.map(userResponse.message[0].rep, (item) => {
                        const B = item - params.rep[A];
                        A++
                        return distance += B * B;
                    });
                    takePhotoThreshHold=0.25
                    verified = distance <= takePhotoThreshHold
                }else{
                    _.map(params.rep, (item) => {
                        const B = -0 - item;
                        distance += B * B;
                    });
                    takePhotoThreshHold=(Math.round(distance)+1)/10
                    verified = 0 <= takePhotoThreshHold
                }
                let data = {
                    distance: distance,
                    verified: verified,
                    threshold: takePhotoThreshHold,
                    decodeToken: decodeToken,
                    originalFilename: params.myfile.originalFilename,
                    mimetype: params.myfile.mimetype,
                    size: params.myfile.size,
                    rep: params.rep,
                }
                return { success: true, message: data }
            } else {
                return { success: false, message: userResponse.message };
            }
        } else {
            return { success: false, message: "Invalid Token Error" };
        }
    } catch (error) {
        console.log(error,"face2====>>>>")
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getFaceResponse1 = async (params) => {
    try {
        let response = await scheduleservice.faceResponse(params);
        if (response.success){
            if(params.decodeToken.role == "student"){
                let updatedRecord= await shared.updateRecord(params.decodeToken);
                if (updatedRecord && updatedRecord.success){
                    return { success: true, message: response.message }
                } else {
                    return { success: false, message: updatedRecord.message }
                }
            } else {
                return { success: true, message: response.message }
            }
        } else {
            return { success: false, message: response.message };
        }  
    } catch (error) {
        console.log(error,"face4====>>>>")
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let attachmentPostCall = async (params) => {
   
    try {
        decodeToken = jwt_decode(params.headers)
        if (decodeToken) {
            let url;
            let database;
            let tenantResponse;
            if(decodeToken && decodeToken.tenantId){
                tenantResponse = await _schedule.getTennant(decodeToken);
                if (tenantResponse && tenantResponse.success){
                    url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                    database = tenantResponse.message.databaseName;
                    decodeToken.tenantResponse = tenantResponse;
                }else {
                        return { success: false, message: tenantResponse.message }
                    }
            } else {
                url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
                database = process.env.DATABASENAME;
            }
            var createdAt = new Date()
            var jsonData = {
                "createdAt":createdAt,
                "storagefilename":params.myfile.newFilename,
                "filename":params.myfile.originalFilename,
                "mimetype":params.myfile.mimetype,
                "size":params.myfile.size,
                "user":decodeToken.id,
                "attached" : true
            }
            var getdata = {
                url: url,
                database: database,
                model: "attaches",
                docType: 0,
                query: jsonData
            };
            let response = await invoke.makeHttpCall_roomDataService("post", "write", getdata);
            if (response && response.data && response.data.statusMessage._id) {
                response.data.statusMessage.id = response.data.statusMessage._id
                delete response.data.statusMessage._id
                delete response.data.statusMessage.attached
                let updatedRecord= await shared.updateRecord(decodeToken);
                if(updatedRecord && updatedRecord.message){
                    response.data.statusMessage.status = updatedRecord.message.status
                    return { success: true, message: response.data.statusMessage }
                } else {
                    return { success: false, message: updatedRecord.message }
                }
            } else {
                return { success: false, message: getRecord.message }
            }
        } else {
            return { success: false, message: "Provide proper token" }
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let tokenValidation = async(params)=> {
    try {
        const token =params.body.authorization.authorization.split(" ");
        if (!token) {
            return {success:false,message:"A token is required for authentication"+token[1]};
        }else{
            const decodedToken = jwt.verify(token[1],TOKEN_KEY);
            if(!decodedToken){
                return {success:false,message:"A token is required for authentication"};
            }
            decodedToken.headers = params.body.authorization;
            let username = decodedToken.username.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'_');
            if(decodedToken){
                let userResponse = await scheduleService.userFetch(decodedToken);
                var responseData ;				
                if (userResponse&&userResponse.message&&(userResponse.message.length>0) &&(userResponse.message[0]._id == username)){
                        let response = await scheduleService.userUpdate(userResponse.message[0]);
                        if (response && response.success){
                            let roomsResponse = await scheduleService.roomFetch(decodedToken);
                            if (roomsResponse && roomsResponse.success && (roomsResponse.message.length>0) && (roomsResponse.message[0]._id == decodedToken.id)){
                                responseData = await scheduleService.roomUpdate(decodedToken)
                            } else{
                                responseData = await scheduleService.roomInsertion(decodedToken);
                            }
                            
                        }
                } else { 
                    let response = await scheduleService.userInsertion(decodedToken);
                    if (response && response.success){
                        responseData = await scheduleService.roomInsertion(decodedToken);
                    } else {
                        return {success:false,message:"user insertion failed..."}
                    }
                }
                if (responseData.success){
                    let getToken = await tokenService.jwtToken(decodedToken);
                    if (getToken) {
                        return{success:true,message:{token:getToken}};
                    }else{
                        return {success:false, message : 'Error While Generating Token!'};
                    }
                }
            }else{
                return {success:false, message : 'Data Not Found'};
            }
        }
    }catch(error){
        console.log('jwtapicallfailed')
        console.log(error,"jwtError2===>>>>")
        if(error){
            return {success:false, message:"TokenExpiredError"}
        }else{
            return {success:false, message:error}
        }
    }
};
let getDatails = async (params) => {
    try {  
        decodeToken = jwt_decode(params.body.authorization)
        let tenantResponse;
        let url;
        let database;
        if(decodeToken && decodeToken.tenantId ){
            tenantResponse = await _schedule.getTennant(decodeToken);
            if (tenantResponse && tenantResponse.success){
                url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                database = tenantResponse.message.databaseName;
            } else {
                return { success: false, message: tenantResponse.message }
            }
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        let getdata;
        if (decodeToken && decodeToken.videoass == "VA"){
            getdata = {
                url: url,
                database: database,
                model: "rooms",
                docType: 1,
                query: {_id:params.query.id}
            };
        } else {
            getdata = {
                url: url,
                database: database,
                model: "rooms",
                docType: 1,
                query: {_id:params.query.id}
            };
        }
        let responseData = await invoke.makeHttpCall_roomDataService("post", "read", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            if(params.body.body.error !== null){
                params.body.body.createdAt = new Date()
                const data = {
                    id : params.query.id,
                    body : params.body.body,
                    error : responseData.data.statusMessage[0].error,
                    tenantResponse: tenantResponse,
                    approvalRequest : params?.body?.body?.approvalRequest
                }
                let responsemessage = await scheduleService.errorupdate(data)
            }else if(params?.body?.body?.approve){
                const data = {
                    id : params.query.id,
                    approvalRequest : params?.body?.body?.approvalRequest
                  
                }
                let responsemessage = await scheduleService.updateApproveStatus(data)
            }
            else{
                const data = {
                    ipaddress : body.body.ipaddress,
                    id : params.query.id,
                }
                let responsemessage = await scheduleService.updateIpAddress(data)
            }
            responseData.data.statusMessage[0].id = responseData.data.statusMessage[0]._id;
            delete responseData.data.statusMessage[0]._id
            return { success: true, message: responseData.data.statusMessage[0] }
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
let getPassportPhotoResponse1 = async (params) => {
    decodeToken = jwt_decode(params.authorization)
    try {
        if (decodeToken){
            let url;
            let database;
            let tenantResponse;
            if(decodeToken && decodeToken.tenantId){
                tenantResponse = await _schedule.getTennant(decodeToken);
                if (tenantResponse && tenantResponse.success){
                    url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                    database = tenantResponse.message.databaseName;
                    decodeToken.tenantResponse = tenantResponse;
                }else {
                        return { success: false, message: tenantResponse.message }
                    }
            } else {
                url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
                database = process.env.DATABASENAME;
            }
            params.decodeToken = decodeToken;
            let response = await scheduleservice.passportResponse1(params);
            if (response && response.success){
                // response.rep = params.rep;
                response.decodeToken = decodeToken
                return { success: response.success, message: response }
            }  else {
                return { success: response.success, message: response.message};
            }  
        } else {
            return { success: false, message: "Invalid Token Error" }
        }
    } catch (error) {
        console.log(error,"passport2====>>>>")
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getPassportPhotoResponse2 = async (params) => {
    try {
        let getDetails = await scheduleService.usersDetailsUpdate(params);
        if (getDetails.success){
            let response = await scheduleservice.passportResponse2(params);
            if (response.success){
                return { success: true, message:  response.message}
            } else {
                return { success: false, message: response.message }
            }
        }else {
            let response = await scheduleservice.passportResponse2(params);
            if (response.success){
                return { success: true, message: response.message }
            } else {
                return { success: false, message: response.message }
            }
        }
    } catch (error) {
        console.log(error,"passport4====>>>>")
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getCandidateDetails = async (params) => {
    try {
        if (params && params.query && params.query.id) {
            let response = await scheduleService.getCandidateDetailsUpdate(params);
            if(response && response.success){
                return { success: true, message: response.message }
            } else {
                return { success: false, message: 'rooms updation error' };
            }
        } else {
            return { success: false, message: 'Invalid Params Error' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getCandidateDetailsStop = async (params) => {
    try {
        let url;
        let database;
        if(params && params.body && params.body.authorization){
            let decodedToken = jwt_decode(params.body.authorization);
            if (decodedToken && decodedToken.tenantId){
                tenantResponse = await _schedule.getTennant(decodedToken);
                if (tenantResponse && tenantResponse.success){
                    url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                    database = tenantResponse.message.databaseName;
                    params.tenantResponse = tenantResponse;
                } else {
                    return { success: false, message: tenantResponse.message }
                }
            }
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        let response = await scheduleService.getCandidateDetailsUpdateStop(params);
        if(response && response.success){
            var getdata = {
                url: url,
                database: database,
                model: "rooms",
                docType: 1,
                query: [
                    {$match : { _id:params.id}},
                    {$project:{ id:"$_id",_id:0,timesheet:"$timesheet",invites:"$invites",quota:"$quota",concurrent:"$concurrent",members:"$members",addons:"$addons",
                                metrics:"$metrics",weights:"$weights",status:"$status",tags:"$tags",subject:"$subject",locale:"$locale",timeout:"$timeout",rules:"$rules",
                                threshold:"$threshold",createdAt:"$createdAt",updatedAt:"$updatedAt",api:"$api",comment:"$comment",complete:"$complete",conclusion:"$conclusion",
                                deadline:"$deadline",stoppedAt:"$stoppedAt",timezone:"$timezone",url:"$url",lifetime:"$lifetime",error:"$error",scheduledAt:"$scheduledAt",
                                duration:"$duration",incidents:"$incidents",integrator:"$integrator",ipaddress:"$ipaddress",score:"$score",signedAt:"$signedAt",startedAt:"$startedAt",
                                useragent:"$useragent",proctor:"$proctor",student:"$student",template:"$template",browser:"$browser",os:"$os",platform:"$platform"}}
                    ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                const data= {
                    userID : responseData.data.statusMessage,
                    ipadress : params.body.ipAddress,
                    tenantResponse : tenantResponse
                }
                let result = await scheduleService.userDetailsUpdate(data)
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' };
            }
        } else {
            return { success: false, message: 'rooms updation error' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let mobilecheck = async (params) => {
    var decodeToken = jwt_decode(params.bearer)
    try {
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
            model: "rooms",
            docType: 1,
            query: [
                { $match : { "_id" : decodeToken.room } },
                { $project : { _id : 0 , id:"$_id" , averages : 1 ,weights:1 , metrics :1} }
            ]
        };
        let responseData = await invoke.makeHttpCall_roomDataService("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            if(!responseData.data.statusMessage[0].averages){
                responseData.data.statusMessage[0].averages = {
                    "b1" : 0,
                    "b2" : 0,
                    "b3" : 0,
                    "c1" : 0,
                    "c2" : 0,
                    "c3" : 0,
                    "c4" : 0,
                    "c5" : 0,
                    "k1" : 0,
                    "m1" : 0,
                    "m2" : 0,
                    "m3" : 0,
                    "n1" : 0,
                    "n2" : 0,
                    "s1" : 0,
                    "s2" : 0,
                    "h1" : 0
                }
            }
            return { success: true, message: responseData.data.statusMessage[0] }
        }else{
            return {success: false, message:'Data not found...'};
        }
    } catch (err) {
        return {success:false,message:err};
    }
};
let headphonecheck = async (params) => {
    var decodeToken = jwt_decode(params.bearer)
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 1,
            query: [
                { $match : { "_id" : decodeToken.room } },
                { $project : { _id : 0 , id:"$_id" , averages : 1 ,weights:1 , metrics :1} }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: responseData.data.statusMessage[0] }
        }else{
            return {success: false, message:'Data not found...'};
        }
    } catch (err) {
        return {success:false,message:err};
    }
};
let stoppedAt = async (params) => {
    try {
        let url;
        let database;
        let tenantResponse;
        if(params && params.body && params.body.authorization){  
            let decodeToken = jwt_decode(params.body.authorization);
            if(decodeToken && decodeToken.tenantId){
                tenantResponse = await _schedule.getTennant(params);
                if (tenantResponse && tenantResponse.success){
                    url= tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                    database= tenantResponse.message.databaseName;
                    params.tenantResponse = tenantResponse;
                } else {
                    return { success: false, message: tenantResponse.message }
                }
            }else {
                url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
                database = process.env.DATABASENAME; 
            }
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME; 
        }
        var date = new Date()
        var getdata = {
            url: url,
            database: database,
            model: "rooms",
            docType: 0,
            query: {
                filter: { "_id": params.id },
                update: { $set: { stoppedAt: date ,status : "stopped"} }
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage.nModified>0) {
            let status = await shared.stoped(params);
            if (status && status.success){
                if(tenantResponse && tenantResponse.success){
                    status.message.tenantResponse = tenantResponse;
                }
                let result = await schedule.logtimeupdate(status.message)
                let violatedResponse = await shared.getViolated(status.message);
                if(violatedResponse && violatedResponse.success){
                    try {
                        let roomData = status.message;
                        let jsonData = {
                                "score": roomData.score,
                                "student": roomData.student.nickname,
                                "email": roomData.tags[0],
                                "labels": roomData.labels ||"-",
                                "verified": "yes",
                                "id": roomData.id,
                                "face": roomData.student.face,
                                "passport": roomData.student.passport,
                                "subject": roomData.subject,
                                "startedAt": roomData.startedAt,
                                "stoppedAt": roomData.stoppedAt ||new Date() ,
                                "credibility" :"0%",
                                "conclusion": roomData.conclusion || "-",
                                "proctor": roomData.members,
                                "comment": roomData.comment,
                                "averages": roomData.averages,
                                "xaxis": roomData.timesheet.xaxis,
                                "yaxis": roomData.timesheet.yaxis,
                                "metrics": roomData.metrics,
                                "screen" : violatedResponse.message,
                                "browser": roomData.student.browser,
                                "os": roomData.student.os,
                                "ipaddress": roomData.ipaddress,
                                "duration": roomData.duration,
                                "status": roomData.status,
                                "tenantResponse": tenantResponse
                            }
                        let  generateReport = await invoke.makeHttpCallReportService("post", "/v1/generate-pdf", jsonData)
                        if (generateReport) {
                            logger.info({ success: true, message: "pdf report generated successfully..." });
                        } else {
                            logger.info({ success: false, message: "pdf report not generated..." });
                        }
                    }catch(error){
                        logger.info({ success: false, message: "pdf report not generated..." });
                    }
                }
            }
            return { success: true, message: status.message }
        }else{
            return {success: false, message:'Data not found...'};
        }
        
    } catch (err) {
        console.log("err==========>>>>>",err)
        return {success:false,message:err};
    }
};

let fetchMetrics = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 1,
            query: {
                _id: params
            }
        };
        let responseData = await invoke.makeHttpCall_roomDataService("post", "read", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: responseData.data.statusMessage[0] }
        }else{
            return {success: false, message:'Data not found...'};
        }
    } catch (err) {
        return {success:false,message:err};
    }
};
let updatePhotoStatus=async(params)=>{
    try {
        let url,database
        if(params && params.tenantId){
            tenantResponse = await _schedule.getTennant(params);
            if (tenantResponse && tenantResponse.success){
                url= tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
				database= tenantResponse.message.databaseName;
                // params.tenantResponse = tenantResponse;
            } else {
                return { success: false, message: tenantResponse.message }
            }
        }else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME; 
        }
        var getdata = {
            url:url,
            database:database,
            model: "users",
            docType: 0,
            query: {
                filter: { "_id": params.id },
                update: { $set: { verified: params.verified} }
            }
        };
        let response = await invoke.makeHttpCall("post", "update", getdata);
        console.log(response.data.statusMessage,'llllllllllllllllll',JSON.stringify(getdata))
        if(response&&response.data&&response.data.statusMessage&&response.data.statusMessage.nModified){
            return {success:true,message:'Record updated successfully.'};
        }else{
            return {success:false,message:'Something went wrong!'};
        }
    } catch (error) {
        return {success:false,message:'Something went wrong!'};
    }
}
let approvalProcess=async(params)=>{
    try {
        // console.log(params,'body..................')
        let url,database
        if(params && params.authorization){  
            let decodeToken = jwt_decode(params.authorization);
            if(decodeToken && decodeToken.tenantId){
                tenantResponse = await _schedule.getTennant(params);
                if (tenantResponse && tenantResponse.success){
                    url= tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                    database= tenantResponse.message.databaseName;
                    params.tenantResponse = tenantResponse;
                } else {
                    return { success: false, message: tenantResponse.message }
                }
            }else {
                url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
                database = process.env.DATABASENAME; 
            }
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME; 
        }
        let jsonData;
        if(params.verified){
            jsonData = { $set: { verified: params.verified,status:params.status,color:params.color} }
        }else {
            jsonData = { $set: { verified: params.verified,status:params.status,color:params.color,rejectLog:{message:params.rejectLog,createdAt:new Date(),color:params.color}} }
        }
        console.log(jsonData,'approve body')
        var getdata = {
            url:url,
            database:database,
            model: "rooms",
            docType: 0,
            query: {
                filter: { "_id": params.roomid },
                update: jsonData
            }
        };
        let response = await invoke.makeHttpCall("post", "update", getdata);
        // console.log(response.data.statusMessage,'llllllllllllllllll',JSON.stringify(getdata))
        if(response&&response.data&&response.data.statusMessage&&response.data.statusMessage.nModified){
            return {success:true,message:'Candidate approved successfully.'};
        }else{
            return {success:false,message:'Something went wrong!'};
        }
    } catch (error) {
        console.log(error)
        return {success:false,message:'Something went wrong!'};
    }
}
let fetchuserwithroom=async(params)=>{
    try {
        // console.log(params,'body..................')
        let url,database
        if(params && params.authorization){  
            let decodeToken = jwt_decode(params.authorization);
            if(decodeToken && decodeToken.tenantId){
                tenantResponse = await _schedule.getTennant(params);
                if (tenantResponse && tenantResponse.success){
                    url= tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                    database= tenantResponse.message.databaseName;
                    params.tenantResponse = tenantResponse;
                } else {
                    return { success: false, message: tenantResponse.message }
                }
            }else {
                url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
                database = process.env.DATABASENAME; 
            }
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME; 
        }
        var getdata = {
            url:url,
            database:database,
            model: "rooms",
            docType: 1,
            query: [
                {
                    $match:{_id:params.roomid}
                },
                {
                    $lookup:{
                        from:'users',
                        localField:'student',
                        foreignField:'_id',
                        as:'userInfo'
                    }
                },
                { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
                {
                    $project:{
                        _id:"$_id",
                        student:"$student",
                        face:"$userInfo.face",
                        passport:"$userInfo.passport",
                        email:"$userInfo.nickname",
                        browser:"$browser",
                        os:"$os",
                        ip:"$ipaddress",
                        loggedAt:"$userInfo.loggedAt",
                        createdAt:"$userInfo.createdAt",
                        member:"$members",
                        verified:"$verified",
                        faceArray:"$faceArray",
                        passportArray:"$passportArray"
                    }
                }
              ]
        };
        let response = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(response&&response.data&&response.data.statusMessage&&response.data.statusMessage.length){
            return {success:true,message:response.data.statusMessage};
        }else{
            return {success:false,message:'Something went wrong!'};
        }
    } catch (error) {
        console.log(error)
        return {success:false,message:'Something went wrong!'};
    }
}
module.exports = {
    getCandidateMessageSend,
    getMessageTemplates,
    roomUserDatails,
    MessageTemplates,
    getNewChatMessagesV2,
    getFaceResponse,
    attachmentPostCall,
    tokenValidation,
    getDatails,
    getPassportPhotoResponse2,
    getPassportPhotoResponse1,
    getCandidateDetails,
    getCandidateDetailsStop,
    mobilecheck,
    headphonecheck,
    stoppedAt,
    getFaceResponse1,
    fetchMetrics,
    updatePhotoStatus,
    approvalProcess,
    fetchuserwithroom
}