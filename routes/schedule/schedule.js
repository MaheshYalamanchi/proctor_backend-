const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const shared_Service = require("./shared.service");

let eventInfo = async (params) => {
    try {
        var getdata = {
            database:"proctor",
            model: "chats",
            docType: 1,
            query: [
                {
                    "$addFields": { "test": { "$toString": "$_id" } }
                },
                {
                    "$match": { "test": params }
                },
                {
                    "$lookup": {
                        "from": 'users',
                        "localField": 'user',
                        "foreignField": '_id',
                        "as": 'data',
                    }
                },
                {
                    "$unwind": { "path": "$data", "preserveNullAndEmptyArrays": true }
                },
                {
                    "$project": {
                        "attach": 1, "createdAt": 1, "id": "$test", "message": 1, "room": 1, "type": 1, "_id": 0, "metadata": 1,
                        "user": {
                            "id": "$data._id",
                            "nickname": "$data.nickname",
                            "role": "$data.role",
                            "username": "$data._id"
                        }
                    }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message:responseData.data.statusMessage}
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
let updateScore = async (params) => {
    try {
        var getdata = {
            database:"proctor",
            model: "rooms",
            docType: 1,
            query: [
                {$match :{_id:params.room}}
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            let roomsData = responseData.data.statusMessage[0];
            let timestamp = new Date(params.timestamp || new Date());
                metrics = params.metrics || {};
                timesheet = roomsData.timesheet || (roomsData.timesheet = {});
            roomsData.duration || (roomsData.duration = 0);
            roomsData.duration || (roomsData.duration + 1);
            var jsonData = {
                timesheet : {
                    firstAt : timesheet.firstAt || (timesheet.firstAt = timestamp),
                    lastAt  : timesheet.lastAt = timestamp,
                    sum : timesheet.sum || (timesheet.sum = {})
                },
                duration : roomsData.duration
            };
            params.jsonData = jsonData
            let response = await shared_Service.roomsUpdate(params);
            if (response && response.success){
                let score = await shared_Service.roomsInfo(params);
                if (score && score.success){
                    return { success: true, message:score.message[0].score}
                }else {
                    return { success: false, message: 'Data Not Found' };
                }
            }else {
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
let faceInfo = async (params) => {
    try {
        var getdata = {
            database:"proctor",
            model: "chats",
            docType: 1,
            query: [
                {
                    "$addFields": { "test": { "$toString": "$_id" } }
                },
                {
                    "$match": { "test": params }
                },
                {
                    "$lookup": {
                        "from": 'users',
                        "localField": 'user',
                        "foreignField": '_id',
                        "as": 'data',
                    }
                },
                {
                    "$unwind": { "path": "$data", "preserveNullAndEmptyArrays": true }
                },
                {
                    "$project": {
                        "attach": 1, "createdAt": 1, "id": "$test", "message": 1, "room": 1, "type": 1, "_id": 0, "metadata": 1,
                        "user": {
                            "id": "$data._id",
                            "nickname": "$data.nickname",
                            "role": "$data.role",
                            "username": "$data._id"
                        }
                    }
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message:responseData.data.statusMessage}
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
let attachInsertion = async (params) => {
    try {
        jsonData = {
            "_id" : params.attach[0],
            "user" : params.user.id,
            "filename" : "face.jpg",
            "mimetype" : "image/jpeg",
            "metadata" : params.metadata
        }
        var getdata = {
            database:"proctor",
            model: "attaches",
            docType: 0,
            query: jsonData
        };
        let responseData = await invoke.makeHttpCall("post", "insert", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage._id) {
            let response = await shared_Service.attachInfo(responseData.data.statusMessage._id);
            if (response && response.success){
                return { success: true, message:response.message}
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

module.exports = {
    eventInfo,
    updateScore,
    faceInfo,
    attachInsertion
}