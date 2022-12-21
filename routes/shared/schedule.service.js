const invoke = require("../../lib/http/invoke");
const schedule = require("../auth/sehedule");
let getCandidateMessages = async (params) => {
    try {
        if (params.query.limit && params.query.skip && params.query.filter && params.query.filter.type == 'message') {
            var start;
            if(params.query.skip){
                start = parseInt(params.query.skip)
            }else {
                start = 0;
            }
            sort = -1;
            var limit = parseInt(params.query.limit);
            var getdata = {
                url: process.env.MONGO_URI,
                client: "chats",
                docType: 1,
                query: [
                    {
                        "$match": {
                            "room": params.params.roomId,
                            "type": { "$regex": params.query.filter.type, "$options": 'i' }
                        }
                    },
                    {
                        "$lookup": {
                            "from": 'users',
                            "localField": 'user',
                            "foreignField": '_id',
                            "as": 'data',
                        }
                    },
                    { "$unwind": { "path": "$data", "preserveNullAndEmptyArrays": true } },
                    
                    {
                        "$project": {
                            "attach": "$attach", "createdAt": "$createdAt", "id": "$_id", "message": "$message", "room": "$room", "type": "$type", "_id": 0,"meatadata":"$metadata",
                             "user.id":"$data._id","user.nickname":"$data.nickname","user.role":"$data.role","user.username":"$data._id"
                        }
                    },
                    { "$skip": start },
                    { "$limit": limit }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage}
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query.limit && params.query.filter && params.query.filter.type == 'message'){
            var limit = parseInt(params.query.limit);
            var getdata = {
                url: process.env.MONGO_URI,
                client: "chats",
                docType: 1,
                query: [
                    {
                        "$match": {
                            "room": params.params.roomId,
                            "type": { "$regex": params.query.filter.type, "$options": 'i' }
                        }
                    },
                    {
                        "$lookup": {
                            "from": 'users',
                            "localField": 'user',
                            "foreignField": '_id',
                            "as": 'data',
                        }
                    },
                    { "$unwind": { "path": "$data", "preserveNullAndEmptyArrays": true } },
                    {
                        "$project": {
                            "attach": 1, "createdAt": 1, "id": "$_id", "message": 1, "room": 1, "type": 1, "_id": 0,
                            "user": {
                                "id": "$data._id",
                                "nickname": "$data.nickname",
                                "role": "$data.role",
                                "username": "$data._id"
                            }
                        }
                    },
                    { "$limit": limit }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        }else if (params.query && params.query.filter && params.query.filter.type == 'face') {
            var limit = parseInt(params.query.limit);
            var sort = -1;
            var getdata = {
                url: process.env.MONGO_URI,
                client: "chats",
                docType: 1,
                query: [
                    {
                        "$match": {
                            "room": params.params.roomId,
                            "type": { "$regex": params.query.filter.type, "$options": 'i' }
                        }
                    },
                    {
                        "$lookup": {
                            "from": 'users',
                            "localField": 'user',
                            "foreignField": '_id',
                            "as": 'data',
                        }
                    },
                    { "$unwind": { "path": "$data", "preserveNullAndEmptyArrays": true } },
                    {
                        "$project": {
                            "attach": 1, "createdAt": 1, "_id": 0, "metadata": 1, "room": 1, "type": 1, "id": "$_id",
                            "user": {
                                "id": "$data._id",
                                "nickname": "$data.nickname",
                                "role": "$data.role",
                                "username": "$data._id"
                            }
                        }
                    },
                    {
                        $sort: { createdAt: sort }
                    },
                    { "$limit": limit }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query && params.query.filter && params.query.filter.type == 'event') {
            var limit = parseInt(params.query.limit);
            var sort = -1;
            var getdata = {
                url: process.env.MONGO_URI,
                client: "chats",
                docType: 1,
                query: [
                    {
                        "$match": {
                            "room": params.params.roomId,
                            "type": { "$regex": params.query.filter.type, "$options": 'i' }
                        }
                    },
                    {
                        "$lookup": {
                            "from": 'users',
                            "localField": 'user',
                            "foreignField": '_id',
                            "as": 'data',
                        }
                    },
                    { "$unwind": { "path": "$data", "preserveNullAndEmptyArrays": true } },
                    {
                        "$project": {
                            "attach": 1, "createdAt": 1, "_id": 0, "metadata": 1, "room": 1, "type": 1, "id": "$_id",
                            "user": {
                                "id": "$data._id",
                                "nickname": "$data.nickname",
                                "role": "$data.role",
                                "username": "$data._id"
                            }
                        }
                    },
                    {
                        $sort: { createdAt: sort }
                    },
                    { "$limit": limit }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        }   else if (params.query && params.query.filter && params.query.filter.type == 'remark') {
            var limit = parseInt(params.query.limit);
            var sort = -1;
            var getdata = {
                url: process.env.MONGO_URI,
                client: "chats",
                docType: 1,
                query: [
                    {
                        "$match": {
                            "room": params.params.roomId,
                            "type": { "$regex": params.query.filter.type, "$options": 'i' }
                        }
                    },
                    {
                        "$lookup": {
                            "from": 'users',
                            "localField": 'user',
                            "foreignField": '_id',
                            "as": 'data',
                        }
                    },
                    { "$unwind": { "path": "$data", "preserveNullAndEmptyArrays": true } },
                    {
                        "$project": {
                            "attach": 1, "createdAt": 1, "_id": 0, "metadata": 1, "room": 1, "type": 1, "id": "$_id",
                            "user": {
                                "id": "$data._id",
                                "nickname": "$data.nickname",
                                "role": "$data.role",
                                "username": "$data._id"
                            }
                        }
                    },
                    {
                        $sort: { createdAt: sort }
                    },
                    { "$limit": limit }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
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
let getCandidateMessagesDetails = async (params) => {
    try{
        if(params.query.sort.id){
            var getdata = {
                url: process.env.MONGO_URI,
                client: "chats",
                docType: 1,
                query: [
                    {$match:{room:params.params.roomId}},
                    { $lookup: { from: "attaches",
                    localField: "attach",
                     foreignField: "_id",
                    as: "attach" } },
                    { $lookup: { from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user" } },
                    { "$unwind": { "path": "$user", "preserveNullAndEmptyArrays": true } },
                    {$sort:{id:1}}
                ]
            }
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
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

let SubmitSaveCall = async (params) => {
    try{ 
        if(params.body.conclusion=="null"){
            params.body.conclusion=null
        }
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 0,
            query: {
                filter: { "_id": params.query.id },
                update: { $set: params.body }
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage && responseData.data.statusMessage.nModified == 1){
            let getData = await schedule.roomSubmitSave(params);
            if(getData && getData.data && getData.data.statusMessage){
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

module.exports = {
    getCandidateMessages,
    SubmitSaveCall,
    getCandidateMessagesDetails
}