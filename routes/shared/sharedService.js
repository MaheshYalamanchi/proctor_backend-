const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const crypto = require('crypto');
const tokenService = require('../../routes/proctorToken/tokenService');
const jwt_decode = require('jwt-decode');
const schedule = require("../auth/sehedule");
const { v4: uuidv4 } = require('uuid');
const schedule_Service = require('../schedule/schedule.Service');
const search = require('../../routes/search');
const logger =require('../../logger/logger')
const _ = require('lodash');
let proctorLoginCall = async (params) => {
    try {
        var postdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 1,
            query: [
                { $match: { _id: params.username } }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", postdata);
        if (responseData && responseData.data) {
            if(responseData.data.statusMessage[0].locked === false || responseData.data.statusMessage[0].locked === 0 ){
            let salt = responseData.data.statusMessage[0].salt;
            let hashedPassword = responseData.data.statusMessage[0].hashedPassword;
            let encryptPassword = crypto.createHmac("sha1", salt).update(params.password).digest("hex");
            let validPassword = !(!params.password || !salt) && encryptPassword === hashedPassword;
            let response = await tokenService.generateProctorToken(responseData);
            if (validPassword) {
                return {
                    success: true, message: {
                        id: responseData.data.statusMessage[0]._id,
                        role: responseData.data.statusMessage[0].role,
                        roleId: responseData.data.statusMessage[0].roleId,
                        token: response
                    }
                }
                
            } else {
                return { success: false, message: 'Please check password.' }
            }
        }else{
            return { success: false, message: 'Please check password.' }
        }
        } else {
            return { success: false, message: 'Please check username' }
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let proctorMeCall = async (params) => {
    try {
        var decodeToken = jwt_decode(params.authorization);
        console.log(decodeToken.id,'decodeToken.id 1')
        console.log(decodeToken.role,'decodeToken.role 2')
        if(decodeToken && decodeToken.room == "check"){
            return { success: true, message: "null" }
        }else if(decodeToken && decodeToken.role == "student"){
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "users",
                docType: 1,
                query: decodeToken.id
                // [
                //     {
                //         $match: { _id: decodeToken.id }
                //     },
                //     {
                //         $project: {
                //             id: "$_id", _id: 0, browser: "$browser", createdAt: "$createdAt", exclude: "$exclude", group: "$group",
                //             ipaddress: "$ipaddress", labels: "$labels", lang: "$lang", locked: "$locked", loggedAt: "$loggedAt",
                //             nickname: "$nickname", os: "$os", platform: "$platform", role: "$role", secure: "$secure", similar: "$similar",
                //             useragent: "$useragent", username: "$_id",provider:"$provider",referer:"$referer",face:"$face",passposrt:"$passport",
                //             verified:"$verified"
                //         }
                //     }
                // ]
            };
            let responseData = await invoke.makeHttpCall("post", "findById", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                responseData.data.statusMessage.id = responseData.data.statusMessage._id;
                delete responseData.data.statusMessage._id
                return { success: true, message: responseData.data.statusMessage }
                // if (responseData && responseData.data && responseData.data.statusMessage[0] && (responseData.data.statusMessage[0].similar>0)){
                //     let response = await schedule_Service.userInfo(decodeToken)
                //     if (response.success){
                //         responseData.data.statusMessage[0].similar = response.message
                //         return { success: true, message: responseData.data.statusMessage[0] }
                //     }
                // } else {
                //     return { success: true, message: responseData.data.statusMessage[0] }
                // }
                
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (decodeToken && decodeToken.role == "administrator") {
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "users",
                docType: 1,
                query: [
                    {
                        $match: { _id: decodeToken.id }
                    },
                    {
                        $project: {
                            id: "$_id", _id: 0, browser: "$browser", createdAt: "$createdAt", exclude: "$exclude", group: "$group",
                            ipaddress: "$ipaddress", labels: "$labels", lang: "$lang", locked: "$locked", loggedAt: "$loggedAt",
                            nickname: "$nickname", os: "$os", platform: "$platform", role: "$role", secure: "$secure", similar: "$similar",
                            useragent: "$useragent", username: "$_id",provider:"$provider",referer:"$referer"
                        }
                    }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (decodeToken && decodeToken.role == "proctor") {
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "users",
                docType: 1,
                query: [
                    {
                        $match: { _id: decodeToken.id }
                    },
                    {
                        $project: {
                            id: "$_id", _id: 0, browser: "$browser", createdAt: "$createdAt", exclude: "$exclude", group: "$group",
                            ipaddress: "$ipaddress", labels: "$labels", lang: "$lang", locked: "$locked", loggedAt: "$loggedAt",
                            nickname: "$nickname", os: "$os", platform: "$platform", role: "$role", secure: "$secure", similar: "$similar",
                            useragent: "$useragent", username: "$_id"
                        }
                    }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        }
    } catch (error) {
        console.log(error,"userError2=======>>>>>>")
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let proctorFetchCall = async (params) => {
    var decodeToken = jwt_decode(params.authorization);
    try {
        if (decodeToken && decodeToken.room){
            let getdata;
            if(decodeToken && decodeToken.videoass == "VA"){
                getdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "rooms",
                    docType: 1,
                    query: [
                        {
                            "$match": { 
                                "student": decodeToken.id ,
                                "_id" : decodeToken.room
                            }
                        },
                        {
                            "$lookup": {
                                from: 'users',
                                localField: 'student',
                                foreignField: '_id',
                                as: 'student',
                            }
                        },
                        {
                            "$unwind": { "path": "$student", "preserveNullAndEmptyArrays": true }
                        },
                        {
                            "$project": {
                                id: "$_id", _id: 0, addons: "$addons", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion",
                                concurrent: "$concurrent", createdAt: "$createdAt", deadline: "$deadline", invites: "$invites", lifetime: "$lifetime",
                                locale: "$locale", members: "$members", metrics: "$metrics", proctor: "$proctor", quota: "$quota", rules: "$rules",
                                scheduledAt: "$scheduledAt", status: "$status", stoppedAt: "$stoppedAt","student.browser":"$student.browser",subject: "$subject",
                                tags: "$tags", threshold: "$threshold", timeout: "$timeout", timesheet: "$timesheet", timezone: "$timezone",
                                updatedAt: "$updatedAt", url: "$url", weights: "$weights",browser:"$browser",averages:"$averages",
                                error:"$error",integrator:"$integrator",os:"$os",platform:"$platform",template:"$template","student.createdAt":"$student.createdAt",
                                "student.exclude":"$student.exclude","student.face":"$student.face","student.id":"$student._id","student.ipaddress":"$student.ipaddress",
                                "student.labels":"$student.labels","student.loggedAt":"$student.loggedAt","student.nickname":"$student.nickname","student.os":"$student.os",
                                "student.passport":"$student.passport","student.platform":"$student.platform","student.provider":"$student.provider","student.referer":"$student.referer",
                                "student.role":"$student.role","student.similar":"$student.similar","student.useragent":"$student.useragent","student.username":"$student._id",
                                "student.verified":"$student.verified"
                            }
                        }
                    ]
                }; 
            } else if (decodeToken.room=="check"){
                getdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "rooms",
                    docType: 1,
                    query: [
                        {
                            "$match": { 
                                "_id" : decodeToken.room
                            }
                        },
                        {
                            "$project": {
                                id: "$_id", _id: 0, addons: "$addons", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion",
                                concurrent: "$concurrent", createdAt: "$createdAt", deadline: "$deadline", invites: "$invites", lifetime: "$lifetime",
                                locale: "$locale", members: "$members", metrics: "$metrics", proctor: "$proctor", quota: "$quota", rules: "$rules",
                                scheduledAt: "$scheduledAt", status: "$status", stoppedAt: "$stoppedAt",subject: "$subject",
                                tags: "$tags", threshold: "$threshold", timeout: "$timeout", timesheet: "$timesheet", timezone: "$timezone",
                                updatedAt: "$updatedAt", url: "$url", weights: "$weights",browser:"$browser",averages:"$averages",duration:"$duration",
                                error:"$error",incidents:"$incidents",integrator:"$integrator",ipaddress:"$ipaddress",os:"$os",platform:"$platform",
                                score:"$score",signedAt:"$signedAt",template:"$template",useragent:"$useragent",startedAt:"$startedAt"
    
                            }
                        }
                    ]
                };
            }
            else {
                getdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "rooms",
                    docType: 1,
                    query: [
                        {
                            "$match": { 
                                "student": decodeToken.id ,
                                "_id" : decodeToken.room
                            }
                        },
                        {
                            "$lookup": {
                                from: 'users',
                                localField: 'student',
                                foreignField: '_id',
                                as: 'student',
                            }
                        },
                        {
                            "$unwind": { "path": "$student", "preserveNullAndEmptyArrays": true }
                        },
                        {
                            "$project": {
                                id: "$_id", _id: 0, addons: "$addons", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion",
                                concurrent: "$concurrent", createdAt: "$createdAt", deadline: "$deadline", invites: "$invites", lifetime: "$lifetime",
                                locale: "$locale", members: "$members", metrics: "$metrics", proctor: "$proctor", quota: "$quota", rules: "$rules",
                                scheduledAt: "$scheduledAt", status: "$status", stoppedAt: "$stoppedAt","student.browser":"$student.browser",subject: "$subject",
                                tags: "$tags", threshold: "$threshold", timeout: "$timeout", timesheet: "$timesheet", timezone: "$timezone",
                                updatedAt: "$updatedAt", url: "$url", weights: "$weights",browser:"$browser",averages:"$averages",duration:"$duration",
                                error:"$error",incidents:"$incidents",integrator:"$integrator",ipaddress:"$ipaddress",os:"$os",platform:"$platform",
                                score:"$score",signedAt:"$signedAt",template:"$template",useragent:"$useragent",startedAt:"$startedAt","student.createdAt":"$student.createdAt",
                                "student.exclude":"$student.exclude","student.face":"$student.face","student.id":"$student._id","student.ipaddress":"$student.ipaddress",
                                "student.labels":"$student.labels","student.loggedAt":"$student.loggedAt","student.nickname":"$student.nickname","student.os":"$student.os",
                                "student.passport":"$student.passport","student.platform":"$student.platform","student.provider":"$student.provider","student.referer":"$student.referer",
                                "student.role":"$student.role","student.similar":"$student.similar","student.useragent":"$student.useragent","student.username":"$student._id",
                                "student.verified":"$student.verified"
    
                            }
                        }
                    ]
                };
            }
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage.length) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: true, message: {} }
            }
        } else {
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "rooms",
                docType: 1,
                query: [
                    {
                        "$match": { 
                            "student": decodeToken.id 
                        }
                    },
                    {
                        "$lookup": {
                            from: 'users',
                            localField: 'student',
                            foreignField: '_id',
                            as: 'student',
                        }
                    },
                    {
                        "$unwind": { "path": "$student", "preserveNullAndEmptyArrays": true }
                    },
                    {
                        "$project": {
                            id: "$_id", _id: 0, addons: "$addons", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion",
                            concurrent: "$concurrent", createdAt: "$createdAt", deadline: "$deadline", invites: "$invites", lifetime: "$lifetime",
                            locale: "$locale", members: "$members", metrics: "$metrics", proctor: "$proctor", quota: "$quota", rules: "$rules",
                            scheduledAt: "$scheduledAt", status: "$status", stoppedAt: "$stoppedAt", student: "$student", subject: "$subject",
                            tags: "$tags", threshold: "$threshold", timeout: "$timeout", timesheet: "$timesheet", timezone: "$timezone",
                            updatedAt: "$updatedAt", url: "$url", weights: "$weights"
                        }
                    }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage.length) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: true, message: {} }
            }
        }
    } catch (error) {
        console.log(error,"fetchError2=======>>>>")
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let proctorAuthCall = async (params) => {
    try {
        var decodeToken = jwt_decode(params.authorization);
        if(decodeToken.room=="check"){
            let response = await tokenService.authCheckToken(decodeToken);
            if(response){
                var token = jwt_decode(response);
                if (decodeToken.exp){
                    return {success: true, message: { exp :token.exp, iat: token.iat, id: token.id,
                        role: token.role,token: response,room:token.room}
                    }
                } else {
                    return {success: true, message: { iat: token.iat, id: token.id,
                        role: token.role,token: response,room:token.room}
                    }
                }
                
            }
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 1,
            query: decodeToken.id
            // [
            //     { $match: { _id: decodeToken.id } }
            // ]
        };
        let responseData = await invoke.makeHttpCall("post", "findById", getdata);
        if (responseData && responseData.data) {
            var splitToken = params.authorization.split(" ");
            if (decodeToken && decodeToken.room && decodeToken.provider){
                return {success: true, message: {exp: decodeToken.exp, iat: decodeToken.iat, id: responseData.data.statusMessage._id,
                        role: responseData.data.statusMessage.role,token: splitToken[1],provider:decodeToken.provider,room:decodeToken.room}
                }
            } else { 
                return {
                    success: true, message: {
                        exp: decodeToken.exp, iat: decodeToken.iat, id: responseData.data.statusMessage._id,
                        role: responseData.data.statusMessage.role,
                        token: splitToken[1]
                    }
                }
            }
        } else {
            return { success: false, message: 'Data Not Found' }
        }
    } catch (error) {
        console.log(error,"authError2====>>>>")
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let proctorLimitCall = async (params) => {
    try {
        var newparams = params.headers.authorization
        var decodeToken = jwt_decode(newparams);
        if (decodeToken.role == "proctor"){
            if (params.query && params.query.limit || params.query.limit && params.query.start && params.query.count && params.query.continue){
                var sort = -1;
                var start;
                if (params.query.start){
                    start = parseInt(params.query.start);
                }else{
                    start = 0;
                }
                var limit = parseInt(params.query.limit);
                var getdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "rooms",
                    docType: 1,
                    query: [ 
                        {$match: {
                        
                        members:decodeToken.id 
                        
                    }
                    },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'student',
                                foreignField: '_id',
                                as: 'student',
                            }
                        },
                        { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                id: "$_id", _id: 0, timesheet: "$timesheet", invites: "$invites", quota: "$quota", concurrent: "$concurrent",
                                members: "$members", addons: "$addons", metrics: "$metrics", weights: "$weights", status: "$status", tags: "$tags",
                                subject: "$subject", locale: "$locale", timeout: "$timeout", rules: "$rules", threshold: "$threshold", createdAt: "$createdAt",
                                updatedAt: "$updatedAt", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion", deadline: "$deadline",
                                stoppedAt: "$stoppedAt", timezone: "$timezone", url: "$url", lifetime: "$lifetime", error: "$error", scheduledAt: "$scheduledAt",
                                duration: "$duration", incidents: "$incidents", integrator: "$integrator", ipaddress: "$ipaddress", score: "$score", signedAt: "$signedAt",pdf:"$pdf",
                                startedAt:{$cond: { if: { $eq: [ "$startedAt", null ] }, then: "$createdAt", else: "$startedAt" }}, useragent: "$useragent", proctor: "$proctor", template: "$template", browser: "$browser",
                                os: "$os", platform: "$platform",errorlog:"$errorlog", averages: "$averages", "student.id": "$student._id", "student.nickname": "$student.nickname",
                                "student.face":"$student.face","student.passport":"$student.passport","student.similar": "$student.similar", "student.username": "$student._id"
                            }
                        },
                        {
                            $facet: {
                                "data": [
                                    { "$sort": { startedAt: sort } },
                                    { "$skip": start },
                                    { "$limit": limit }
                                ],
                                "total_count": [
                                    { $group: { _id: null, count: { $sum: 1 } } }
                                ]
                            }
                        }
                    ]
                };
                let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
                if (responseData && responseData.data) {
                    let response = await schedule_Service.fetchurl(responseData.data) 
                    var data = {
                        response: responseData.data,
                        start: params,
                    };
                    let responsemessage = await schedule_Service.fetchstatus(data)
                    return { success: true, message: { data: responseData.data.statusMessage[0].data, pos: start,url: response.message, total_count: responseData.data.statusMessage[0].total_count[0].count,status:responsemessage.message} }
                } else {
                    return { success: false, message: 'Data Not Found' }
                }
            }
        }    
        else if (params.query && params.query.limit && params.query.start && params.query.count && params.query.continue && params.query.sort ) {
            let Y = params.query.sort;
            for (let A in Y) {
                const B = Y[A];
                ("1" !== B && "asc" !== B) || (Y[A] = 1), 
                ("-1" !== B && "desc" !== B) || (Y[A] = -1);
            }
            let sort = Y
            var limit = parseInt(params.query.limit);
            var start = parseInt(params.query.start);
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "rooms",
                docType: 1,
                query: [
                    { "$sort":sort },
                    { "$skip": start },
                    { "$limit": limit },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'student',
                            foreignField: '_id',
                            as: 'student',
                        }
                    },
                    { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            id: "$_id", _id: 0, timesheet: "$timesheet", invites: "$invites", quota: "$quota", concurrent: "$concurrent",
                            members: "$members", addons: "$addons", metrics: "$metrics", weights: "$weights", status: "$status", tags: "$tags",
                            subject: "$subject", locale: "$locale", timeout: "$timeout", rules: "$rules", threshold: "$threshold", createdAt: "$createdAt",
                            updatedAt: "$updatedAt", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion", deadline: "$deadline",
                            stoppedAt: "$stoppedAt", timezone: "$timezone", url: "$url", lifetime: "$lifetime", error: "$error", scheduledAt: "$scheduledAt",
                            duration: "$duration", incidents: "$incidents", integrator: "$integrator", ipaddress: "$ipaddress", score: "$score", signedAt: "$signedAt",pdf:"$pdf",
                            startedAt:{$cond: { if: { $eq: [ "$startedAt", null ] }, then: "$updatedAt", else: "$startedAt" }}, useragent: "$useragent", proctor: "$proctor", template: "$template", browser: "$browser",
                            os: "$os", platform: "$platform", averages: "$averages", "student.id": "$student._id", "student.nickname": "$student.nickname",
                            "student.face":"$student.face","student.passport":"$student.passport","student.similar": "$student.similar", "student.username": "$student._id"
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'members',
                            foreignField: '_id',
                            as: 'members',
                        }
                    }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data) {
                var getdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "rooms",
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
        } else if (params.query && params.query.limit || params.query.limit && params.query.start && params.query.count && params.query.continue){
            var sort = -1;
            var start;
            if (params.query.start){
                start = parseInt(params.query.start);
            }else{
                start = 0;
            }
            var limit = parseInt(params.query.limit);
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "rooms",
                docType: 1,
                query: [
                    { "$sort": { createdAt: sort } },
                    { "$skip": start },
                    { "$limit": limit },
                    {
                        "$addFields": {
                            "status": {
                                "$cond": {
                                    "if": { "$eq": ["$status", null] },
                                    "then": "created",
                                    "else": "$status"
                                }
                            },
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'student',
                            foreignField: '_id',
                            as: 'student',
                        }
                    },
                    { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            id: "$_id", _id: 0, timesheet: "$timesheet", invites: "$invites", quota: "$quota", concurrent: "$concurrent",
                            members: "$members", addons: "$addons", metrics: "$metrics", weights: "$weights", status: "$status", tags: "$tags",
                            subject: "$subject", locale: "$locale", timeout: "$timeout", rules: "$rules", threshold: "$threshold", createdAt: "$createdAt",
                            updatedAt: "$updatedAt", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion", deadline: "$deadline",
                            stoppedAt: "$stoppedAt", timezone: "$timezone", url: "$url", lifetime: "$lifetime", error: "$error", scheduledAt: "$scheduledAt",
                            duration: "$duration", incidents: "$incidents", integrator: "$integrator", ipaddress: "$ipaddress", score: "$score", signedAt: "$signedAt",pdf:"$pdf",
                            startedAt:{$cond: { if: { $eq: [ "$startedAt", null ] }, then: "$updatedAt", else: "$startedAt" }}, useragent: "$useragent", proctor: "$proctor", template: "$template", browser: "$browser",
                            os: "$os", platform: "$platform", averages: "$averages", "student.id": "$student._id", "student.nickname": "$student.nickname",
                            "student.face":"$student.face","student.passport":"$student.passport","student.similar": "$student.similar", "student.username": "$student._id"
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'members',
                            foreignField: '_id',
                            as: 'members',
                        }
                    }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data) {
                var getdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "rooms",
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
let proctorSearchCall = async (params) => {
    try {
        var newparams = params.headers.authorization
        var decodeToken = jwt_decode(newparams);
        if (decodeToken.role == "proctor"){
            if (params.query.limit && params.query.filter || params.query.limit && params.query.filter && params.query.start && params.query.count && params.query.continue) {
                let filterData = await search.searchData(params.query.filter);
                var start ;
                if (params.query.start) {
                    start = parseInt(params.query.start);
                } else {
                    start = 0;
                }
                var limit = parseInt(params.query.count) || parseInt(params.query.limit);
                let sort;
                if (!params.query.sort){
                    sort = {"startedAt":-1}
                }
                if ("string" == typeof filterData){
                    var getdata = {
                        url:process.env.MONGO_URI,
                        database:"proctor",
                        model: "rooms",
                        docType: 1,
                        query: [
                            {$match: {
                                $and: [
                                     { members:decodeToken.id } ,
                                     { student: { $regex: filterData, $options: 'i' } }
                                ]
                            }},
                            {
                                $lookup: {  
                                    from: 'users',
                                    localField: 'student',
                                    foreignField: '_id',
                                    as: 'student',
                                }
                            },
                            { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
                            {
                                $project: {
                                    id: "$_id", _id: 0, timesheet: "$timesheet", invites: "$invites", quota: "$quota", concurrent: "$concurrent",
                                    members: "$members", addons: "$addons", metrics: "$metrics", weights: "$weights", status: "$status", tags: "$tags",
                                    subject: "$subject", locale: "$locale", timeout: "$timeout", rules: "$rules", threshold: "$threshold", createdAt: "$createdAt",
                                    updatedAt: "$updatedAt", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion", deadline: "$deadline",
                                    stoppedAt: "$stoppedAt", timezone: "$timezone", url: "$url", lifetime: "$lifetime", error: "$error", scheduledAt: "$scheduledAt",
                                    duration: "$duration", incidents: "$incidents", integrator: "$integrator", ipaddress: "$ipaddress", score: "$score", signedAt: "$signedAt",
                                    startedAt:{$cond: { if: { $eq: [ "$startedAt", null ] }, then: "$updatedAt", else: "$startedAt" }}, useragent: "$useragent", proctor: "$proctor", template: "$template", browser: "$browser",
                                    os: "$os", platform: "$platform", averages: "$averages", "student.id": "$student._id", "student.nickname": "$student.nickname",
                                    "student.face":"$student.face","student.passport":"$student.passport","student.similar": "$student.similar", "student.username": "$student._id",//"student.verified":"$student.verified"
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'members',
                                    foreignField: '_id',
                                    as: 'members',
                                }
                            },
                            {
                                $facet:
                                {
                                    "data": [
                                        { "$sort": sort },
                                        { "$skip": start },
                                        { "$limit": limit }
                                    ],
                                    "total_count": [
                                        { $group: { _id: null, count: { $sum: 1 } } }
                                    ]
                                }
                            }
                        ]
                    };
                    let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
                    if (responseData && responseData.data && responseData.data.statusMessage && responseData.data.statusMessage[0].total_count.length) {
                        return { success: true, message: { data: responseData.data.statusMessage[0].data, pos: start, total_count: responseData.data.statusMessage[0].total_count[0].count } };
                    } else {
                        return { success: true, message: { data: responseData.data.statusMessage[0].data, pos: start, total_count: responseData.data.statusMessage[0].total_count.length } };
                    }
                } else if ("object"== typeof filterData){
                    filterData.members={$in:[decodeToken.id]},
                    filterData.student= {$ne: null}   
                    let jsonData = {
                        filter : filterData,
                        skip :start,
                        limit:limit,
                        sort:sort,
                        populate: limit && [
                            { path: "student", select: "nickname face passport verified similar" },
                            { path: "proctor", select: "nickname" },
                            { path: "members", select: "nickname" },
                        ],
                    }
                    var getdata = {
                        url:process.env.MONGO_URI,
                        database:"proctor",
                        model: "rooms",
                        docType: 0,
                        query:jsonData
                    }
                    let responseData = await invoke.makeHttpCall("post", "exec", getdata);
                    if (responseData && responseData.data && responseData.data.statusMessage && responseData.data.statusMessage.total) {
                        for (const iterator of responseData.data.statusMessage.data) {
                            if (iterator.student == null){
                                iterator.student = iterator.student;
                            } else if(!iterator.student.id){
                                    iterator.student.id =iterator.student._id;
                                    delete iterator.student._id;
                            } 
                        }
                        return { success: true, message: { data: responseData.data.statusMessage.data, pos: start, total_count: responseData.data.statusMessage.total } };
                    } else {
                        return { success: true, message: { data: responseData.data.statusMessage.data, pos: start, total_count: responseData.data.statusMessage.total} };
                    }
                }
            }        
        }else if (decodeToken.role == "administrator"){
            if (params.query.limit && params.query.filter && params.query.start && params.query.count && params.query.continue && params.query.sort ) {
                let filterData = await search.searchData(params.query.filter);
                let Y = params.query.sort;
                for (let A in Y) {
                    const B = Y[A];
                    ("1" !== B && "asc" !== B) || (Y[A] = 1), 
                    ("-1" !== B && "desc" !== B) || (Y[A] = -1);
                }
                let sort = Y;
                var limit = parseInt(params.query.limit);
                var start = parseInt(params.query.start);
                if ("string" == typeof filterData){
                    var getdata = {
                        url:process.env.MONGO_URI,
                        database:"proctor",
                        model: "rooms",
                        docType: 1,
                        query: [
                            {
                                $match: {
                                    $or: [
                                        { _id: { $regex: filterData, $options: 'i' } },
                                        { subject: { $regex: filterData, $options: 'i' } },
                                        { student: { $regex: filterData, $options: 'i' } },
                                        { status: { $regex: filterData, $options: 'i' } },
                                        { startedAt: { $regex: filterData, $options: 'i' } },
                                        { duration: { $regex: filterData, $options: 'i' } },
                                        { score: { $regex: filterData, $options: 'i' } },
                                        { tags: { $regex: filterData, $options: 'i' } },
                                        { proctor: { $regex: filterData, $options: 'i' } },
                                        { members: { $regex: filterData, $options: 'i' } }
                                    ]
                                }
                            },
                            { "$sort": sort },
                            { "$skip": start },
                            { "$limit": limit },
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'student',
                                    foreignField: '_id',
                                    as: 'student',
                                }
                            },
                            { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
                            {
                                $project: {
                                    id: "$_id", _id: 0, timesheet: "$timesheet", invites: "$invites", quota: "$quota", concurrent: "$concurrent",
                                    members: "$members", addons: "$addons", metrics: "$metrics", weights: "$weights", status: "$status", tags: "$tags",
                                    subject: "$subject", locale: "$locale", timeout: "$timeout", rules: "$rules", threshold: "$threshold", createdAt: "$createdAt",
                                    updatedAt: "$updatedAt", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion", deadline: "$deadline",
                                    stoppedAt: "$stoppedAt", timezone: "$timezone", url: "$url", lifetime: "$lifetime", error: "$error", scheduledAt: "$scheduledAt",
                                    duration: "$duration", incidents: "$incidents", integrator: "$integrator", ipaddress: "$ipaddress", score: "$score", signedAt: "$signedAt",pdf:"$pdf",
                                    startedAt:{$cond: { if: { $eq: [ "$startedAt", null ] }, then: "$updatedAt", else: "$startedAt" }}, useragent: "$useragent", proctor: "$proctor", template: "$template", browser: "$browser",
                                    os: "$os", platform: "$platform", averages: "$averages", "student.id": "$student._id", "student.nickname": "$student.nickname",
                                    "student.face":"$student.face","student.passport":"$student.passport","student.similar": "$student.similar", "student.username": "$student._id"
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'members',
                                    foreignField: '_id',
                                    as: 'members',
                                }
                            }
                        ]
                    };
                    let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
                    if (responseData && responseData.data) {
                        var getdata = {
                            url:process.env.MONGO_URI,
                            database:"proctor",
                            model: "rooms",
                            docType: 1,
                            query:[
                                {
                                    $match: {
                                        $or: [
                                            { _id: { $regex: filterData, $options: 'i' } },
                                            { subject: { $regex: filterData, $options: 'i' } },
                                            { student: { $regex: filterData, $options: 'i' } },
                                            { status: { $regex: filterData, $options: 'i' } },
                                            { startedAt: { $regex: filterData, $options: 'i' } },
                                            { duration: { $regex: filterData, $options: 'i' } },
                                            { score: { $regex: filterData, $options: 'i' } },
                                            { tags: { $regex: filterData, $options: 'i' } },
                                            { proctor: { $regex: filterData, $options: 'i' } },
                                            { members: { $regex: filterData, $options: 'i' } }
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
                } else if ("object"== typeof filterData){
                    let jsonData = {
                        filter : filterData,
                        skip :start,
                        limit:limit,
                        sort:sort,
                        populate: limit && [
                            { path: "student", select: "nickname face passport verified similar" },
                            { path: "proctor", select: "nickname" },
                            { path: "members", select: "nickname" },
                        ],
                    }
                    var getdata = {
                        url:process.env.MONGO_URI,
                        database:"proctor",
                        model: "rooms",
                        docType: 0,
                        query:jsonData
                    }
                    let responseData = await invoke.makeHttpCall("post", "exec", getdata);
                    if (responseData && responseData.data && responseData.data.statusMessage && responseData.data.statusMessage.total) {
                        for (const iterator of responseData.data.statusMessage.data) {
                            if (iterator.student == null){
                                iterator.student = iterator.student;
                            } else if(!iterator.student.id){
                                    iterator.student.id =iterator.student._id;
                                    delete iterator.student._id;
                            } 
                        }
                        return { success: true, message: { data: responseData.data.statusMessage.data, pos: start, total_count: responseData.data.statusMessage.total } };
                    } else {
                        return { success: true, message: { data: responseData.data.statusMessage.data, pos: start, total_count: responseData.data.statusMessage.total} };
                    }
                }
            } else if (params.query.limit && params.query.filter || params.query.limit && params.query.filter && params.query.start && params.query.count && params.query.continue) {
                let filterData = await search.searchData(params.query.filter);
                var start ;
                if (params.query.start) {
                    start = parseInt(params.query.start);
                } else {
                    start = 0;
                }
                var limit = parseInt(params.query.count) || parseInt(params.query.limit);
                let sort;
                if (!params.query.sort){
                    sort = {"createdAt":-1}
                }
                if ("string" == typeof filterData){
                    var getdata = {
                        url:process.env.MONGO_URI,
                        database:"proctor",
                        model: "rooms",
                        docType: 1,
                        query: [
                            {
                                $match: {
                                    $or: [
                                        { _id: { $regex: filterData, $options: 'i' } },
                                        { subject: { $regex: filterData, $options: 'i' } },
                                        { student: { $regex: filterData, $options: 'i' } },
                                        { status: { $regex: filterData, $options: 'i' } },
                                        { startedAt: { $regex: filterData, $options: 'i' } },
                                        { duration: { $regex: filterData, $options: 'i' } },
                                        { score: { $regex: filterData, $options: 'i' } },
                                        { tags: { $regex: filterData, $options: 'i' } },
                                        { proctor: { $regex: filterData, $options: 'i' } },
                                        { members: { $regex: filterData, $options: 'i' } }
                                    ]
                                }
                            },
                            { "$sort": sort },
                            { "$skip": start },
                            { "$limit": limit },
                            {
                                $lookup: {  
                                    from: 'users',
                                    localField: 'student',
                                    foreignField: '_id',
                                    as: 'student',
                                }
                            },
                            { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
                            {
                                $project: {
                                    id: "$_id", _id: 0, timesheet: "$timesheet", invites: "$invites", quota: "$quota", concurrent: "$concurrent",
                                    members: "$members", addons: "$addons", metrics: "$metrics", weights: "$weights", status: "$status", tags: "$tags",
                                    subject: "$subject", locale: "$locale", timeout: "$timeout", rules: "$rules", threshold: "$threshold", createdAt: "$createdAt",
                                    updatedAt: "$updatedAt", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion", deadline: "$deadline",
                                    stoppedAt: "$stoppedAt", timezone: "$timezone", url: "$url", lifetime: "$lifetime", error: "$error", scheduledAt: "$scheduledAt",
                                    duration: "$duration", incidents: "$incidents", integrator: "$integrator", ipaddress: "$ipaddress", score: "$score", signedAt: "$signedAt",
                                    startedAt:"$startedAt", useragent: "$useragent", proctor: "$proctor", template: "$template", browser: "$browser",pdf:"$pdf",
                                    os: "$os", platform: "$platform", averages: "$averages", "student.id": "$student._id", "student.nickname": "$student.nickname",
                                    "student.face":"$student.face","student.passport":"$student.passport","student.similar": "$student.similar", "student.username": "$student._id",//"student.verified":"$student.verified"
                                }
                            }
                        ]
                    };
                    let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
                    if (responseData && responseData.data) {
                        var getdata = {
                            url:process.env.MONGO_URI,
                            database:"proctor",
                            model: "rooms",
                            docType: 1,
                            query:[
                                {
                                    $match: {
                                        $or: [
                                            { _id: { $regex: filterData, $options: 'i' } },
                                            { subject: { $regex: filterData, $options: 'i' } },
                                            { student: { $regex: filterData, $options: 'i' } },
                                            { status: { $regex: filterData, $options: 'i' } },
                                            { startedAt: { $regex: filterData, $options: 'i' } },
                                            { duration: { $regex: filterData, $options: 'i' } },
                                            { score: { $regex: filterData, $options: 'i' } },
                                            { tags: { $regex: filterData, $options: 'i' } },
                                            { proctor: { $regex: filterData, $options: 'i' } },
                                            { members: { $regex: filterData, $options: 'i' } }
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
                } else if ("object"== typeof filterData){
                    let jsonData = {
                        filter : filterData,
                        skip :start,
                        limit:limit,
                        sort:sort,
                        populate: limit && [
                            { path: "student", select: "nickname face passport verified similar" },
                            { path: "proctor", select: "nickname" },
                            { path: "members", select: "nickname" },
                        ],
                    }
                    var getdata = {
                        url:process.env.MONGO_URI,
                        database:"proctor",
                        model: "rooms",
                        docType: 0,
                        query:jsonData
                    }
                    let responseData = await invoke.makeHttpCall("post", "exec", getdata);
                    if (responseData && responseData.data && responseData.data.statusMessage && responseData.data.statusMessage.total) {
                        for (const iterator of responseData.data.statusMessage.data) {
                            if (iterator.student == null){
                                iterator.student = iterator.student;
                            } else if(!iterator.student.id){
                                    iterator.student.id =iterator.student._id;
                                    delete iterator.student._id;
                            } 
                        }
                        return { success: true, message: { data: responseData.data.statusMessage.data, pos: start, total_count: responseData.data.statusMessage.total } };
                    } else {
                        return { success: true, message: { data: responseData.data.statusMessage.data, pos: start, total_count: responseData.data.statusMessage.total} };
                    }
                }
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
let proctorSuggestCall = async (params) => {
    try {
        if (params.query && params.query.filter && params.query.filter.role && params.query.filter.role == "proctor" ){
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "users",
                docType: 1,
                query: [
                        {
                            "$match": {
                                    $and: [
                                        { role: { $regex: params.query.filter.role, $options: 'i' } },
                                        { _id: { $regex: params.query.filter.value, $options: 'i' } }
                                        ]
                                    }
                        },
                        {
                            $project : {id:"$_id",_id:0,nickname:"$nickname",role:"$role",username:"$username"}
                        },
                        {
                            $limit : 100
                        }
                    ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if(responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage};
            } else {
                return { success: false, message: "data not found"};
            }
        } else if (params.query && params.query.filter && params.query.filter.role && params.query.filter.role == "student" ){
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "users",
                docType: 1,
                query: [
                    {
                        $match: {
                            $and: [
                                { role: { $regex: "student", $options: 'i' } },
                                { nickname: { $regex: params.query.filter.value, $options: 'i' } }
                            ]
                        }
                    },
                    {
                        $limit: 100
                    },
                    {
                        $project: { "_id":0, id: "$_id", "nickname": 1, "role": 1, username: "$_id" }
                    },

                    {
                        $sort: { "nickname": 1 }
                    },
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data) {
                return { success: true, message: responseData.data.statusMessage }
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
let proctorUserDetailsCall = async (params) => {
    var getusername = params.username;
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 1,
            query: [
                {
                    $match: {
                        _id: getusername
                    }
                },
                {
                    $project: { _id: 1, rep: 0 }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            let userData = await schedule.roomUserDetails(responseData.data.statusMessage[0])
            responseData.data.statusMessage[0].similar = userData.data.statusMessage
            if (userData && userData.data) {
                responseData.data.statusMessage[0].id = responseData.data.statusMessage[0]._id;
                responseData.data.statusMessage[0].username = responseData.data.statusMessage[0]._id
                delete responseData.data.statusMessage[0]._id;
                responseData.data.statusMessage[0].password = responseData.data.statusMessage[0].hashedPassword
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
let proctorUserInfoCall = async (params) => {
    try {
        var postdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "users",
            docType: 1,
            query: [
                {
                    $match: {
                        _id: params.id
                    }
                },
                {
                    $project: { _id: 1, provider: 1, role: 1 }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", postdata);
        if (responseData && responseData.data && responseData.data.statusMessage && responseData.data.statusMessage.length) {
            let token = await tokenService.ProctorTokenGeneration(responseData.data);
            if (token) {
                var decodeToken = jwt_decode(token);
                if (decodeToken) {
                    return { success: true, message: { exp: decodeToken.exp, id: decodeToken.id, provider: decodeToken.provider, role: decodeToken.role, token: token } }
                } else {
                    return { success: false, message: 'Error While Decoding Token' }
                }
            } else {
                return { success: false, message: 'Token Not Generated' }
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
let proctorRoomDetails = async (params) => {
    try {
        var userid = params.params.userId;
        var postdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 1,
            query: [
                {
                    $match: { _id: userid }
                },
                {
                    $project: {
                        id: "$_id", _id: 0, timesheet: "$timesheet", invites: "$invites", quota: "$quota", concurrent: "$concurrent",
                        members: "members", addons: "$addons", metrics: "$metrics", weights: "$weights", status: "$status", tags: "$tags",
                        subject: "$subject", locale: "$locale", timeout: "$timeout", rules: "$rules", threshold: "$threshold", createdAt: "$createdAt",
                        updatedAt: "$updatedAt", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion", deadline: "$deadline",
                        stoppedAt: "$stoppedAt", timezone: "$timezone", url: "$url", lifetime: "$lifetime", error: "$error", scheduledAt: "$scheduledAt",
                        duration: "$duration", incidents: "$incidents", integrator: "$integrator", ipaddress: "$ipaddress", score: "$score", signedAt: "$signedAt",
                        startedAt: "$startedAt", useragent: "$useragent", proctor: "$proctor", student: "$student", template: "$template", browser: "$browser",
                        os: "$os", platform: "$platform", averages: "$averages",pdf:"$pdf",errorlog:"$errorlog"
                    }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", postdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: responseData.data.statusMessage[0] };
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
let proctorSuggestSaveCall = async (params) => {
    try{
        params.status = "created"; 
        if(!params.id){
            params._id  = uuidv4()
        }else{
            params._id = params.id
        }
        if(!params.createdAt){
            params.createdAt = new Date()
        }
        params.updatedAt = new Date()
        params.scheduledAt = params.createdAt
        params.timesheet = {
            xaxis: [],
            yaxis: []
        }
        delete params.id; 
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 0,
            query: params
        };
        let responseData = await invoke.makeHttpCall("post", "insert", getdata);
        if(responseData && responseData.data&&responseData.data.statusMessage._id){
            let getData = await schedule.roomUserSave(responseData.data.statusMessage._id);
            if(getData && getData.data && getData.data.statusMessage){
                if (getData.data.statusMessage[0].status=="template"){
                    let templateResponse = await schedule.getTemplate(getData.data.statusMessage[0]);
                    if (templateResponse && templateResponse.data && templateResponse.data.statusMessage.length >0){
                        let jsonData = {
                            members : params.members,
                            array : templateResponse.data.statusMessage[0].array
                        }
                        let updateTemplate = await schedule.updateTemplate(jsonData);
                        if(updateTemplate && updateTemplate.data && updateTemplate.data.statusMessage.nModified >0){
                            logger.info({ success: true, message: updateTemplate.data.statusMessage });
                        } else {
                            logger.info({ success: false, message: "records updated not successfully..." });
                        }
                    } else {
                        return { success: false, message: templateResponse };
                    }
                }
                getData.data.statusMessage[0].id=getData.data.statusMessage[0]._id;
                getData.data.statusMessage[0].subject=getData.data.statusMessage[0].id;
                delete getData.data.statusMessage[0]._id;
                return { success: true, message: getData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
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
let proctorusagestatistics = async (params) => {
    try {
        let E=params.size
        let A=params.fd
        let B=params.td
        //(E = parseInt(E) || 100) > 100 && (E = 100);
        const Q = Date.now();
        A = new Date(A || Q - 60 * E * 1e3).getTime();
        const s = (B = ~~((B = new Date(B || Q).getTime()) / 6e4)) - (A = ~~(A / 6e4))
              //{ value: l, index: g } = this.getTimeFrames(s / E);
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "stats",
            docType: 1,
            query: [
                {$match:{ timestamp: { $mod: [1, 0], $gt: A, $lte: B } }},
                                {$project:
                                    {
                                        rooms: { $arrayElemAt: [ "$rooms", 0 ] },
                                        cpu: { $arrayElemAt: [ "$cpu", 0 ] },
                                        ram: { $arrayElemAt: [ "$ram", 0 ] },
                                        users: { $arrayElemAt: [ "$users", 0 ] },
                                        timestamp:"$timestamp",
                                        _id:0
                                    },

                                }
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
let getface = async (params) => {
    try {
        // console.log('params..................',params)
        var decodeToken = jwt_decode(params.authorization);
        let faceResponse = await schedule_Service.getFacePassportResponse(params.face);
        if (faceResponse && faceResponse.success){
            // console.log(faceResponse.message[0],'faceResponse.message[0]')
            let getCount = await schedule_Service.getUserRoomsCount(decodeToken);
            if ( getCount.message.length>1 ){
                let getFaceResponse = await schedule_Service.GetFaceInsertionResponse(params.face);
                if(getFaceResponse && getFaceResponse.success){
                    let response = await schedule_Service.getface(decodeToken)
                    if (response.success){
                        return { success: true, message: response.message[0] }
                    } else {
                        return { success: false, message: response.message }
                    }
                } else {
                    return { success: false, message: getFaceResponse.message }
                }
            } else {
                let jsonData =  {
                    "face" : params.face,
                    "rep" : faceResponse.message[0].metadata.rep,
                    "threshold" : faceResponse.message[0].metadata.threshold,
                    "similar" : faceResponse.message[0].metadata.similar
                };
                var getdata = {
                    url:process.env.MONGO_URI,
                    database:"proctor",
                    model: "users",
                    docType: 0,
                    query: {
                        filter: { "_id": decodeToken.id },
                        update: { $set: jsonData }
                    }
                };
                let responseData = await invoke.makeHttpCall_userDataService("post", "update", getdata);
                // console.log('before response ',responseData.data)
                if (responseData && responseData.data.statusMessage && responseData.data.statusMessage.nModified>0) {
                    // console.log('after response',responseData.data)
                    // console.log('before calling getface',decodeToken)
                    let response = await schedule_Service.getface(decodeToken)
                    // console.log('response before........................',response)
                    if (response.success){
                        // console.log('response after........................',response)
                        return { success: true, message: response.message[0] }
                    }
                } else {
                    return { success: false, message: 'Data Not Found' }
                }
            }
        } else {
            return { success: false, message: faceResponse.message }
        }
    } catch (error) {
        console.log(error,"putme1====>>>>test")
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getPassport = async (params) => {
    try {
        var decodeToken = jwt_decode(params.authorization);
        console.log(decodeToken.id,'decodeToken.id 1')
        console.log(params.passport,'params.passport 2')
        let getCount = await schedule_Service.getUserRoomsCount(decodeToken);
        if ( getCount.message.length>1 ){
            let getPassportResponse = await schedule_Service.GetPassportInsertionResponse(params.passport);
            if(getPassportResponse && getPassportResponse.success){
                let response = await schedule_Service.getPassport(decodeToken)
                if (response.success){
                    return { success: true, message: response.message[0] }
                } else {
                    return { success: false, message: response.message }
                }
            } else {
                return { success: false, message: getPassportResponse.message }
            }
        } else {
            let jsonData =  {
                "passport" : params.passport,
            };
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "users",
                docType: 0,
                query: {
                    filter: { "_id": decodeToken.id },
                    update: { $set: jsonData }
                }
            };
            let responseData = await invoke.makeHttpCall_userDataService("post", "update", getdata);
            if (responseData && responseData.data.statusMessage && responseData.data.statusMessage.nModified>0) {
                let response = await schedule_Service.getPassport(decodeToken)
                if (response.success){
                    return { success: true, message: response.message[0] }
                }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        }
    } catch (error) {
        console.log(error,"putme2====>>>>>>")
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getCheck = async (params) => {
    try {
        let response = await tokenService.checkToken();
        if (response){
            return { success: true, message: response }
        } 
        else {
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
let notificationupdate = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database: "proctor",
            model: "rooms",
            docType: 1,
            query: [
                {
                    $match: {"student": params.userId,"status": { $in: ["paused", "started"] } } 
                },
                {
                    $project: { "_id": 0 ,"id" :"$_id" }
                },    
                { $group: { _id: null, data: { $push: "$id" }}}
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        let result = await schedule_Service.unreadmessagefetch(responseData.data.statusMessage[0].data)
        if (result && result.success && result.message && result.message.length>0) {
            var data = _.map(result.message, (iterator) => iterator._id);
            var message = _.map(result.message, (iterator) => _.pick(iterator, ['message', 'user', 'notification', 'createdAt']))
            let response = await schedule_Service.unreadchat(data)
            return { success: true, message: message}
        } else {
            return { success: false, message: '[]' }
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
    proctorLoginCall,
    proctorMeCall,
    proctorFetchCall,
    proctorAuthCall,
    proctorLimitCall,
    proctorSearchCall,
    proctorSuggestCall,
    proctorUserDetailsCall,
    proctorUserInfoCall,
    proctorRoomDetails,
    proctorSuggestSaveCall,
    proctorusagestatistics,
    getface,
    getPassport,
    getCheck,
    notificationupdate,
}