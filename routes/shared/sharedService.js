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
            let Token = await tokenService.generateProctorToken(responseData);
            return {success:true,message:{exp: decodeToken.exp,iat:decodeToken.iat,id:responseData.data.statusMessage[0].username,
                role:responseData.data.statusMessage[0].role,
                token:Token}
            }
        }else{
            return {success:false, message : 'Data Not Found'}   
        }
    }catch{
        return {success:false, message : 'Please check TokenId'}
    }
};

module.exports = {
    proctorLoginCall,
    proctorMeCall,
    proctorFetchCall,
    proctorAuthCall
}