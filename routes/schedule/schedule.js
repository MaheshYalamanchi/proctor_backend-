const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const shared_Service = require("./shared.service");
const { SageMakerMetrics } = require("aws-sdk");

let eventInfo = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "chats",
            docType: 1,
            query: [
                { $match: { "_id": params  } },
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
                // {
                //     "$addFields": { "test": { "$toString": "$_id" } }
                // },
                {
                    "$project": {
                        "attach": 1, "createdAt": 1, "id": "$_id", "message": 1, "room": 1, "type": 1, "_id": 0, "metadata": 1,
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
            url:process.env.MONGO_URI,
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
            let c = roomsData.metrics;
            let timestamp = new Date(params.timestamp || new Date());
                metrics = params.metrics || {};
                timesheet = roomsData.timesheet || (roomsData.timesheet = {});
            if(!params.peak){
                roomsData.duration || (roomsData.duration = 0);
                var newduration =   roomsData.duration + 1 ;
            } else {
                var newduration = roomsData.duration
            }
            var jsonData = {
                timesheet : {
                    firstAt : timesheet.firstAt || (timesheet.firstAt = timestamp),
                    lastAt  : timesheet.lastAt = timestamp,
                    sum : timesheet.sum || (timesheet.sum = {}),
                    xaxis: timesheet.xaxis || [],
                    yaxis: timesheet.yaxis || [],  
                },
                duration : newduration,
                score:null,
                averages : {
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
            };
            var length = Object.keys(c).length;
            for(let A = 0; A < length;A++){
                let B = c[A];
                timesheet.sum[B]||(timesheet.sum[B]=0),(timesheet.sum[B] += metrics[B]||0)
                // timesheet.xaxis.sum[A]||(timesheet.sum[B]=0)
            };
            if (jsonData.timesheet.xaxis.length< length){
                let x = jsonData.timesheet.xaxis.length
                jsonData.timesheet.xaxis.push(x+1)
                jsonData.timesheet.yaxis.push(metrics);
            }else{
                for (const key in metrics) {
                    let data = jsonData.timesheet.yaxis[0][ key] + metrics[key]
                    jsonData.timesheet.yaxis[0][ key] = data
                }
            }
            let i = 0;
            for (const key in metrics) {
                if (Object.hasOwnProperty.call(metrics, key)) {
                    // const element = metrics[key];
                    var avgCal=(timesheet.sum[key] * roomsData.weights[i])/jsonData.duration || 0
                    if(avgCal<=100){
                        jsonData.averages[key]= Math.round(avgCal)
                    }else{
                        jsonData.averages[key]= 100
                    }
                    i = i+1
                }
            }
            TotalTime = ~~(new Date(roomsData.timesheet.lastAt).getTime() / 6e4) - ~~(new Date(roomsData.timesheet.firstAt).getTime() / 6e4 - 1);
            if (((isNaN(TotalTime) || TotalTime < 0) && (TotalTime = 0), TotalTime > 0 || roomsData.stoppedAt)) {
                let A =roomsData.metrics;
                const w = {};
                let scoreValue = 100;
                for (let g = 0; g < A.length; g++) {
                    const I = A[g];
                    let F = 0;
                    if ("n1" === I) {
                        F = jsonData.averages[I];
                        //F = ~~(100 * (1 - (jsonData.duration ? (jsonData.duration > TotalTime ? TotalTime : jsonData.duration) / TotalTime : 0)));
                    } else F = jsonData.averages[I];
                    (!F || isNaN(F) || F < 0) && (F = 0), F > 100 && (F = 100), (w[I] = F), (scoreValue -= F);
                }
                (!scoreValue || isNaN(scoreValue) || scoreValue < 0) && (scoreValue = 0), scoreValue > 100 && (scoreValue = 100), (jsonData.score = scoreValue);
            }
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
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "chats",
            docType: 1,
            query: [
                { $match: { '_id' : params  } },
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
                // {
                //     "$addFields": { "test": { "$toString": "$_id" } }
                // },
                {
                    "$project": {
                        "attach": 1, "createdAt": 1, "id": "$_id", "message": 1, "room": 1, "type": 1, "_id": 0, "metadata": 1,
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
            url:process.env.MONGO_URI,
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

let getRoomDetails = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 1,
            query: [
                {$match:{_id: params.query.id}}
        ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message:responseData.data.statusMessage[0]}
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
    attachInsertion,
    getRoomDetails
    
}