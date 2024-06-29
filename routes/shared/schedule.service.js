const { off } = require("npm");
const invoke = require("../../lib/http/invoke");
const schedule = require("../auth/sehedule");
const shared = require('../shared/shared');
const logger = require('../../logger/logger');
const jwt_decode = require('jwt-decode');
const _schedule = require('../schedule/schedule');
const { param } = require("express-validator/check");
let getCandidateMessages = async (params) => {
    try {
        let  decodeToken = jwt_decode(params.headers.authorization);
        let url;
        let database;
        let tenantResponse;
        if(decodeToken && decodeToken.tenantId){
            tenantResponse = await _schedule.getTennant(decodeToken);
            if (tenantResponse && tenantResponse.success){
                url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                database = tenantResponse.message.databaseName;
            }else {
                    return { success: false, message: tenantResponse.message }
                }
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
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
                url: url,
                database: database,
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
                                { "$skip": start },
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
            let responseData = await invoke.makeHttpCall_roomDataService("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0]}
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query.limit && params.query.filter && params.query.filter.type == 'message'){
            var limit = parseInt(params.query.limit);
            let sort = -1;
            var getdata = {
                url: url,
                database: database,
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
            let responseData = await invoke.makeHttpCall_roomDataService("post", "aggregate", getdata);
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
                url: url,
                database: database,
                model: "chats",
                docType: 1,
                query:[
                        {
                            "$match": {
                                "room": params.params.roomId,
                                "type": { "$regex": params.query.filter.type, "$options": 'i' },
                                "attach": { $exists: true ,$ne:[null]}
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
                                    { "$skip" : start},
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
            let responseData = await invoke.makeHttpCall_roomDataService("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query && params.query.filter && params.query.filter.type == 'face') {
            var limit = parseInt(params.query.limit);
            var sort = -1;
            var getdata = {
                url: url,
                database: database,
                model: "chats",
                docType: 1,
                query:[
                        {
                            "$match": {
                                "room": params.params.roomId,
                                "type": { "$regex": params.query.filter.type, "$options": 'i' },
                                "attach": { $exists: true ,$ne:[null]}
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
            let responseData = await invoke.makeHttpCall_roomDataService("post", "aggregate", getdata);
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
                url: url,
                database: database,
                model: "chats",
                docType: 1,
                query: 
                [
                    {
                        "$match": {
                            "room": params.params.roomId,
                            "type": { "$regex": params.query.filter.type, "$options": 'i' },
                            "attach": { $exists: true ,$ne:[]}
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
                            "createdAt": 1, "_id": 0, "metadata": 1, "room": 1, "type": 1, "id": "$id",
                            "user": 1
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
            let responseData = await invoke.makeHttpCall_roomDataService("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else if (params.query && params.query.filter && params.query.filter.type == 'event') {
            var limit = parseInt(params.query.limit);
            var sort = -1;
            var getdata = {
                url: url,
                database: database,
                model: "chats",
                docType: 1,
                query: 
                [
                    {
                        "$match": {
                            "room": params.params.roomId,
                            "type": { "$regex": params.query.filter.type, "$options": 'i' },
                            "attach": { $exists: true ,$ne:[]}
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
                            "createdAt": 1, "_id": 0, "metadata": 1, "room": 1, "type": 1, "id": "$id",
                            "user":1
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
            let responseData = await invoke.makeHttpCall_roomDataService("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        }   else if (params.query && params.query.filter && params.query.filter.type == 'remark') {
            var limit = parseInt(params.query.limit);
            var sort = -1;
            var getdata = {
                url: url,
                database: database,
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
                            "attach": 1, "createdAt": 1, "_id": 0, "metadata": 1, "room": 1, "type": 1, "id": "$id",
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
            let responseData = await invoke.makeHttpCall_roomDataService("post", "aggregate", getdata);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage }
            } else {
                return { success: false, message: 'Data Not Found' }
            }
        } else {
            return { success: false, message: 'Invalid Params Error' }
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
        let  decodeToken = jwt_decode(params.headers.authorization);
        let url;
        let database;
        let tenantResponse
        if(decodeToken && decodeToken.tenantId){
            tenantResponse = await _schedule.getTennant(decodeToken);
            if (tenantResponse && tenantResponse.success){
                url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                database = tenantResponse.message.databaseName;
            }else {
                    return { success: false, message: tenantResponse.message }
                }
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        if(params.query.sort.id){
            var getdata = {
                url: url,
                database: database,
                model: "chats",
                docType: 1,
                query:
                [
                    {
                        "$match": {
                            "room": params.params.roomId,
                            "$and": [
                                { "attach": { "$ne": [] } },
                                { "attach": { "$ne": [null] } },
                                { "$or": [
                                    { "type": "face" },
                                    { "type": { "$exists": true } }  // If type doesn't exist, it's considered a match
                                ]}
                            ]
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
                        "$lookup": {
                            "from": 'attaches',
                            "localField": 'attach',
                            "foreignField": '_id',
                            "as": 'attach',
                        }
                    },
                    { "$unwind": { "path": "$attacheData", "preserveNullAndEmptyArrays": true } },
                    {
                        "$project": {
                            "attach": 1, "createdAt": 1, "_id": 0, "metadata": 1, "room": 1, "type": 1, "id": "$_id","message":1,"updatedAt":1,
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
                // for (const data of responseData.data.statusMessage) {
                //     let response = await shared.getChatDetails(data)
                //     data.attach = response.message
                // }
                // responseData.data.statusMessage.forEach(data => {    
                // if (_.isEmpty(data.attach)) {         
                //     delete data.attach;     
                // } 
                // });
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
        var decodeToken = jwt_decode(params.body.authorization);
        let tenantResponse;
        let url;
        let database;
        if(decodeToken && decodeToken.tenantId){
            tenantResponse = await _schedule.getTennant(decodeToken);
            if (tenantResponse && tenantResponse.success){
                url = tenantResponse.message.connectionString+'/'+tenantResponse.message.databaseName;
                database = tenantResponse.message.databaseName;
                params.tenantResponse = tenantResponse;
            } else {
                return { success: false, message: tenantResponse.message }
            }
        } else {
            url = process.env.MONGO_URI+'/'+process.env.DATABASENAME;
            database = process.env.DATABASENAME;
        }
        if (params.body.status == "paused"){
            params.body.status ='paused';
        }else if(params.body.conclusion=="null"){
            params.body.conclusion=null;
            params.body.status='stopped';
        } else if (params.body.conclusion=="negative"){
            params.body.status='rejected';
        } else if (params.body.conclusion=="positive"){
            params.body.status= 'accepted';
        }
        params.body.stoppedAt = new Date()
        params.body.proctor = decodeToken.id
        delete params.body.authorization
        var getdata = {
            url: url,
            database: database,
            model: "rooms",
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
                    let roomData = getData.data.statusMessage[0]
                    if(!(roomData.status == "paused")){
                        if(tenantResponse && tenantResponse.success){
                            getData.data.statusMessage[0].tenantResponse = tenantResponse;
                            params.query.tenantResponse = tenantResponse;
                        }
                        let result = await schedule.logtimeupdate(getData.data.statusMessage[0])
                        let violatedResponse = await shared.getViolated(params.query)
                        if(violatedResponse && violatedResponse.success){
                            try {
                                let jsonData = {
                                        "score": roomData.score,
                                        "student": roomData.student.nickname,
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
                                        "browser": roomData.student.browser,
                                        "os": roomData.student.os,
                                        "ipaddress": roomData.ipaddress,
                                        "duration": roomData.duration,
                                        "status": roomData.status,
                                        "tenantResponse": tenantResponse
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
                        // console.log(JSON.stringify(getData.data.statusMessage[0]))
                        return { success: true, message: getData.data.statusMessage[0] }
                    } else {
                        return { success: true, message: getData.data.statusMessage[0] }
                    }
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