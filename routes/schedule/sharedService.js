const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const schedule = require("../auth/sehedule");
const jwt_decode = require('jwt-decode');
var jwt = require('jsonwebtoken');
const TOKEN_KEY ="eime6Daeb2xanienojaefoh4";
const tokenService = require('../../routes/proctorToken/tokenService');
const scheduleservice = require('../auth/schedule.service');
const scheduleService = require('../schedule/scheduleService');

let getCandidateMessageSend = async (params) => {
    try {
        var decodeToken = jwt_decode(params.headers.authorization);
        params.body.createdAt = new Date();
        params.body.room = params.params.userId;
        params.body.user = decodeToken.id;
        delete params.body.headers;
        var getdata = {
            url: process.env.MONGO_URI,
            client: "chats",
            docType: 0,
            query: params.body
        };
        let response = await invoke.makeHttpCall("post", "write", getdata);
        if (response && response.data && response.data.iid) {
            let responseData = await schedule.MessageSend(response.data.iid);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
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
let getMessageTemplates = async (params) => {
    try {
        start = 0;
        count = 0;
        var getdata = {
            url: process.env.MONGO_URI,
            client: "Blank",
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
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query: [
                { $match: { _id: params } }
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
            url: process.env.MONGO_URI,
            client: "Blank",
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
    decodeToken = jwt_decode(params.headers)
    try {
        let userResponse = await scheduleService.userDetails(decodeToken);
        if (userResponse && userResponse.success){
            var thresold = params.thresold || 0.25;
            var distance = 0;
            if (userResponse.message[0].rep.length === params.rep.length){
                for (let A = 0; A < userResponse.message[0].rep[0].length; A++) {
                            const B = userResponse[0].rep[A] - params.rep[A];
                            distance += B * B;
                        }
                    }
            var verified = distance <= thresold
            var getData = {
                url: process.env.MONGO_URI,
                client: "users",
                docType: 0,
                query : {
                    "query":{"locked":{"$ne":true},"rep":{"$ne":null},"role":"student"},
                    "scope":{
                        "c":0,
                        "e":[userResponse.message[0]._id],
                        "n":10,
                        "s":params.rep,
                        "t":0.15
                    },
                    "out":"myCollections",
                    "sort":{ "loggedAt": -1 },
                    "limit":1000
                }
            }
            var similarfaces = await invoke.makeHttpCallmapReduce('post','/mapReduce',getData);
            if (similarfaces && similarfaces.data.success){
                var jsonData = {
                    thresold : thresold,
                    distance : distance,
                    verified : verified,
                    similar : similarfaces.data.message,
                    userId : decodeToken.id,
                    rep : params.rep
                }
                let getDetails = await scheduleService.usersDetailsUpdate(jsonData);
                if (getDetails.success){
                    let userData = await scheduleService.userFetch(decodeToken);
                    if (userData && userData.success){
                        params.message = userData.message[0];
                        let response = await scheduleservice.faceResponse(params);
                        if (response.success){
                            var getdata = {
                                url: process.env.MONGO_URI,
                                client: "attaches",
                                docType: 1,
                                query: [
                                        {
                                            "$addFields": { "test": { "$toString": "$_id" } }
                                        },
                                        {
                                            "$match": { "test": response.message }
                                        },
                                        {
                                            "$project": { "id": "$_id","_id":0,user:"$user",filename:"$filename",mimetype:"$mimetype",size:"$size",
                                                        metadata:"$metadata",createdAt:"$createdAt",attached:"$attached"}
                                        }
                                    ]
                            };
                            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
                            if (responseData && responseData.data && responseData.data.statusMessage) {
                                return { success: true, message: responseData.data.statusMessage[0] }
                            } else {
                                return { success: false, message: 'Data Not Found' };
                            }
                        } else {
                            return { success: false, message: 'Data not found' };
                        } 
                    } else {
                        return { success: false, message: 'Data not found' };
                    } 
                } else {
                    return { success: false, message: 'similarfaces error' };
                }    
        } else {
            return { success: false, message: 'faceDetails insertion error' };
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
let attachmentPostCall = async (params) => {
    decodeToken = jwt_decode(params.headers)
    var createdAt = new Date()
    try {
        var jsonData = {
            "createdAt":createdAt,
            "filename":params.myfile.originalFilename,
            "mimetype":params.myfile.mimetype,
            "size":params.myfile.size,
            "user":decodeToken.id,
            "attached" : true
        }
        var getdata = {
            url: process.env.MONGO_URI,
            client: "attaches",
            docType: 0,
            query: jsonData
        };
        let response = await invoke.makeHttpCall("post", "write", getdata);
        if (response && response.data && response.data.iid) {
            let responseData = await schedule.attachCall(response.data);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
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
let tokenValidation = async(params,req)=> {
    const token =params.body.authorization.authorization.split(" ");
    try {
        if (!token) {
            return {success:false,message:"A token is required for authentication"};
        }else{
            const decodedToken = jwt.verify(token[1],TOKEN_KEY);
            decodedToken.headers = params.body.authorization;
            if(decodedToken){
                let userResponse = await scheduleService.userFetch(decodedToken);
                var responseData ;				
                if (userResponse&&userResponse.message&&(userResponse.message.length>0) &&(userResponse.message[0]._id == decodedToken.username)){
                        let response = await scheduleService.userUpdate(userResponse.message[0]);
                        if (response && response.success){
                            responseData = await scheduleService.roomUpdate(decodedToken)
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
        console.log(error)
        if(error){
            return {success:false, message:"TokenExpiredError"}
        }else{
            return {success:false, message:error}
        }
    }
};
let getDatails = async (params) => {
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query: [
                    {$match:{_id:params.query.id}},
                ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
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
let getPassportPhotoResponse = async (params) => {
    decodeToken = jwt_decode(params.headers)
    try {
        if (params){
            let response = await scheduleservice.faceResponse(params);
            if (response.success){
                var getdata = {
                    url: process.env.MONGO_URI,
                    client: "attaches",
                    docType: 1,
                    query: [
                        {
                            "$addFields": { "test": { "$toString": "$_id" } }
                        },
                        {
                            "$match": { "test": response.message }
                        },
                        {
                            "$project": { "id": "$_id","_id":0,user:"$user",filename:"$filename",mimetype:"$mimetype",size:"$size",
                                          "metadata.distance":"$metadata.distance","metadata.threshold":"$metadata.threshold",
                                          "metadata.verified":"$metadata.verified","metadata.objectnew":"$metadata.objectnew", 
                                          "metadata.rep":"$metadata.rep",createdAt:"$createdAt"}
                        }
                    ]
                };
                let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
                if (responseData && responseData.data && responseData.data.statusMessage) {
                    return { success: true, message: responseData.data.statusMessage[0] }
                } else {
                    return { success: false, message: 'Data Not Found' };
                }
            } else {
                return { success: false, message: 'faceDetails insertion error' }
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
let getCandidateDetails = async (params) => {
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
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
    getPassportPhotoResponse,
    getCandidateDetails
}