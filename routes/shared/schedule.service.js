const invoke = require("../../lib/http/invoke");
let getCandidateMessages = async (params) => {
    try {
        if (params.query && params.query.filter && params.query.filter.type == 'message') {
            var limit = parseInt(params.query.limit);
            var getdata = {
                url: process.env.MONGO_URI,
                client: "chats",
                docType: 1,
                query: [
                    {
                        "$match": {
                            "room": params.params.userId,
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
        } else if (params.query && params.query.filter && params.query.filter.type == 'face') {
            var limit = parseInt(params.query.limit);
            var sort = -1;
            var getdata = {
                url: process.env.MONGO_URI,
                client: "chats",
                docType: 1,
                query: [
                    {
                        "$match": {
                            "room": params.params.userId,
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
                            "room": params.params.userId,
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

module.exports = {
    getCandidateMessages
}