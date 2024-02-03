const invoke = require("../../lib/http/invoke");
const schedule = require("../auth/sehedule");
const globalMsg = require('../../configuration/messages/message');
const crypto =require("crypto");
var bowser = require("bowser");
// const logger =require('../../logger/logger')
let proctorRoomUserEdit = async (params) => {
    try {
        var updatedAt = new Date();
        params.updatedAt = updatedAt;
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 0,
            query: {
                filter: { "_id": params.id },
                update: { $set: params }
            }
        };
        let response = await invoke.makeHttpCall("post", "update", getdata);
        if (response && response.data && response.data.statusMessage && response.data.statusMessage.nModified>0) {
            let responseData = await schedule.roomUserEdit(params);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                if (responseData.data.statusMessage[0].status == "template"){
                    let templateResponse = await schedule.getTemplate(responseData.data.statusMessage[0]);
                    if (templateResponse && templateResponse.data && templateResponse.data.statusMessage.length >0){
                        let jsonData = {
                            members : params.members,
                            array : templateResponse.data.statusMessage[0].array
                        }
                        let updateTemplate = await schedule.updateTemplate(jsonData);
                        if(updateTemplate && updateTemplate.data && updateTemplate.data.statusMessage.nModified >0){
                            console.log('nModified true')
                            //logger.info({ success: true, message: updateTemplate.data.statusMessage });
                        } else {
                            console.log('nModified false')
                            //logger.info({ success: false, message: "records updated not successfully..." });
                        }
                    } else {
                        return { success: false, message: templateResponse };
                    }
                }
                responseData.data.statusMessage[0].id = responseData.data.statusMessage[0]._id;
                delete responseData.data.statusMessage[0]._id;
                return { success: true, message: responseData.data.statusMessage[0] };
            } else {
                return { success: false, message: 'Data Not Found' };
            }
        } else {
            return { success: false, message: 'Data Not Found' }
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let proctorDeleteSaveCall = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 0,
            query:{
                filter :{"_id": params.UserId},
                update: {$set: { isActive : false}},
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: "User Deleted Sucessfully..."};
        } else {
            return { uccess: false, message: 'Data Not Found' }
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let UserLimitCall = async (params) => {
    try {
        if (params.query && params.query.limit && params.query.start && params.query.count && params.query.continue && params.query.sort) {
            let Y = params.query.sort;
            for (let A in Y) {
                const B = Y[A];
                ("1" !== B && "asc" !== B) || (Y[A] = 1), 
                ("-1" !== B && "desc" !== B) || (Y[A] = -1);
            }
            var sort;
            if(Y.id){
                sort = Y
                sort._id = sort.id;
                delete sort.id;
            }else{
                sort = Y
            }
            var limit = parseInt(params.query.limit);
            var start = parseInt(params.query.start);
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "users",
                docType: 1,
                query: [
                    { $match: { isActive: true } },
                    { "$sort": sort },
                    { "$skip": start },
                    { "$limit": limit },
                    {
                        $project: {
                            id: "$_id", _id: 0, browser: "$browser", createdAt: "$createdAt", exclude: "$exclude", group: "$group",
                            ipaddress: "$ipaddress", labels: "$labels", lang: "$lang", locked: "$locked", loggedAt: "$loggedAt",
                            nickname: "$nickname", os: "$os", platform: "$platform", role: "$role", secure: "$secure", similar: "$similar",
                            useragent: "$useragent", username: "$_id",face:"$face",rating:"$rating",referer:"$referer",provider:"$provider",
                            passport:"$passport",verified:"$verified"
                        }
                    }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data) {
                var getdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "users",
                    docType: 1,
                    query:[{ $group: { _id: null, count: { $sum: 1 } } }]
                }
                let getCount = await invoke.makeHttpCall("post", "aggregate", getdata);
                if (getCount && getCount.data){
                    return { success: true, message: { data: responseData.data.statusMessage, pos: start, total_count: getCount.data.statusMessage[0].count } }
                }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query && params.query.limit ||params.query.limit && params.query.start && params.query.count && params.query.continue) {
            var start;
            if(params.query.start){
                start = parseInt(params.query.start)
            } else {
                start = 0;
            }
            var limit = parseInt(params.query.limit)
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "users",
                docType: 1,
                query: [
                    { $match: { isActive: true } },
                    {
                        $sort: { createdAt: -1 } 
                    },
                    { $skip: start },
                    { "$limit": limit },
                    {
                        $project: {
                            id: "$_id", _id: 0, browser: "$browser", createdAt: "$createdAt", exclude: "$exclude", group: "$group",
                            ipaddress: "$ipaddress", labels: "$labels", lang: "$lang", locked: "$locked", loggedAt: "$loggedAt",
                            nickname: "$nickname", os: "$os", platform: "$platform", role: "$role", secure: "$secure", similar: "$similar",
                            useragent: "$useragent", username: "$_id",face:"$face",rating:"$rating",referer:"$referer",provider:"$provider",
                            passport:"$passport",verified:"$verified"
                        }
                    }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data) {
                var getdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "users",
                    docType: 1,
                    query:[{ $group: { _id: null, count: { $sum: 1 } } }]
                }
                let getCount = await invoke.makeHttpCall("post", "aggregate", getdata);
                if (getCount && getCount.data){
                    return { success: true, message: { data: responseData.data.statusMessage, pos: start, total_count: getCount.data.statusMessage[0].count } }
                }
            } else {
                return { success: false, message: 'Data Not Found' }
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
let UserSearchCall = async (params) => {
    try {
        if (params.query.limit && params.query.filter && params.query.start && params.query.count && params.query.continue && params.query.sort) {
            let Y = params.query.sort;
            for (let A in Y) {
                const B = Y[A];
                ("1" !== B && "asc" !== B) || (Y[A] = 1), 
                ("-1" !== B && "desc" !== B) || (Y[A] = -1);
            }
            let sort = Y;
            var limit = parseInt(params.query.limit);
            var start = parseInt(params.query.start);
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "users",
                docType: 1,
                query: [
                    { $match: { isActive: true } },
                    {
                        $match: {
                            $or: [
                                { nickname: { $regex: params.query.filter, $options: 'i' } },
                                { role: { $regex: params.query.filter, $options: 'i' } },
                                { _id: { $regex: params.query.filter, $options: 'i' } },
                                { loggedAt: { $regex: params.query.filter, $options: 'i' } }
                            ]
                        }
                    },
                    {
                        $project: {
                            id: "$_id", _id: 0, browser: "$browser", createdAt: "$createdAt", exclude: "$exclude", group: "$group",
                            ipaddress: "$ipaddress", labels: "$labels", lang: "$lang", locked: "$locked", loggedAt: "$loggedAt",
                            nickname: "$nickname", os: "$os", platform: "$platform", role: "$role", secure: "$secure", similar: "$similar",
                            useragent: "$useragent", username: "$_id",face:"$face",rating:"$rating",referer:"$referer",provider:"$provider",
                            passport:"$passport",verified:"$verified"
                        }
                    },
                    { "$sort": sort },
                    { "$skip": start },
                    { "$limit": limit },
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data) {
                var getdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "users",
                    docType: 1,
                    query:[
                        { $match: { isActive: true } },
                        {
                            $match: {
                                $or: [
                                    { nickname: { $regex: params.query.filter, $options: 'i' } },
                                    { role: { $regex: params.query.filter, $options: 'i' } },
                                    { _id: { $regex: params.query.filter, $options: 'i' } },
                                    { loggedAt: { $regex: params.query.filter, $options: 'i' } }
                                ]
                            }
                        },
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ]
                }
                let getCount = await invoke.makeHttpCall("post", "aggregate", getdata);
                if (getCount && getCount.data){
                    return { success: true, message: { data: responseData.data.statusMessage, pos: start, total_count: getCount.data.statusMessage[0].count } }
                }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query.limit && params.query.filter || params.query.limit && params.query.filter && params.query.start && params.query.count) {
            var start;
            if (params.query.start){
                start = parseInt(params.query.start)
            }else{
                start = 0;
            }
            var limit = parseInt(params.query.limit);
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "users",
                docType: 1,
                query: [
                    { $match: { isActive: true } },
                    {
                        $match: {
                            $or: [
                                { nickname: { $regex: params.query.filter, $options: 'i' } },
                                { role: { $regex: params.query.filter, $options: 'i' } },
                                { _id: { $regex: params.query.filter, $options: 'i' } },
                                { loggedAt: { $regex: params.query.filter, $options: 'i' } }
                            ]
                        }
                    },
                    {
                        $project: {
                            id: "$_id", _id: 0, browser: "$browser", createdAt: "$createdAt", exclude: "$exclude", group: "$group",
                            ipaddress: "$ipaddress", labels: "$labels", lang: "$lang", locked: "$locked", loggedAt: "$loggedAt",
                            nickname: "$nickname", os: "$os", platform: "$platform", role: "$role", secure: "$secure", similar: "$similar",
                            useragent: "$useragent", username: "$_id",face:"$face",rating:"$rating",referer:"$referer",provider:"$provider",
                            passport:"$passport",verified:"$verified"
                        }
                    },
                    { "$limit": limit },
                    { "$skip": start },
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data) {
                var getdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "users",
                    docType: 1,
                    query:[
                        {
                            $match: {
                                $or: [
                                    { nickname: { $regex: params.query.filter, $options: 'i' } },
                                    { role: { $regex: params.query.filter, $options: 'i' } },
                                    { _id: { $regex: params.query.filter, $options: 'i' } },
                                    { loggedAt: { $regex: params.query.filter, $options: 'i' } }
                                ]
                            }
                        },
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ]
                }
                let getCount = await invoke.makeHttpCall("post", "aggregate", getdata);
                if (getCount && getCount.data && getCount.data.statusMessage != 0){
                    return { success: true, message: { data: responseData.data.statusMessage, pos: start, total_count: getCount.data.statusMessage[0].count } }
                }else{
                    return { success: true, message: { data: responseData.data.statusMessage, pos: start, total_count: 0 } }
                }
            } else {
                return { success: false, message: 'Data Not Found' }
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
let UserEdit = async (params) => {
    try {
        // delete params.id;
        // if(params.labels === null){
        //     params.labels = []
        // }
        var buffer = crypto.randomBytes(32);
        const salt = buffer.toString('base64')
        var password = params.password
        const hasspassword =crypto.createHmac("sha1", salt).update(password).digest("hex");
        if ( params.face &&  params.passport  ) {
            params.verified = true
        }
        params.hashedPassword = hasspassword
        params.salt = salt
        if(params.face == null){
            params.verified = null
        }else if(params.passport == null){
            params.verified = null
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 0,
            query: {
                filter: { "_id": params.username },
                update: { $set: params }
            }
        };
        let response = await invoke.makeHttpCall("post", "update", getdata);
        if (response && response.data && response.data.statusMessage && response.data.statusMessage.nModified == 1) {
            let responseData = await schedule.userEdit(params);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                delete responseData.data.statusMessage[0].password;
                return { success: true, message: responseData.data.statusMessage[0] };
            } else {
                return { success: false, message: 'Data Not Found' };
            }
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
let proctorUserSaveCall = async (params) => {
    var buffer = crypto.randomBytes(32);
    const salt = buffer.toString('base64')
    const hasspassword =crypto.createHmac("sha1", salt).update(params.password).digest("hex");
    let username = params.username.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'_');
    var locked = Boolean(params.locked);
    var secure = Boolean(params.secure);
    if(params.labels === null){ 
        params.labels = []
    }
    if ( params.face &&  params.passport  ) {
        params.verified = true
    }
    var g = bowser;
    const B = g.parse(params.bower)
    try{
        var createdAt = new Date()
        var jsonData = { 
            "_id" : username,
            "role" :params.role,
            "labels" :params.labels,
            "exclude" : [],
            "rep" : [],
            "salt" : salt,
            "hashedPassword" : hasspassword,
            "nickname" : params.nickname,
            "group" : params.group,
            "lang" : params.lang,
            "locked" : locked,
            "secure" : secure,
            "createdAt" : createdAt,
            "similar" : [],
            "face" : params.face,
            "passport" : params.passport,
            "verified" : params.verified || null,
            "isActive" : true,
            "browser" : B.browser,
            "os" : B.os,
            "platform" : B.platform
        }
        if(params.role = "administrator"  && params.face != undefined){
            var getdata = {
                url:process.env.MONGO_URI,
                database: "proctor",
                model: "attaches",
                docType: 1,
                query: [
                  {
                    "$match": { _id: params.face }
                  },
                  {
                    $project: { _id:0, metadata:1}
                  }
                ]
              };
              let response = await invoke.makeHttpCall("post", "aggregate", getdata);
              jsonData.rep = response.data.statusMessage[0].metadata.rep
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database: "proctor",
            model: "users",
            docType: 1,
            query: [
              {
                "$match": { _id: params.username }
              },
              {
                $project: { _id:1, isActive:1}
              }
            ]
          };
          let response = await invoke.makeHttpCall("post", "aggregate", getdata);
          if (response && response.data.statusMessage.length>0) {
            var getdata = {
                url:process.env.MONGO_URI,
                database: "proctor",
                model: "users",
                docType: 0,
                query: {
                  filter :{"_id": params.username},
                  update: {$set: jsonData},
                }
            };
            let responseData = await invoke.makeHttpCall("post", "update", getdata);
            let getData = await schedule.UserSave(response.data.statusMessage[0]._id);
            if (getData && getData.data && getData.data.statusMessage) {
                getData.data.statusMessage[0].id = getData.data.statusMessage[0]._id;
                delete getData.data.statusMessage[0]._id;
                return { success: true, message: getData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
          } else{
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "users",
                docType: 0,
                query: jsonData
            };
            let responseData = await invoke.makeHttpCall("post", "insert", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage._id) {
                let getData = await schedule.UserSave(responseData.data.statusMessage._id);
                if (getData && getData.data && getData.data.statusMessage) {
                    getData.data.statusMessage[0].id = getData.data.statusMessage[0]._id;
                    delete getData.data.statusMessage[0]._id;
                    return { success: true, message: getData.data.statusMessage[0] }
                } else {
                    return { success: false, message: 'Data Not Found' }
                }
            } else {
                return { success: false, message: 'Data Not Found' }
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
let proctorUserDeleteCall = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 0,
            query: {
                // _id: params.UserId
                filter :{"_id": params.UserId},
                update: {$set: { isActive : false}},
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            let response = await schedule.UserDelete(responseData.data.statusMessage[0]);
        }
        if (responseData && responseData.data) {
            responseData.data.statusMessage[0].id = responseData.data.statusMessage[0]._id;
            delete responseData.data.statusMessage[0]._id;
            delete responseData.data.statusMessage[0].salt;
            delete responseData.data.statusMessage[0].hashedPassword;
            return { success: true, message: responseData.data.statusMessage[0] }
        } else {
            return { success: false, message: 'Data Not Found' }
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getCandidateMessageCount = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 1,
            query: {
                _id: params.room
            }
        };
        let responseData = await invoke.makeHttpCall("post", "readData", getdata);
        if (responseData && responseData.data) {
            return { success: true, message: {} }
        } else {
            return { success: false, message: 'Data Not Found' }
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let fetchjobs = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 1,
            query: [
                 {$addFields: { "attrs": {_id:"$_id",name:"$name",type:"$type",data:"$data",lastModifiedBy:"$lastModifiedBy",nextRunAt:"$nextRunAt",priority:"$priority",
                repeatInterval:"$repeatInterval",lockedAt:"$lockedAt",lastRunAt:"$lastRunAt",failCount:"$failCount",failReason:"$failReason",failedAt:"$failedAt",
                lastFinishedAt:"$lastFinishedAt",repeatTimezone:"$repeatTimezone"} } },
                {$project:{"attrs":1,"_id":0}}
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data) {
            return { success: true, message: responseData.data.statusMessage }
        } else {
            return { success: false, message: 'Data Not Found' }
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
    proctorRoomUserEdit,
    proctorDeleteSaveCall,
    UserLimitCall,
    UserSearchCall,
    UserEdit,
    proctorUserSaveCall,
    proctorUserDeleteCall,
    getCandidateMessageCount,
    fetchjobs
}