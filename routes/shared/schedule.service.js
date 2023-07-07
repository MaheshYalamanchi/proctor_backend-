const { off } = require("npm");
const invoke = require("../../lib/http/invoke");
const schedule = require("../auth/sehedule");
const shared = require('../shared/shared');
const logger = require('../../logger/logger');
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
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
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
                    {$sort:{createdAt:-1}},
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
            let sort = -1;
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
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
                            "attach": 1, "createdAt": 1, "_id": 0, "metadata": 1, "room": 1, "type": 1, "id": "$_id","message":1,
                            "user": {
                                "id": "$data._id",
                                "nickname": "$data.nickname",
                                "role": "$data.role",
                                "username": "$data._id"
                            }
                            
                        }
                    },
                    { "$unwind": { "path": "$attach", "preserveNullAndEmptyArrays": true } },
                    {
                        "$lookup": {
                            "from": 'attaches',
                            "localField": 'attach',
                            "foreignField": '_id',
                            "as": 'attaches',
                        }
                    },
                    { "$unwind": { "path": "$attaches", "preserveNullAndEmptyArrays": true } },
                    {
                        "$project": {
                            "type":"$type","createdAt": "$createdAt", "metadata": "$metadata", "room": "$room", "id":"$id","message":"$message",
                            "user": {
                                        "id": "$user.id",
                                        "nickname": "$user.nickname",
                                        "role": "$user.role",
                                        "username": "$user.id"
                                    },
                            "attach":[
                                        {
                                            "filename":"$attaches.filename",
                                            "mimetype":"$attaches.mimetype",
                                            "id":"$attaches._id"
                                        }
                                     ]
                        }
                    },
                    {
                        "$facet": {
                            "data": [
                                { "$sort": { "createdAt": sort } },
                                { "$limit": limit }
                            ],
                            "total_count": [
                                { "$group": { _id: null, "count": { "$sum": 1 } } },
                                { "$project" : {_id:0 }}
                            ]
                        }
                    },
                    { "$unwind": { "path": "$total_count", "preserveNullAndEmptyArrays": true } },
                    {"$project":{"data":"$data","total":"$total_count.count"}}
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query && params.query.skip && params.query.filter && params.query.filter.type == 'face') {
            var limit = parseInt(params.query.limit);
            var start = parseInt(params.query.skip);
            var sort = -1;
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
                docType: 1,
                query:[
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
                        { "$unwind": { "path": "$attach", "preserveNullAndEmptyArrays": true } },
                        {
                            "$lookup": {
                                "from": 'attaches',
                                "localField": 'attach',
                                "foreignField": '_id',
                                "as": 'attaches',
                            }
                        },
                        { "$unwind": { "path": "$attaches", "preserveNullAndEmptyArrays": true } },
                        {
                            "$project": {
                                "type":"$type","createdAt": "$createdAt", "metadata": "$metadata", "room": "$room", "id":"$id",
                                "user": {
                                            "id": "$user.id",
                                            "nickname": "$user.nickname",
                                            "role": "$user.role",
                                            "username": "$user.id"
                                        },
                                "attach":[
                                            {
                                                "filename":"$attaches.filename",
                                                "mimetype":"$attaches.mimetype",
                                                "id":"$attaches._id"
                                            }
                                         ]
                            }
                        },
                        {
                            "$facet": {
                                "data": [
                                    { "$sort": { "createdAt": sort } },
                                    { "$limit": limit },
                                    { "$skip" : start}
                                ],
                                "total_count": [
                                    { "$group": { _id: null, "count": { "$sum": 1 } } },
                                    { "$project" : {_id:0 }}
                                ]
                            }
                        },
                        { "$unwind": { "path": "$total_count", "preserveNullAndEmptyArrays": true } },
                        {"$project":{"data":"$data","total":"$total_count.count"}}
                        ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query && params.query.filter && params.query.filter.type == 'face') {
            var limit = parseInt(params.query.limit);
            var sort = -1;
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
                docType: 1,
                query:[
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
                        { "$unwind": { "path": "$attach", "preserveNullAndEmptyArrays": true } },
                        {
                            "$lookup": {
                                "from": 'attaches',
                                "localField": 'attach',
                                "foreignField": '_id',
                                "as": 'attaches',
                            }
                        },
                        { "$unwind": { "path": "$attaches", "preserveNullAndEmptyArrays": true } },
                        {
                            "$project": {
                                "type":"$type","createdAt": "$createdAt", "metadata": "$metadata", "room": "$room", "id":"$id",
                                "user": {
                                            "id": "$user.id",
                                            "nickname": "$user.nickname",
                                            "role": "$user.role",
                                            "username": "$user.id"
                                        },
                                "attach":[
                                            {
                                                "filename":"$attaches.filename",
                                                "mimetype":"$attaches.mimetype",
                                                "id":"$attaches._id"
                                            }
                                         ]
                            }
                        },
                        {
                            "$facet": {
                                "data": [
                                    { "$sort": { "createdAt": sort } },
                                    { "$limit": limit }
                                ],
                                "total_count": [
                                    { "$group": { _id: null, "count": { "$sum": 1 } } },
                                    { "$project" : {_id:0 }}
                                ]
                            }
                        },
                        { "$unwind": { "path": "$total_count", "preserveNullAndEmptyArrays": true } },
                        {"$project":{"data":"$data","total":"$total_count.count"}}
                        ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query && params.query.skip && params.query.filter && params.query.filter.type == 'event') {
            var limit = parseInt(params.query.limit);
            var start = parseInt(params.query.skip);
            var sort = -1;
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
                docType: 1,
                query: 
                [
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
                        "$lookup": {
                            "from": 'attaches',
                            "localField": 'attach',
                            "foreignField": '_id',
                            "as": 'attachesData',
                        }
                    },
                    {
                        $project:{
                            attach:{
                                $map:{
                                    "input":"$attachesData",
                                    as:"sec",
                                    in:{
                                        "id":"$$sec._id",
                                        "filename":"$$sec.filename",
                                        "mimetype":"$$sec.mimetype",
                                    }
                                }
                            },
                            "createdAt": 1, "_id": 0, "metadata": 1, "room": 1, "type": 1, "id": "$_id",
                            "user": {
                                "id": "$data._id",
                                "nickname": "$data.nickname",
                                "role": "$data.role",
                                "username": "$data._id"
                            }
                        }
                    },
                    {
                        "$facet": {
                            "data": [
                                { "$sort": { "createdAt": sort } },
                                {"$skip":start},
                                { "$limit": limit },
                            ],
                            "total_count": [
                                { "$group": { _id: null, "count": { "$sum": 1 } } },
                                { "$project" : {_id:0 }}
                            ]
                        }
                    },
                    { "$unwind": { "path": "$total_count", "preserveNullAndEmptyArrays": true } },
                    {"$project":{"data":"$data","total":"$total_count.count"}}
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query && params.query.filter && params.query.filter.type == 'event') {
            var limit = parseInt(params.query.limit);
            var sort = -1;
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
                docType: 1,
                query: 
                [
                    {
                        "$match": {
                            "room": params.params.roomId,
                            "type": { "$regex": params.query.filter.type, "$options": 'i' }
                        }
                    },
                    /*{ "$sort": { "createdAt": -1 } },
                    { "$limit": 20 },*/
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
                        "$lookup": {
                            "from": 'attaches',
                            "localField": 'attach',
                            "foreignField": '_id',
                            "as": 'attachesData',
                        }
                    },
                    {
                        $project:{
                            attach:{
                                $map:{
                                    "input":"$attachesData",
                                    as:"sec",
                                    in:{
                                        "id":"$$sec._id",
                                        "filename":"$$sec.filename",
                                        "mimetype":"$$sec.mimetype",
                                    }
                                }
                            },
                            "createdAt": 1, "_id": 0, "metadata": 1, "room": 1, "type": 1, "id": "$_id",
                            "user": {
                                "id": "$data._id",
                                "nickname": "$data.nickname",
                                "role": "$data.role",
                                "username": "$data._id"
                            }
                        }
                    },
                    {
                        "$facet": {
                            "data": [
                                { "$sort": { "createdAt": sort } },
                                { "$limit": limit }
                            ],
                            "total_count": [
                                { "$group": { _id: null, "count": { "$sum": 1 } } },
                                { "$project" : {_id:0 }}
                            ]
                        }
                    },
                    { "$unwind": { "path": "$total_count", "preserveNullAndEmptyArrays": true } },
                    {"$project":{"data":"$data","total":"$total_count.count"}}
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        }   else if (params.query && params.query.filter && params.query.filter.type == 'remark') {
            var limit = parseInt(params.query.limit);
            var sort = -1;
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
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
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "chats",
                docType: 1,
                query:[
                    {
                        "$match": {
                            "room": params.params.roomId
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
                            "attach": 1, "createdAt": 1, "_id": 0, "metadata": 1, "room": 1, "type": 1, "id": "$_id","message":1,
                            "user": {
                                "id": "$data._id",
                                "nickname": "$data.nickname",
                                "role": "$data.role",
                                "username": "$data._id"
                            }
                        }
                    },
                    {"$sort":{id:1}}
                ]
            }
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                for (const data of responseData.data.statusMessage) {
                    let response = await shared.getChatDetails(data)
                    data.attach = response.message
                }
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
            params.body.conclusion=null;
            params.body.status='stopped';
        } else if (params.body.conclusion=="negative"){
            params.body.status='rejected';
        } else if (params.body.conclusion=="positive"){
            params.body.status='accepted';
        }
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 0,
            query: {
                filter: { "_id": params.query.id },
                update: { $set: params.body }
            }
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
        console.log('n modified before',responseData.data.statusMessage.nModified)
        if(responseData && responseData.data && responseData.data.statusMessage && responseData.data.statusMessage.nModified == 1){
            console.log('n modified after',responseData.data.statusMessage.nModified)
            let getData = await schedule.roomSubmitSave(params);
            if(getData && getData.data && getData.data.statusMessage){
                console.log('roomsubmisave',getData.data.statusMessage)
                let violatedResponse = await shared.getViolated(params.query)
                if(violatedResponse && violatedResponse.success){
                    try {
                        console.log(violatedResponse,'violation response')
                        let roomData = getData.data.statusMessage[0]
                        let jsonData = {
                                "score": roomData.score,
                                "student": roomData.student.id,
                                "email": roomData.tags[0],
                                "labels": roomData.labels ||"-",
                                "verified": "yes",
                                "id": roomData.id,
                                "face": roomData.student.face,
                                "passport": roomData.student.passport,
                                "subject": roomData.subject,
                                "startedAt": roomData.startedAt,
                                "stoppedAt": roomData.stoppedAt ||new Date() ,
                                "credibility" :"0%",
                                "conclusion": roomData.conclusion || "-",
                                "proctor": roomData.members,
                                "comment": roomData.comment,
                                "averages": roomData.averages,
                                "xaxis": roomData.timesheet.xaxis,
                                "yaxis": roomData.timesheet.yaxis,
                                "metrics": roomData.metrics,
                                "screen" : violatedResponse.message,
                                "browser": roomData.browser,
                                "os": roomData.os,
                                "ipaddress": roomData.ipaddress,
                                "duration": roomData.duration,
                                "status": roomData.status
                            }
                        let  generateReport = await invoke.makeHttpCallReportService("post", "/v1/generate-pdf", jsonData)
                        if (generateReport) {
                            logger.info({ success: true, message: "pdf report generated successfully..." });
                        } else {
                            logger.info({ success: false, message: "pdf report not generated..." });
                        }
                    }catch(error){
                        logger.info({ success: false, message: "pdf report not generated..." });
                    }
                }
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