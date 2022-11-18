const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const crypto = require('crypto');
const tokenService = require('../../routes/proctorToken/tokenService');
const jwt_decode = require('jwt-decode');
const schedule = require("../auth/sehedule");
const { v4: uuidv4 } = require('uuid');
let proctorLoginCall = async (params) => {
    try {
        var postdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: {
                username: params.username
            }
        };
        let responseData = await invoke.makeHttpCall("post", "read", postdata);
        if (responseData && responseData.data) {
            let salt = responseData.data.statusMessage[0].salt;
            let hashedPassword = responseData.data.statusMessage[0].hashedPassword;
            let encryptPassword = crypto.createHmac("sha1", salt).update(params.password).digest("hex");
            let validPassword = !(!params.password || !salt) && encryptPassword === hashedPassword;
            let response = await tokenService.generateProctorToken(responseData);
            if (validPassword) {
                return {
                    success: true, message: {
                        id: responseData.data.statusMessage[0].username,
                        role: responseData.data.statusMessage[0].role, token: response
                    }
                }
            } else {
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
    var decodeToken = jwt_decode(params.authorization);
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: {
                username: decodeToken.id
            }
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
        if (responseData && responseData.data) {
            return {
                success: true, message: {
                    browser: responseData.data.statusMessage[0].browser,
                    os: responseData.data.statusMessage[0].os, platform: responseData.data.statusMessage[0].platform,
                    role: responseData.data.statusMessage[0].role, labels: responseData.data.statusMessage[0].labels,
                    exclude: responseData.data.statusMessage[0].exclude, username: responseData.data.statusMessage[0].username,
                    createdAt: responseData.data.statusMessage[0].createdAt, similar: responseData.data.statusMessage[0].similar,
                    nickname: responseData.data.statusMessage[0].nickname, ipaddress: responseData.data.statusMessage[0].ipaddress,
                    loggedAt: responseData.data.statusMessage[0].loggedAt, group: responseData.data.statusMessage[0].group,
                    lang: responseData.data.statusMessage[0].lang, locked: responseData.data.statusMessage[0].locked,
                    secure: responseData.data.statusMessage[0].secure, useragent: responseData.data.statusMessage[0].useragent
                }
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
let proctorFetchCall = async (params) => {
    var decodeToken = jwt_decode(params.authorization);
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query: [
                {
                    "$match": { "student": "admin" }
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
                    "$unwind": "$student"
                },
                {
                    "$project": {
                        "student.salt": 0,
                        "student.hashedPassword": 0,
                        "student.rep": 0
                    }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            responseData.data.statusMessage[0].id = responseData.data.statusMessage[0]._id;
            responseData.data.statusMessage[0].student.id = responseData.data.statusMessage[0].student._id;
            delete responseData.data.statusMessage[0].student._id;
            delete responseData.data.statusMessage[0]._id
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
let proctorAuthCall = async (params) => {
    var decodeToken = jwt_decode(params.authorization);
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: {
                username: decodeToken.id
            }
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
        if (responseData && responseData.data) {
            var splitToken = params.authorization.split(" ")
            return {
                success: true, message: {
                    exp: decodeToken.exp, iat: decodeToken.iat, id: responseData.data.statusMessage[0].username,
                    role: responseData.data.statusMessage[0].role,
                    token: splitToken[1]
                }
            }
        } else {
            return { success: false, message: 'Data Not Found' }
        }
    } catch {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let proctorLimitCall = async (params) => {
    try {
        var sort;
        if (params.query && params.query.sort && params.query.sort.subject) {
            if (params.query.sort.subject == 'desc') {
                sort = -1;
            } else if (params.query.sort.subject == 'asc') {
                sort = 1;
            }
            var limit = parseInt(params.query.limit);
            var start = parseInt(params.query.start);
            var getdata = {
                url: process.env.MONGO_URI,
                client: "rooms",
                docType: 1,
                query: [
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
                            members: "members", addons: "$addons", metrics: "$metrics", weights: "$weights", status: "$status", tags: "$tags",
                            subject: "$subject", locale: "$locale", timeout: "$timeout", rules: "$rules", threshold: "$threshold", createdAt: "$createdAt",
                            updatedAt: "$updatedAt", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion", deadline: "$deadline",
                            stoppedAt: "$stoppedAt", timezone: "$timezone", url: "$url", lifetime: "$lifetime", error: "$error", scheduledAt: "$scheduledAt",
                            duration: "$duration", incidents: "$incidents", integrator: "$integrator", ipaddress: "$ipaddress", score: "$score", signedAt: "$signedAt",
                            startedAt: "$startedAt", useragent: "$useragent", proctor: "$proctor", template: "$template", browser: "$browser",
                            os: "$os", platform: "$platform", averages: "$averages", "student.id": "$student._id", "student.nickname": "$student.nickname",
                            "student.similar": "$student.similar", "student.username": "$student._id"
                        }
                    },
                    {
                        $facet: {
                            "data": [
                                { "$sort": { subject: sort } },
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
                return { success: true, message: { data: responseData.data.statusMessage[0].data, pos: start, total_count: responseData.data.statusMessage[0].total_count[0].count } }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query && params.query.limit)
            var sort = -1;
        var start = 0;
        var limit = parseInt(params.query.limit);
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query: [
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
                        members: "members", addons: "$addons", metrics: "$metrics", weights: "$weights", status: "$status", tags: "$tags",
                        subject: "$subject", locale: "$locale", timeout: "$timeout", rules: "$rules", threshold: "$threshold", createdAt: "$createdAt",
                        updatedAt: "$updatedAt", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion", deadline: "$deadline",
                        stoppedAt: "$stoppedAt", timezone: "$timezone", url: "$url", lifetime: "$lifetime", error: "$error", scheduledAt: "$scheduledAt",
                        duration: "$duration", incidents: "$incidents", integrator: "$integrator", ipaddress: "$ipaddress", score: "$score", signedAt: "$signedAt",
                        startedAt: "$startedAt", useragent: "$useragent", proctor: "$proctor", template: "$template", browser: "$browser",
                        os: "$os", platform: "$platform", averages: "$averages", "student.id": "$student._id", "student.nickname": "$student.nickname",
                        "student.similar": "$student.similar", "student.username": "$student._id"
                    }
                },
                {
                    $facet: {
                        "data": [
                            { "$sort": { createdAt: sort } },
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
            return { success: true, message: { data: responseData.data.statusMessage[0].data, pos: start, total_count: responseData.data.statusMessage[0].total_count[0].count } }
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
let proctorSearchCall = async (params) => {
    try {
        var sort;
        if (params.query.sort && params.query.sort.subject) {
            if (params.query.sort.subject == 'desc') {
                sort = 1;
            } else if (params.query.sort.subject == 'asc') {
                sort = -1;
            }
            var limit = parseInt(params.query.limit);
            var start = parseInt(params.query.start);
            var getdata = {
                url: process.env.MONGO_URI,
                client: "rooms",
                docType: 1,
                query: [
                    {
                        $match: {
                            $or: [
                                { subject: { $regex: params.query.filter, $options: 'i' } },
                                { student: { $regex: params.query.filter, $options: 'i' } },
                                { startedAt: { $regex: params.query.filter, $options: 'i' } },
                                { status: { $regex: params.query.filter, $options: 'i' } }
                            ]
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
                            members: "members", addons: "$addons", metrics: "$metrics", weights: "$weights", status: "$status", tags: "$tags",
                            subject: "$subject", locale: "$locale", timeout: "$timeout", rules: "$rules", threshold: "$threshold", createdAt: "$createdAt",
                            updatedAt: "$updatedAt", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion", deadline: "$deadline",
                            stoppedAt: "$stoppedAt", timezone: "$timezone", url: "$url", lifetime: "$lifetime", error: "$error", scheduledAt: "$scheduledAt",
                            duration: "$duration", incidents: "$incidents", integrator: "$integrator", ipaddress: "$ipaddress", score: "$score", signedAt: "$signedAt",
                            startedAt: "$startedAt", useragent: "$useragent", proctor: "$proctor", template: "$template", browser: "$browser",
                            os: "$os", platform: "$platform", averages: "$averages", "student.id": "$student._id", "student.nickname": "$student.nickname",
                            "student.similar": "$student.similar", "student.username": "$student._id"
                        }
                    },
                    {
                        $facet:
                        {
                            "data": [
                                { "$sort": { createdAt: sort } },
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
                return { success: true, message: { data: responseData.data.statusMessage[0].data, pos: start, total_count: responseData.data.statusMessage[0].total_count[0].count } };
            } else {
                return { success: false, message: 'Data Not Found' };
            }
        } else if (params.query.limit && params.query.filter) {
            var start = 0;
            var limit = parseInt(params.query.limit)
            var sort = -1;
            var getdata = {
                url: process.env.MONGO_URI,
                client: "rooms",
                docType: 1,
                query: [
                    {
                        $match: {
                            $or: [
                                { subject: { $regex: params.query.filter, $options: 'i' } },
                                { student: { $regex: params.query.filter, $options: 'i' } },
                                { startedAt: { $regex: params.query.filter, $options: 'i' } },
                                { status: { $regex: params.query.filter, $options: 'i' } }
                            ]
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
                            members: "members", addons: "$addons", metrics: "$metrics", weights: "$weights", status: "$status", tags: "$tags",
                            subject: "$subject", locale: "$locale", timeout: "$timeout", rules: "$rules", threshold: "$threshold", createdAt: "$createdAt",
                            updatedAt: "$updatedAt", api: "$api", comment: "$comment", complete: "$complete", conclusion: "$conclusion", deadline: "$deadline",
                            stoppedAt: "$stoppedAt", timezone: "$timezone", url: "$url", lifetime: "$lifetime", error: "$error", scheduledAt: "$scheduledAt",
                            duration: "$duration", incidents: "$incidents", integrator: "$integrator", ipaddress: "$ipaddress", score: "$score", signedAt: "$signedAt",
                            startedAt: "$startedAt", useragent: "$useragent", proctor: "$proctor", template: "$template", browser: "$browser",
                            os: "$os", platform: "$platform", averages: "$averages", "student.id": "$student._id", "student.nickname": "$student.nickname",
                            "student.similar": "$student.similar", "student.username": "$student._id"
                        }
                    },

                    {
                        $facet:
                        {
                            "data": [
                                { "$sort": { createdAt: sort } },
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
                return { success: true, message: { data: responseData.data.statusMessage[0].data, pos: start, total_count: responseData.data.statusMessage[0].total_count[0].count } };
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
let proctorSuggestCall = async (params) => {
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
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
                    $project: { "_id": 1, "nickname": 1, "role": 1, username: "$_id" }
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
    } catch {
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
            url: process.env.MONGO_URI,
            client: "users",
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
            url: process.env.MONGO_URI,
            client: "users",
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
            url: process.env.MONGO_URI,
            client: "rooms",
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
                        os: "$os", platform: "$platform", averages: "$averages"
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
        if(!params.id){
            params._id  = uuidv4()
        }else{
            params._id = params.id
        }     
        params.createdAt = new Date()
        params.scheduledAt = params.createdAt
        params.timesheet={
            xaxis: [],
            yaxis: []
        }
        delete params.id; 
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 0,
            query: params
        };
        let responseData = await invoke.makeHttpCall("post", "writeData", getdata);
        if(responseData && responseData.data&&responseData.data.iid){
            let getData = await schedule.roomUserSave(responseData.data.iid);
            if(getData && getData.data && getData.data.statusMessage){
                getData.data.statusMessage[0].id=getData.data.statusMessage[0]._id;
                getData.data.statusMessage[0].subject=getData.data.statusMessage[0]._id;
                delete getData.data.statusMessage[0]._id;
                return { success: true, message: getData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else {
            return { success: false, message: 'Data Not Found' }
        }
    } catch {
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
}