const invoke = require("../../lib/http/invoke");
const scheduleService = require("../auth/schedule.service");
const globalMsg = require('../../configuration/messages/message');
let roomUserDetails = async (params) => {
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
        var userdata = {
            url: url,
			database: database,
            model: "users",
            docType: 1,
            query: [
                {
                    $match: { _id: params._id }
                },
                {
                    $unwind: "$similar"
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'similar.user',
                        foreignField: '_id',
                        as: 'data',
                    }
                },
                { $unwind: { path: "$data", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        user: {
                            "id": "$data._id",
                            "face": "$data.face",
                            "nickname": "$data.nickname",
                            "username": "$data._id",
                            "password": "$data.password"
                        },
                        "distance": "$similar.distance"
                    }
                }
            ]
        }
        let responseData = await invoke.makeHttpCall("post", "aggregate", userdata);
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
let roomUserEdit = async (params) => {
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
        var postdata = {
            url: url,
			database: database,
            model: "rooms",
            docType: 1,
            query: [
                {
                    $match: { _id: params.id }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", postdata);
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
let roomUserDelete = async (params) => {
    try{
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 1,
            query: {
                _id: params._id
            }
        };
        let responseData = await invoke.makeHttpCall("post", "removeData", getdata);
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
let roomUserSave = async (params) => {
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
            query: [
                {
                    $match: { _id: params.id }
                }
            ]
        };
        let getData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (getData) {
            return getData;
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
let userEdit = async (params) => {
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
        var postdata = {
            url: url,
			database: database,
            model: "users",
            docType: 1,
            query: [
                {
                    $match: { _id: params.id }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", postdata);
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
let UserSave = async (params) => {
    try{
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
            query: [
                {
                    $match:{_id:params._id}
                },
                {
                    $project:{"id":"$_id","username":"$_id",_id:0,createdAt:1,exclude:1,group:1,labels:1,lang:1,locked:1,nickname:1,role:1,secure:1,similar:1,face:1,passport:1}
                }
            ]
        };
        let getData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(getData){
            return getData;
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let UserDelete = async (params) => {
    try{
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
                _id:params._id
            }  
        };
        let responseData = await invoke.makeHttpCall("post", "removeData", getdata);
        if(responseData){
            return responseData;
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let MessageSend = async (params) => {
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
            query: [
                { $match: {"id": params._id }  },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "user",
                        "foreignField": "_id",
                        "as": "data"
                    }
                },
                {
                    "$lookup": {
                        "from": "attaches",
                        "localField": "attach",
                        "foreignField": "_id",
                        "as": "attach"
                    }
                },
                {"$unwind": {"path": "$data","preserveNullAndEmptyArrays": true}},
                {"$unwind": {"path": "$attach","preserveNullAndEmptyArrays": true}},
                {
                    "$group": {"_id": "$_id","createdAt": { "$first": "$createdAt" },"message": { "$first": "$message" },"room": { "$first": "$room" },
                        "type": { "$first": "$type" },"metadata": { "$first": "$metadata" },"user": { "$first": "$data" },
                        "attach": {
                            "$push": {
                                "id": "$attach._id",
                                "filename": "$attach.filename",
                                "mimetype": "$attach.mimetype"
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "attach": 1,"createdAt": 1,"id": "$_id","message": 1,"room": 1,"type": 1,"_id": 0,"metadata": 1,
                        "user": {
                            "id": "$user._id",
                            "nickname": "$user.nickname",
                            "username": "$user._id",
                            "role": "$user.role"
                        }
                    }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            // let attachResponse,getMessage;
            // if(responseData.data.statusMessage[0].attach){
                // attachResponse = await scheduleService.getAttach(responseData.data.statusMessage[0].attach[0]);
                // if(attachResponse){
                //     responseData.data.statusMessage[0].attach[0] = attachResponse.data.statusMessage[0]
                    if(params && params.tenantResponse && params.tenantResponse.success){
                        responseData.data.statusMessage[0].tenantResponse = params.tenantResponse;
                    }
                    let response = await scheduleService.getcount(responseData.data.statusMessage[0]);
                    var getdata = {
                        url: url,
			            database: database,
                        model: "rooms",
                        docType: 0,
                        query: {
                                filter: { "_id": responseData.data.statusMessage[0].room },
                                update: {$set: { incidents:  response.data.statusMessage[0].incidents}}
                        }
                    };
                    let Data = await invoke.makeHttpCall("post", "findOneAndUpdate", getdata)
                    console.log(Data.data.statusMessage)
                    console.log(Data.data.statusMessage,'jflksdjflksdjflkdsjkl')
                    if(response.data.statusMessage&& response.data.statusMessage[0].incidents){
                        if(!responseData.data.statusMessage[0].metadata){
                            responseData.data.statusMessage[0].metadata={}
                        }
                        responseData.data.statusMessage[0].metadata.pauseURL=Data.data.statusMessage.pauseURL
                        responseData.data.statusMessage[0].metadata.incidents= response.data.statusMessage[0].incidents
                    }else{
                        response.data.statusMessage[0].incidents=0
                    }
                    console.log(response.data.statusMessage[0],'MessageSend',response.data.statusMessage[0].pauseURL)
                    return responseData;
            //     } 
            // }else{
            //     return responseData
            // }
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
let roomSubmitSave = async (params) => {
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
        var postdata = {
            url: url,
			database: database,
            model: "rooms",
            docType: 1,
            query: [
                {
                    $match: { _id: params.query.id }
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
                {$project:{"id":"$_id",deliveryId:"$deliveryId",_id:0,addons:"$addons","api":"$api","averages":"$averages","browser":"$browser",
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
                "tags":"$tags","template":"$template","threshold":"$threshold","timeout":"$timeout","timesheet":"$timesheet","timezone":"$timezone","updatedAt":"$updatedAt","url":"$url","useragent":"$useragent","weights":"$weights","student.rating":"$student.rating"}}
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", postdata);
        if (responseData) {
            if(responseData.data.statusMessage[0].conclusion != null){
                data = responseData.data.statusMessage[0].student.username
                ratingdata = responseData.data.statusMessage[0].student.rating
                if(responseData.data.statusMessage[0].conclusion === "positive"){
                    var B = 100 
                }else if (responseData.data.statusMessage[0].conclusion === "negative"){
                    var B =0
                }
                "number" == typeof ratingdata? (ratingdata= Math.ceil((ratingdata+ B) / 2)) : (ratingdata = B)
                var getdata = {
                    url: url,
                    database: database,
                    model: "users",
                    docType: 0,
                    query: {
                    filter :{ "_id": data},
                    update: {$set: { rating: ratingdata}},
                    }
                };
                let result = await invoke.makeHttpCall("post", "update", getdata);
            }
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
let attachCall = async (params) => {
    try{
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "attaches",
            docType: 1,
            query:{ "_id": params._id }
            //[
                // { $match: { $expr : { $eq: [ '$_id' , { $toObjectId: params._id } ] } } },
                // {
                //     "$addFields": { "test": { "$toString": "$_id" } }
                // },
                // {
                //     "$project":{"_id" : 0,"id": "$test" ,"createdAt":1,"filename":1,"mimetype":1,"size":1,"user":1 }
                // }
                // {
                //     "$addFields": { "id": { "$toString": "$_id" } }
                // },
            //     {
            //         $match: { "_id": params._id }
            //     },
            //     {
            //         "$project":{"attached" : 0}
            //     }
            // ]
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
        if(responseData){
            return responseData;
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let getTemplate = async(params) => {
    try{
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
            query:[
                {
                    $match: { "template": params._id }
                },
                {
                    $project :{_id:"$_id"}
                },
                {
                    $group:{_id:null, array:{$push:"$_id"}}
                },
                {
                    $project:{array:true,_id:false}
                }
            ] 
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(responseData){
            return responseData;
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
}
let updateTemplate = async(params) => {
    try{
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
            docType: 0,
            query:{
                filter :{_id:{$in:params.array}},
                update :{$set:{members:params.members}}
            } 
        };
        let responseData = await invoke.makeHttpCall("post", "updatedataMany", getdata);
        if(responseData){
            return responseData;
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
}
let chatincidents = async(params) => {
    try{
        let url;
        let database;
        if(params && params.tenantResponse && params.tenantResponse.success){
            url = params.tenantResponse.message.connectionString+'/'+params.tenantResponse.message.databaseName;
            database = params.tenantResponse.message.databaseName;
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        jsonData = {
            "type" : params.data.body.type,
            "metadata" : {
                "incidents" : params.count
            },
            "user" : params.data.body.user,
            "room" : params.data.body.room,
            "message" : params.data.body.message,
            "createdAt" : new Date(),
        }
        var getdata = {
            url: url,
			database: database,
            model: "chats",
            docType: 0,
            query: jsonData
        };
        let responseData = await invoke.makeHttpCall("post", "write", getdata);
        if(responseData){
            return responseData;
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
}
let fetchdata = async (params) => {
    try {
        var userdata = {
            url: params.url,
            database: params.database,
            model: "rooms",
            docType: 1,
            query: params.query.filter
        }
        let response = await invoke.makeHttpCall("post", "read", userdata);
        if (response) {
            return response;
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
let logtimeupdate = async (params) => {
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
        const date = new Date()
        var postdata = {
            url: url,
            database: database,
            model: "users",
            docType: 0,
            query: {
                filter :{"_id": params.student.id},
                update: {$set: { loggedAt: date}},
              }
        };
        let responseData = await invoke.makeHttpCall("post", "update", postdata);
        if (responseData) {
            return responseData
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
    roomUserDetails,
    roomUserEdit,
    roomUserDelete,
    roomUserSave,
    userEdit,
    UserSave,
    UserDelete,
    MessageSend,
    roomSubmitSave,
    attachCall,
    getTemplate,
    updateTemplate,
    chatincidents,
    fetchdata,
    logtimeupdate
}