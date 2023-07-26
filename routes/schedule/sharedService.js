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

let getCandidateMessageSend = async (params) => {
    try {
        var decodeToken = jwt_decode(params.headers.authorization);
        params.body.createdAt = new Date();
        params.body.room = params.params.roomId;
        params.body.user = decodeToken.id;
        delete params.body.headers;
        if(params.params.roomId == "sendToAll"){
            var data = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "rooms",
                docType: 1,
                query: [
                    { $match: { "members": "defaultproctor" }},
                    { $group: {_id: params.params.roomId, count: { $sum: 1 }}},
                    {$project: {_id: 1,count: 1 }}
                ]
            };
            let response = await invoke.makeHttpCall("post", "aggregate", data)
            if(response && response.data && response.data.statusMessage[0].count){
                jsonData = {
                    count : response.data.statusMessage[0].count,
                    data : params
                }
                let responseData = await schedule.chatincidents(jsonData)
                if (responseData && responseData.data && responseData.data.statusMessage) {
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
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
                docType: 0,
                query: params.body
            };
            let response = await invoke.makeHttpCall("post", "write", getdata);
            if (response && response.data && response.data.statusMessage._id) {
                let responseData = await schedule.MessageSend(response.data.statusMessage._id);
                if (responseData && responseData.data && responseData.data.statusMessage) {
                    let messageData=responseData.data.statusMessage[0]
                    messageData.attach = messageData.attach.filter(obj => Object.keys(obj).length !== 0);
                    return { success: true, message: messageData }
                } else {
                    return { success: false, message: 'Data Not Found' };
                }
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
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
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
    console.log(params,"params=======>>>>>>>>")
    decodeToken = jwt_decode(params.authorization)
    try {
        let takePhotoThreshHold,validationVal;
        let userResponse = await scheduleService.userDetails(decodeToken);
        console.log(userResponse,"userResponse======>>>>>")
        if (userResponse && userResponse.success){
            // var threshold = userResponse.message[0].threshold || 0.25;
            var distance = 0;
            if (userResponse.message[0].rep.length === params.rep.length){
                for (let A = 0; A < userResponse.message[0].rep.length; A++) {
                            const B = userResponse.message[0].rep[A] - params.rep[A];
                            distance += B * B;
                }
                takePhotoThreshHold=userResponse.message[0].threshold
                verified = distance <= takePhotoThreshHold
            }else{
                for (let A = 0; A < params.rep.length; A++) {
                    const B = -0 - params.rep[A];
                    distance += B * B;
                }
                takePhotoThreshHold=(Math.round(distance)+1)/10
                verified = 0 <= takePhotoThreshHold
            }
            
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
            console.log(similarfaces,"similarfaces=======>>>>>")
            if (similarfaces && similarfaces.data.success){
                if (verified == true){
                    params.message = similarfaces.data.message;
                    params.distance = distance;
                    params.verified = verified;
                    params.threshold = takePhotoThreshHold;
                    let response = await scheduleservice.faceResponse(params);
                    console.log(JSON.stringify(response),"response1===========>>>>>")
                    if (response.success){
                        var getdata = {
                            url:process.env.MONGO_URI,
                            database:"proctor",
                            model: "attaches",
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
                        console.log(responseData.data,"responseData========>>>>>>")
                        if (responseData && responseData.data && responseData.data.statusMessage) {
                            return { success: true, message: responseData.data.statusMessage[0] }
                        } else {
                            return { success: false, message: 'Data Not Found' };
                        }
                    } else {
                        return { success: false, message: response.message };
                    } 
                } else {
                    params.similar = similarfaces.data.message;
                    params.distance = distance;
                    params.verified = verified;
                    params.threshold = takePhotoThreshHold;
                    let response = await scheduleservice.missMatchResponse(params);
                    console.log(response,"response2=======>>>>>")
                    if (response.success){
                        var getdata = {
                            url:process.env.MONGO_URI,
                            database:"proctor",
                            model: "attaches",
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
                        console.log(responseData.data,"responseData2========>>>>>>")
                        if (responseData && responseData.data && responseData.data.statusMessage) {
                            return { success: true, message: responseData.data.statusMessage[0] }
                        } else {
                            return { success: false, message: 'Data Not Found' };
                        }
                    } else {
                        return { success: false, message: response.message };
                    } 
                }
            } else {
                return { success: false, message: 'similarfaces error' };
            }    
        } else {
            return { success: false, message: userResponse.message };
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
            "storagefilename":params.myfile.newFilename,
            "filename":params.myfile.originalFilename,
            "mimetype":params.myfile.mimetype,
            "size":params.myfile.size,
            "user":decodeToken.id,
            "attached" : true
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "attaches",
            docType: 0,
            query: jsonData
        };
        let response = await invoke.makeHttpCall("post", "write", getdata);
        if (response && response.data && response.data.statusMessage._id) {
            let getRecord = await shared.getRecord(decodeToken)
            if (getRecord && getRecord.success){
                let updatedRecord= await shared.updateRecord(getRecord.message);
                if(updatedRecord && updatedRecord.success){
                    let responseData = await schedule.attachCall(response.data.statusMessage);
                    if (responseData && responseData.data && responseData.data.statusMessage) {
                        return { success: true, message: responseData.data.statusMessage[0] }
                    } else {
                        return { success: false, message: 'Data Not Found' };
                    }
                } else {
                    return { success: false, message: updatedRecord.message }
                }
            } else {
                return { success: false, message: getRecord.message }
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
        let getdata;
        if (decodeToken && decodeToken.videoass == "VA"){
            getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "rooms",
                docType: 1,
                query: [
                        {
                            $match:{_id:params.query.id}
                        },
                        {
                            $project:{
                                addons:"$addons",api:"$api",comment:"$comment",complete:"$complete",conclusion:"$conclusion",concurrent:"$concurrent",
                                createdAt:"$createdAt",deadline:"$deadline",error:"$error",integrator:"$integrator",
                                invites:"$invites",lifetime:"$lifetime",locale:"$locale",members:"$members",metrics:"$metrics",
                                proctor:"$proctor",quota:"$quota",rules:"$rules",scheduledAt:"$scheduledAt",
                                status:"$status",stoppedAt:"$stoppedAt",student:"$student",subject:"$subject",tags:"$tags",
                                template:"$template",threshold:"$threshold",timeout:"$timeout",timesheet:"$timesheet",timezone:"$timezone",updatedAt:"$updatedAt",
                                url:"$url",weights:"$weights",id:"$_id",_id:0
                            }
                        }
                    ]
            };
        } else {
            if(params.body.body.error !== null){
                data = {
                    id : params.query.id,
                    body : params.body.body.error
                }
                let responsemessage = await scheduleService.errorupdate(data)
            }
            getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "rooms",
                docType: 1,
                query: [
                        {
                            $match:{_id:params.query.id}
                        },
                        {
                            $project:{
                                addons:"$addons",api:"$api",comment:"$comment",complete:"$complete",conclusion:"$conclusion",concurrent:"$concurrent",
                                createdAt:"$createdAt",deadline:"$deadline",duration:"$duration",error:"$error",incidents:"$incidents",integrator:"$integrator",
                                invites:"$invites",ipaddress:"$ipaddress",lifetime:"$lifetime",locale:"$locale",members:"$members",metrics:"$metrics",
                                proctor:"$proctor",quota:"$quota",rules:"$rules",scheduledAt:"$scheduledAt",score:"$score",signedAt:"$signedAt",
                                startedAt:"$startedAt",status:"$status",stoppedAt:"$stoppedAt",student:"$student",subject:"$subject",tags:"$tags",
                                template:"$template",threshold:"$threshold",timeout:"$timeout",timesheet:"$timesheet",timezone:"$timezone",updatedAt:"$updatedAt",
                                url:"$url",useragent:"$useragent",weights:"$weights",id:"$_id",_id:0
                            }
                        }
                    ]
            };
        }
        
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
    decodeToken = jwt_decode(params.authorization)
    try {
        if (decodeToken){
            let userResponse = await scheduleService.userDetails(decodeToken);
            if (userResponse && userResponse.success){
                var thresold = params.thresold || 0.45;
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
                        verified : verified,
                        similar : similarfaces.data.message,
                        userId : decodeToken.id,
                        rep : params.rep
                    }
                    let getDetails = await scheduleService.usersDetailsUpdate(jsonData);
                    if (getDetails.success){
                        let userData = await scheduleService.userDetails(decodeToken);
                        if (userData && userData.success){
                            params.message = userData.message[0];
                            let response = await scheduleservice.passportResponse(params);
                            if (response.success){
                                var getdata = {
                                    url:process.env.MONGO_URI,
                                    database:"proctor",
                                    model: "attaches",
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
                        } else {
                            return { success: false, message: userData.message }
                        }
                    }else {
                        let userData = await scheduleService.userDetails(decodeToken);
                        if (userData && userData.success){
                            params.message = userData.message[0];
                            let response = await scheduleservice.passportResponse(params);
                            if (response.success){
                                var getdata = {
                                    url:process.env.MONGO_URI,
                                    database:"proctor",
                                    model: "attaches",
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
                        } else {
                            return { success: false, message: userData.message }
                        }
                    }
                } else {
                    return { success: false, message: 'similar face error' }
                }
            } else {
                return { success: false, message: userResponse.message }
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
        let response = await scheduleService.getCandidateDetailsUpdate(params);
        if(response && response.success){
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
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
let getCandidateDetailsStop = async (params) => {
    try {
        let response = await scheduleService.getCandidateDetailsUpdateStop(params);
        if(response && response.success){
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
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
        console.log(err)
        return {success:false,message:'Data not found...'};
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
        console.log(err)
        return {success:false,message:'Data not found...'};
    }
};
let stoppedAt = async (params) => {
    try {
        var date = new Date()
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 0,
            query: {
                filter: { "_id": params.id },
                update: { $set: { stoppedAt: date ,status : "stopped"} }
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage.nModified>0) {
            let status = await shared.stoped(params.id);
            if (status && status.success){
                let violatedResponse = await shared.getViolated(status.message);
                if(violatedResponse && violatedResponse.success){
                    try {
                        let roomData = status.message;
                        let jsonData = {
                                "score": roomData.score,
                                "student": roomData.student.id,
                                "email": roomData.tags[0],
                                "labels": roomData.labels ||"-",
                                "verified": "yes",
                                "id": roomData.id,
                                "face": roomData.student.face,
                                "passport": roomData.student.passport,
                                "subject": roomData.subject,
                                "startedat": roomData.startedAt,
                                "stoppedat": roomData.stoppedAt ||new Date() ,
                                "credibility" :"0%",
                                "conclusion": roomData.conclusion || "-",
                                "proctor": roomData.members,
                                "comment": roomData.comment,
                                "averages": roomData.averages,
                                "xaxis": roomData.timesheet.xaxis,
                                "yaxis": roomData.timesheet.yaxis,
                                "metrics": roomData.metrics,
                                "screen" : violatedResponse.message
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
        console.log(err)
        return {success:false,message:'Data not found...'};
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
    getCandidateDetails,
    getCandidateDetailsStop,
    mobilecheck,
    headphonecheck,
    stoppedAt
}