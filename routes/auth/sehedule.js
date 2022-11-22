const invoke = require("../../lib/http/invoke");
const scheduleService = require("../auth/schedule.service");
const globalMsg = require('../../configuration/messages/message');
let roomUserDetails = async(params)=>{
    try{
        var userdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query:[
                {
                    $match:{_id:params._id}
                },
                {
                    $unwind:"$similar"
                },
                {
                    $lookup:{
                                from: 'users',
                                localField: 'similar.user',
                                foreignField: '_id',
                                as: 'data',
                            }
                },
                { $unwind: { path: "$data", preserveNullAndEmptyArrays: true } },
                {
                    $project:{
                        _id:0,
                        user:{
                            "id":"$data._id",
                            "face":"$data.face",
                            "nickname":"$data.nickname",
                            "username":"$data._id"    
                        },
                        "distance":"$similar.distance"
                    }
                }
            ]
        }
        let responseData = await invoke.makeHttpCall("post", "aggregate",userdata);
        if(responseData){
        return responseData;  
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let roomUserEdit = async(params) =>{
    try{
        var postdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query: [
                {
                    $match:{_id:params.id}
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", postdata);
        if(responseData){
            return responseData;
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let roomUserDelete = async(params) =>{
    var getdata = {
        url: process.env.MONGO_URI,
        client: "rooms",
        docType: 1,
        query:{
            _id:params._id
        }  
    };
    let responseData = await invoke.makeHttpCall("post", "removeData", getdata);
    if(responseData){
        return responseData;
    }else{
        return "Data Not Found";
    }
};
let roomUserSave = async(params) =>{
    var getdata = {
        url: process.env.MONGO_URI,
        client: "rooms",
        docType: 1,
        query: [
                {
                    $match:{_id:params}
                }
            ]
    };
    let getData = await invoke.makeHttpCall("post", "aggregate", getdata);
    if(getData){
        return getData;
    }else{
        return "Data Not Found";
    }
};
let userEdit = async(params) =>{
    try{
        var postdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: [
                { 
                    $addFields: {test: { $toString: "$_id" }} 
                },
                {
                    $match:{test:params}
                },
                {
                    $project:{_id:0,test:0}
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", postdata);
        if(responseData){
            return responseData;
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let UserSave = async(params) =>{
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: [
                {
                    $match:{_id:params}
                },
                {
                    $project:{"id":"$_id","username":"$_id",_id:0,createdAt:1,exclude:1,group:1,labels:1,lang:1,locked:1,nickname:1,role:1,secure:1,similar:1}
                }
            ]
        };
        let getData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(getData){
            return getData;
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let UserDelete = async(params) =>{
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query:{
                _id:params._id
            }  
        };
        let responseData = await invoke.makeHttpCall("post", "removeData", getdata);
        if(responseData){
            return responseData;
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let MessageSend = async(params) =>{
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "chats",
            docType: 1,
            query:[
                { 
                    "$addFields": {"test": { "$toString": "$_id" }} 
                },
                {
                    "$match":{"test":params}
                },
                {
                    "$lookup":{
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
                    "$project":{
                                "attach":1,"createdAt":1,"id":"$test","message":1,"room":1,"type":1,"_id":0,"metadata":1,
                                "user":{
                                            "id":"$data._id",
                                            "nickname":"$data.nickname",
                                            "role":"$data.role",
                                            "username":"$data._id"    
                                        }
                            }
                }
            ] 
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(responseData&& responseData.data && responseData.data.statusMessage){
            let response = await scheduleService.getcount(responseData.data.statusMessage[0]);
            responseData.data.statusMessage[0].metadata.incidents = response.data.statusMessage[0].incidents;
            return responseData;
        }else{
            return "Data Not Found";
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};

module.exports ={
    roomUserDetails,
    roomUserEdit,
    roomUserDelete,
    roomUserSave,
    userEdit,
    UserSave,
    UserDelete,
    MessageSend,
}