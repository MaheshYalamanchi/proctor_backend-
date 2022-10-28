const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const crypto = require('crypto');
const tokenService = require('../../routes/proctorToken/tokenService');
const jwt_decode = require('jwt-decode');
let proctorLoginCall = async (params) => {
    try{
        var postdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: {
                username:params.username
            }
        };
        let responseData = await invoke.makeHttpCall("post", "read", postdata);
        if(responseData && responseData.data){
            let salt = responseData.data.statusMessage[0].salt;
            let hashedPassword=responseData.data.statusMessage[0].hashedPassword;
            let encryptPassword = crypto.createHmac("sha1", salt).update(params.password).digest("hex");
            let validPassword = !(!params.password || !salt) && encryptPassword === hashedPassword;
            let response = await tokenService.generateProctorToken(responseData);
            if(validPassword){
                return {success:true,message:{id:responseData.data.statusMessage[0].username,
                    role:responseData.data.statusMessage[0].role,token:response}}
            }else{
                return {success:false,message:'Please check password.'}
            }
        }else{
            return {success:false, message : 'Please check username'}
        }
    } catch (error) {
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let proctorMeCall = async (params) => {
    var decodeToken = jwt_decode(params.authorization);
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: {
                username:decodeToken.id
            }
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
        if(responseData && responseData.data){
            return{success:true,message:{browser:responseData.data.statusMessage[0].browser,
                os:responseData.data.statusMessage[0].os,platform:responseData.data.statusMessage[0].platform,
                role:responseData.data.statusMessage[0].role,labels:responseData.data.statusMessage[0].labels,
                exclude:responseData.data.statusMessage[0].exclude,username:responseData.data.statusMessage[0].username,
                createdAt:responseData.data.statusMessage[0].createdAt,similar:responseData.data.statusMessage[0].similar,
                nickname:responseData.data.statusMessage[0].nickname,ipaddress:responseData.data.statusMessage[0].ipaddress,
                loggedAt:responseData.data.statusMessage[0].loggedAt,group:responseData.data.statusMessage[0].group,
                lang:responseData.data.statusMessage[0].lang,locked:responseData.data.statusMessage[0].locked,
                secure:responseData.data.statusMessage[0].secure,useragent:responseData.data.statusMessage[0].useragent
                }}
        }else{
            return {success:false, message : 'Data Not Found'}
        }
    }catch{
        return {success:false, message : 'Please check username'}
    }    
};
let proctorFetchCall = async (params) => {
    var decodeToken = jwt_decode(params.authorization);
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: {
                username:decodeToken.id
            }
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
        if(responseData && responseData.data){
            return{success:true,message:{}}
        }else{
            return {success:false, message : 'Data Not Found'}
        }
    }catch{
    }
};
let proctorAuthCall = async (params) => {
    var decodeToken = jwt_decode(params.authorization);
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: {
                username:decodeToken.id
            }
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
        if(responseData && responseData.data){
            return {success:true,message:{exp: decodeToken.exp,iat:decodeToken.iat,id:responseData.data.statusMessage[0].username,
                role:responseData.data.statusMessage[0].role,
                token:params.authorization}
            }
        }else{
            return {success:false, message : 'Data Not Found'}   
        }
    }catch{
        return {success:false, message : 'Please check TokenId'}
    }
};
let proctorLimitCall = async (params) => {
    var sort;
    if(params.query&&params.query.sort&&params.query.sort.subject){
        if(params.query.sort.subject=='desc'){
            sort=-1;
        }else if(params.query.sort.subject=='asc'){
            sort=1;
        }
    }
    var limit = parseInt(params.query.limit);
    var start= parseInt(params.query.start);
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query:[
                {
                 $facet: 
                        {
                            "data": [
                                        {$sort: { subject: sort }}, 
                                        { "$skip": start }, 
                                        { "$limit": limit }
                                    ],
                            "total_count":  [
                                                { $group: { _id: null, count:{ $sum: 1 }}},
                                                { $project: { _id: 0 } }
                                            ]
                        }
                },
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(responseData && responseData.data){
            return{success:true,message:{data:responseData.data.statusMessage[0].data,pos:start,total_count:responseData.data.statusMessage[0].total_count[0].count}}
        }else{
            return {success:false, message : 'Data Not Found'}
        }
    }catch{
        return {success:false, message : 'Please check the Token'}
    }
};
let proctorSearchCall = async (params) => {
    var sort;
    if(params.query&&params.query.sort&&params.query.sort.subject){
        if(params.query.sort.subject=='desc'){
            sort=-1;
        }else if(params.query.sort.subject=='asc'){
            sort=1;
        }
    }
    var limit = parseInt(params.query.limit);
    var start= parseInt(params.query.start);
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query:[
                    {
                        $match:{
                                subject:{$regex:params.query.filter, $options:'i'}
                            }
                    },
                    {
                    $facet: 
                            {
                                "data": [
                                        {"$sort": { subject: sort }}, 
                                        { "$skip": start }, 
                                        { "$limit": limit }
                                ],
                                "poc":[
                                        { $group: { _id: null, count:{ $sum: 1 }}},
                                        { $project: { _id: 0 } }
                                ]
                            }
                    },
                 ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(responseData && responseData.data){
            return{success:true,message:{data:responseData.data.statusMessage[0].data,pos:start,total_count:responseData.data.statusMessage[0].poc[0].count}};
        }else{
            return {success:false, message : 'Data Not Found'};
        }
    }catch{
        return {success:false, message : 'Please check the Token'};
    }
};
let proctorSuggestCall = async (params) => {
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: [
                {
                   $match:{
                            $and:[
                                    {role:{$regex:"student", $options:'i'}},
                                    {nickname:{$regex:params.query.filter.value, $options:'i'}}
                                ]
                         }
                },
                { 
                    $limit : 100 
                },
                {
                    $project : { "_id": 1, "nickname" : 1 , "role" : 1,username:"$_id" }
                },

                {
                    $sort:{"nickname":1}
                },
             ]   
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(responseData && responseData.data){
            return {success:true,message:responseData.data.statusMessage}
        }else{
            return {success:false, message : 'Data Not Found'}   
        }
    }catch{
        return {success:false, message : 'Please check params'}
    }
};

module.exports = {
    proctorLoginCall,
    proctorMeCall,
    proctorFetchCall,
    proctorAuthCall,
    proctorLimitCall,
    proctorSearchCall,
    proctorSuggestCall
}