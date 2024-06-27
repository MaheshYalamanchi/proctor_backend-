const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const schedule = require("../auth/sehedule");
var qrcode = require("qrcode");
const jwt_decode = require('jwt-decode');
const _schedule = require('../schedule/schedule')

let getSessions = async (params) => {
    try {
        let fetchTenantResponse = await _schedule.fetchTenant();
        if(fetchTenantResponse && fetchTenantResponse.success){
            fetchTenantResponse.message.forEach(async element => {
                var getdata = {
                    url: element?.connectionString+'/'+element?.databaseName,
                    database: element?.databaseName,
                    model: "rooms",
                    docType: 1,
                    query: {
                        filter:{ complete: { $ne: !0 }, status: "started", updatedAt: { $lt: new Date(Date.now() - 12e4) } },
                        update:{$set:{ status: "paused"}}
                    }   
                };
                // let response = await schedule.fetchdata(getdata)
                let responseData = await invoke.makeHttpCall("post", "updatedataMany", getdata);
                if(responseData && responseData.data && responseData.data.statusMessage.nModified>0) {
                    // let closeconnection = await invoke.makeHttpCall("get", "closeconnection");
                    // for (const iterator of response.data.statusMessage) {
                    //     let jsondata = {
                    //         pausetime : new Date(),
                    //         room : iterator._id
                    //     }
                    //     let reportlog = await invoke.makeHttpCalluserservice("post", "/api/reportlog", jsondata);
                    // }
                    return { success: true, message: 'Status updated successfully...' };
                } else {
                    // let closeconnection = await invoke.makeHttpCall("get", "closeconnection");
                    return { success: false, message: 'Status not updated...' };
                }
            });
        }
        var getdata = {
            url: process.env.MONGO_URI+'/'+process.env.DATABASENAME,
            database: process.env.DATABASENAME,
            model: "rooms",
            docType: 1,
            query: {
                filter:{ complete: { $ne: !0 }, status: "started", updatedAt: { $lt: new Date(Date.now() - 12e4) } },
                update:{$set:{ status: "paused"}}
            }   
        };
        // let response = await schedule.fetchdata(getdata)
        let responseData = await invoke.makeHttpCall("post", "updatedataMany", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage.nModified>0) {
            // let closeconnection = await invoke.makeHttpCall("get", "closeconnection");
            // for (const iterator of response.data.statusMessage) {
            //     let jsondata = {
            //         pausetime : new Date(),
            //         room : iterator._id
            //     }
            //     let reportlog = await invoke.makeHttpCalluserservice("post", "/api/reportlog", jsondata);
            // }
            return { success: true, message: 'Status updated successfully...' };
        } else {
            // let closeconnection = await invoke.makeHttpCall("get", "closeconnection");
            return { success: false, message: 'Status not updated...' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let updateRecord = async (params) => {
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
        let updatedAt = new Date().toISOString()    
        var getdata = {
            url: url,
			database: database,
            model: "rooms",
            docType: 0,
            query: {
                _id: params.room,
                updatedAt: updatedAt
            } 
        };
        let responseData = await invoke.makeHttpCall_roomDataService("post", "saveById", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage) {
            //console.log(JSON.stringify(getdata.query,'update api success'))
            return { success: true, message: responseData.data.statusMessage };
        } else {
            //console.log(JSON.stringify(getdata.query,'update api false'))
            return { success: false, message: 'Status not updated...' };
        }
    } catch (error) {
        console.log(error,'update record erro')
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getRecord = async (params) => {
    try {  
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 1,
            query: {_id:params.room}
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: responseData.data.statusMessage[0]};
        } else {
            return { success: false, message: 'Status not updated...' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getChatDetails = async (params) => {
    try { 
        let Data = [] 
        for (const data of params.attach) {
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "attaches",
                docType: 1,
                query: [
                    // {
                    //     "$addFields": {"test": { "$toString": "$_id" }} 
                    // },
                    {
                        "$match": {"_id":data}
                    },
                    {
                        "$project":{"id":"$_id","filename":"$filename","mimetype":"$mimetype",_id:0}
                    }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if(responseData && responseData.data && responseData.data.statusMessage) {
                Data.push(responseData.data.statusMessage[0])
            } else {
                return { success: false, message: 'data  not found...' };
            }
        }
        if (Data){
            return { success: true, message: Data };
        } else {
            return { success: false, message: 'data  not found...' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getQRcode = async (params) => {
    try { 
        const header = params.authorization.split(" ");
        const authorization = header[1];
        let decodeToken = jwt_decode(params.authorization)
        if(decodeToken){
            let origin = params.body.origin || "";
            let redirect = params.body.redirect || "";
            let token = authorization;
            let exp = new Date(1e3 * decodeToken.exp);
            let data = `${origin}/?token=${token}&redirect=${redirect}`;
            let response = await qrcodeData(data)
            if (response && response.success){
                return { success: true, message: { expires: exp, token: token, url: data, qrcode: response.message } };
            } else {
                return { success: false, message: 'data  not found...' };
            }
        } else {
            return { success: false, message: 'decode token error' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
function qrcodeData(data) {
    return new Promise((resolve, reject) => {
  
        try {
            qrcode.toDataURL(data, { margin: 0 }, function (A, w) {
                if (!w) {
                    resolve({ success: false, message: A })
                } else{
                    resolve({ success: true, message: w })
                }
            });
        } catch (error) {
            reject({ success: false, message: error })
        }
  
 })
};
let getViolated = async (params) => {
    try { 
        let url;
        let database;
        if (params && params.tenantResponse && params.tenantResponse.success){
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
            query: [
                { $match: {
                    $and: [{ "room": params.id },{ 
                    $or: [{ "type": { $in: ["event", "face"] } }]}]
                  }
                },
                { $sort: { createdAt: 1}},
                {
                  $project: { "attach": 1, "metadata.peak": 1 , violation:1}
                },
                {
                  $unwind: { path: "$attach", preserveNullAndEmptyArrays: true }
                },
                {
                  $lookup: {
                    from: 'attaches',
                    localField: 'attach',
                    foreignField: '_id',
                    as: 'data'
                  }
                },
                {
                  $unwind: { path: "$data", preserveNullAndEmptyArrays: true }
                },
                {
                  $project: { data: 1, violation: 1, "metadata.peak": 1 }
                },
                { $match: {
                    $or: [{ "data.filename": "webcam.jpg" },{ "data.filename": "screen.jpg" }]
                    }
                },
                {
                  $addFields: {
                    "peak": {
                      $switch: {
                        branches: [
                          { case: { $eq: ["$metadata.peak", "b1"] }, then: "Browser not supported" },
                          { case: { $eq: ["$metadata.peak", "b2"] }, then: "Focus changed to a different window" },
                          { case: { $eq: ["$metadata.peak", "b3"] }, then: "Full-screen mode is disabled" },
                          { case: { $eq: ["$metadata.peak", "c1"] }, then: "Webcam is disabled" },
                          { case: { $eq: ["$metadata.peak", "c2"] }, then: "Face invisible or not looking into the camera" },
                          { case: { $eq: ["$metadata.peak", "c3"] }, then: "Several faces in front of the camera" },
                          { case: { $eq: ["$metadata.peak", "c4"] }, then: "Face does not match the profile" },
                          { case: { $eq: ["$metadata.peak", "c5"] }, then: "Found a similar profile" },
                          { case: { $eq: ["$metadata.peak", "k1"] }, then: "Atypical keyboard handwriting" },
                          { case: { $eq: ["$metadata.peak", "m1"] }, then: "Microphone muted or its volume is low" },
                          { case: { $eq: ["$metadata.peak", "m2"] }, then: "Conversation or noise in the background" },
                          { case: { $eq: ["$metadata.peak", "m3"] }, then: "Mobile use" },
                          { case: { $eq: ["$metadata.peak", "n1"] }, then: "No network connection" },
                          { case: { $eq: ["$metadata.peak", "n2"] }, then: "No connection to a mobile camera" },
                          { case: { $eq: ["$metadata.peak", "s1"] }, then: "Screen activities are not shared" },
                          { case: { $eq: ["$metadata.peak", "s2"] }, then: "Second display is used"},
                          { case: { $eq: ["$metadata.peak", "h1"] }, then: "Headphone use" }
                        ],
                        default: "$metadata.peak"
                      }
                    }
                  }
                },
                {
                  $project: {
                      "peak": 1,"violation": 1,"screen.id": "$data._id","screen.filename": "$data.filename","screen.createdAt": "$data.createdAt",_id: 0
                      }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: responseData.data.statusMessage};
        } else {
            return { success: false, message: 'data not found...' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let stoped = async (params) => {
    try {
        let url;
        let database;
        if (params && params.tenantResponse && params.tenantResponse.success){
            url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
            database = tenantResponse.message.databaseName;
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
                {
                    $match: { _id: params.id }
                },
                { $lookup: { from: "users",
                    localField: "proctor",
                    foreignField: "_id",
                    as: "proctor" } 
                },
                { "$unwind": { "path": "$proctor", "preserveNullAndEmptyArrays": true } },
                { $lookup: { from: "users",
                    localField: "student",
                    foreignField: "_id",
                    as: "student" } 
                },
                { "$unwind": { "path": "$student", "preserveNullAndEmptyArrays": true } },
                {$project:{"id":"$_id",_id:0,addons:"$addons","api":"$api","averages":"$averages","browser":"$browser",
                "comment":"$comment","complete":"$complete","conclusion":"$conclusion","concurrent":"$concurrent",
                "createdAt":"$createdAt","deadline":"$deadline","duration":"$duration","error":"$error","incidents":"$incidents",
                "integrator":"$integrator","invites":"$invites","ipaddress":"$ipaddress","lifetime":"$lifetime","locale":"$locale","members":"$members",
                "metrics":"$metrics","os":"$os","platform":"$platform","proctor.id":"$proctor._id","proctor.browser":"$proctor.browser","proctor.createdAt":"$proctor.createdAt",
                "proctor.exclude":"$proctor.exclude","proctor.group":"$proctor.group","proctor.ipaddress":"$proctor.ipaddress","proctor.labels":"$proctor.labels","proctor.lang":"$proctor.lang",
                "proctor.locked":"$proctor.locked","proctor.loggedAt":"$proctor.loggedAt","proctor.nickname":"$proctor.nickname","proctor.os":"$proctor.os","proctor.platform":"$proctor.platform",
                "proctor.role":"$proctor.role","proctor.secure":"$proctor.secure","proctor.similar":"$proctor.similar","proctor.useragent":"$proctor.useragent","proctor.username":"$proctor.username",
                "quota":"$quota","rules":"$rules","scheduledAt":"$scheduledAt","score":"$score","signedAt":"$signedAt","startedAt":"$startedAt","status":"$status","stoppedAt":"$stoppedAt","student.id":"$student._id",
                "student.browser":"$student.browser","student.createdAt":"$student.createdAt","student.exclude":"$student.exclude","student.face":"$student.face","student.ipaddress":"$student.ipaddress","student.passport":"$student.passport",
                "student.labels":"$student.labels","student.loggedAt":"$student.loggedAt","student.nickname":"$student.nickname","student.os":"$student.os","student.platform":"$student.platform","student.provider":"$student.provider",
                "student.referer":"$student.referer","student.role":"$student.role","student.similar":"$student.similar","student.useragent":"$student.useragent","student.username":"$student._id","subject":"$subject",
                "tags":"$tags","template":"$template","threshold":"$threshold","timeout":"$timeout","timesheet":"$timesheet","timezone":"$timezone","updatedAt":"$updatedAt","url":"$url","useragent":"$useragent","weights":"$weights"}}
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
let roomstatusUpdate = async (params) => {
    try {
        let status={
            status:params.status
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 0,
            query: {
                filter: { "_id": params.room },
                update: { $set: status }
            }
        };
        let response = await invoke.makeHttpCall("post", "update", getdata);
        if (response && response.data && response.data.statusMessage && response.data.statusMessage.nModified == 1) {
            return { success: true, message: "status updated" }
        } else {
            return { success: false, message: 'Data Not Found' }
        }
    } catch (erroe) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let timeoutupdate = async (params) => {
    try {
        let  decodeToken = jwt_decode(params.header.authorization);
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
        var getdata = {
            url: url,
            database: database,
            model: "rooms",
            docType: 0,
            query: {
                filter: { "_id": params.params.roomId },
                update: {$set: { timeout:  params.body.timeout}}
            }
        };
        let response = await invoke.makeHttpCall("post", "update", getdata);
        if (response && response.data && response.data.statusMessage ) {
            return { success: true, message: "Timeout updated" }
        } else {
            return { success: false, message: 'Data Not Found' }
        }
    } catch (erroe) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
module.exports = {
    getSessions,
    updateRecord,
    getRecord,
    getChatDetails,
    getQRcode,
    getViolated,
    stoped,
    roomstatusUpdate,
    timeoutupdate
}