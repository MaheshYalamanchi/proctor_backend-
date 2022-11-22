const invoke = require("../../lib/http/invoke");
const schedule = require("../auth/sehedule");
const globalMsg = require('../../configuration/messages/message');
const { query } = require("express");
const crypto =require("crypto")
let proctorRoomUserEdit = async (params) => {
    try {
        var updatedAt = new Date();
        params.updatedAt = updatedAt;
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 0,
            query: {
                filter: { "_id": params.id },
                update: { $set: params }
            }
        };
        let response = await invoke.makeHttpCall("post", "update", getdata);
        if (response && response.data && response.data.statusMessage && response.data.statusMessage.nModified == 1) {
            let responseData = await schedule.roomUserEdit(params);
            if (responseData && responseData.data && responseData.data.statusMessage) {
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
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query: {
                _id: params.UserId
            }
        };
        let responseData = await invoke.makeHttpCall("post", "readData", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            let response = await schedule.roomUserDelete(responseData.data.statusMessage[0]);
        }
        if (responseData && responseData.data) {
            responseData.data.statusMessage[0].id = responseData.data.statusMessage[0]._id;
            delete responseData.data.statusMessage[0]._id;
            return { success: true, message: responseData.data.statusMessage[0] }
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
let UserLimitCall = async (params) => {
    try {
        var sort;
        if (params.query.limit && params.query.start && params.query.count && params.query.continue && params.query.sort.nickname) {
            if (params.query.sort.nickname == 'desc') {
                sort = -1;
            } else if (params.query.sort.nickname == 'asc') {
                sort = 1;
            }
            var limit = parseInt(params.query.limit);
            var start = parseInt(params.query.start);
            var getdata = {
                url: process.env.MONGO_URI,
                client: "users",
                docType: 1,
                query: [
                    {
                        $project: {
                            id: "$_id", _id: 0, browser: "$browser", createdAt: "$createdAt", exclude: "$exclude", group: "$group",
                            ipaddress: "$ipaddress", labels: "$labels", lang: "$lang", locked: "$locked", loggedAt: "$loggedAt",
                            nickname: "$nickname", os: "$os", platform: "$platform", role: "$role", secure: "$secure", similar: "$similar",
                            useragent: "$useragent", username: "$_id"
                        }
                    },
                    {
                        $facet:
                        {
                            "data": [
                                { $sort: { nickname: sort } },
                                { "$skip": start },
                                { "$limit": limit }
                            ],
                            "total_count": [
                                { $group: { _id: null, count: { $sum: 1 } } },
                                { $project: { _id: 0 } }
                            ]
                        }
                    },
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage.length > 0) {
                return { success: true, message: { data: responseData.data.statusMessage[0].data, pos: start, total_count: responseData.data.statusMessage[0].total_count[0].count } }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query && params.query.limit) {
            var start = 0;
            var limit = parseInt(params.query.limit)
            var getdata = {
                url: process.env.MONGO_URI,
                client: "users",
                docType: 1,
                query: [
                    {
                        $project: {
                            id: "$_id", _id: 0, browser: "$browser", createdAt: "$createdAt", exclude: "$exclude", group: "$group",
                            ipaddress: "$ipaddress", labels: "$labels", lang: "$lang", locked: "$locked", loggedAt: "$loggedAt",
                            nickname: "$nickname", os: "$os", platform: "$platform", role: "$role", secure: "$secure", similar: "$similar",
                            useragent: "$useragent", username: "$_id"
                        }
                    },
                    {
                        $facet:
                        {
                            "data": [
                                { $skip: start },
                                { "$limit": limit }
                            ],
                            "total_count": [
                                { $group: { _id: null, count: { $sum: 1 } } },
                                { $project: { _id: 0 } }
                            ]
                        }
                    }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage.length > 0) {
                return { success: true, message: { data: responseData.data.statusMessage[0].data, pos: start, total_count: responseData.data.statusMessage[0].total_count[0].count } }
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
        var sort;
        if (params.query.limit && params.query.filter && params.query.start && params.query.count && params.query.continue && params.query.sort.nickname) {
            if (params.query.sort.nickname == 'desc') {
                sort = -1;
            } else if (params.query.sort.nickname == 'asc') {
                sort = 1;
            }
            var limit = parseInt(params.query.limit);
            var start = parseInt(params.query.start);
            var getdata = {
                url: process.env.MONGO_URI,
                client: "users",
                docType: 1,
                query: [
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
                            useragent: "$useragent", username: "$_id"
                        }
                    },
                    {
                        $facet:
                        {
                            "data": [
                                { "$sort": { nickname: sort } },
                                { "$skip": start },
                                { "$limit": limit }
                            ],
                            "poc": [
                                { $group: { _id: null, count: { $sum: 1 } } },
                                { $project: { _id: 0 } }
                            ]
                        }
                    },
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data) {
                return { success: true, message: { data: responseData.data.statusMessage[0].data, pos: start, total_count: responseData.data.statusMessage[0].poc[0].count } };
            } else {
                return { success: false, message: 'Data Not Found' };
            }
        } else if (params.query.limit && params.query.filter) {
            var limit = parseInt(params.query.limit);
            var start = 0;
            var getdata = {
                url: process.env.MONGO_URI,
                client: "users",
                docType: 1,
                query: [
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
                            useragent: "$useragent", username: "$_id"
                        }
                    },
                    {
                        $facet:
                        {
                            "data": [
                                { "$skip": start },
                                { "$limit": limit }
                            ],
                            "poc": [
                                { $group: { _id: null, count: { $sum: 1 } } },
                                { $project: { _id: 0 } }
                            ]
                        }
                    },
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data) {
                return { success: true, message: { data: responseData.data.statusMessage[0].data, pos: start, total_count: responseData.data.statusMessage[0].poc[0].count } };
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
let UserEdit = async (params) => {
    try {
        delete params.id;
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
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
    var password = params.password
    const hasspassword =crypto.createHmac("sha1", salt).update(password).digest("hex");
    var locked = Boolean(params.locked);
    var secure = Boolean(params.secure);
    try{
        var createdAt = new Date()
        var jsonData = { 
            "_id" : params.username,
            "role" :params.role,
            "labels" :params.labels,
            "exclude" : [],
            "rep" : [],
            "salt" : salt,
            "hashedPassword" : hasspassword,
            "nickname" : params.username,
            "group" : params.group,
            "lang" : params.lang,
            "locked" : locked,
            "secure" : secure,
            "createdAt" : createdAt,
            "similar" : []
        }
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 0,
            query: jsonData
        };

        let responseData = await invoke.makeHttpCall("post", "writeData", getdata);
        if (responseData && responseData.data && responseData.data.iid) {
            let getData = await schedule.UserSave(responseData.data.iid);
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
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: {
                _id: params.UserId
            }
        };
        let responseData = await invoke.makeHttpCall("post", "readData", getdata);
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
            url: process.env.MONGO_URI,
            client: "rooms",
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

module.exports = {
    proctorRoomUserEdit,
    proctorDeleteSaveCall,
    UserLimitCall,
    UserSearchCall,
    UserEdit,
    proctorUserSaveCall,
    proctorUserDeleteCall,
    getCandidateMessageCount
}