var jwt = require('jsonwebtoken');
var uuid = require('uuid-random');
const scheduleService = require('../shared/scheduleService');
const jwt_decode = require('jwt-decode');
const sharedService = require('../shared/sharedService');
const secret = 'eime6Daeb2xanienojaefoh4';
const invoke = require("../../lib/http/invoke");

let generateProctorToken = async (req) => {
    try {
        let user = { "provider": req.data.statusMessage[0].role, "username": req.data.statusMessage[0]._id }
        let tokenArg = {
            id: user.username,
            role: user.provider
        };
        user.proctorToken = jwt.sign(tokenArg, secret, { expiresIn: 5400000 });
        if (user.proctorToken) {
            return user.proctorToken;
        } else {
            return 'Error While Generating Token!';
        }
    } catch (err) {
        return err;
    }
};
let ProctorTokenGeneration = async (req) => {
    try {
        let user = { "id": req.statusMessage[0]._id, "provider": req.statusMessage[0].provider, "role": req.statusMessage[0].role };
        let tokenArg = {
            id: user.id,
            provider: user.provider,
            role: user.role
        };
        user.proctorToken = jwt.sign(tokenArg, secret, { expiresIn: 5400000 });
        if (user.proctorToken) {
            return user.proctorToken;
        } else {
            return 'Error While Generating Token!';
        }
    } catch (err){
        return err;
    }
};
let generateToken = async (req) => {
    try {
        let timeout = typeof req.timeout != 'undefined' ? req.timeout : 90
        let template = typeof req.template != 'undefined' ? req.template : "default"
        let user = {"assessmentId": req.assessmentId,"username": req.username,"nickname": req.nickname, "template": template,"subject":req.subject,"timeout":timeout}
        if (!req.roomId){
            user.id = uuid()
        }else{
            user.id = req.roomId
        }
        user.tags = [req.nickname,req.assessmentId, req.taskId];
        user.taskId = req.taskId
        user.nickname = req.nickname.replace(/\s/g, "");
        user.requestType = req.requestType;
        let tokenArg = {
            nickname : user.username,
            id : user.id,
            tags : user.tags,
            username : user.nickname,
            template : user.template,
            subject : user.subject,
            timeout : user.timeout
        };
        user.proctorToken = jwt.sign(tokenArg, secret, { expiresIn: 5400000 });
        if (user.proctorToken){
            return { success: true, message: "Proctor Token",ProctorToken:user.proctorToken };
        }else{
            return {success: false, message:'Error While Generating Token!'};
        }
    } catch (err) {
        return err;
    }
};
let jwtToken = async (req) => {
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: [
                {
                    $match:{_id:req.username}
                }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            let user = { "provider": responseData.data.statusMessage[0].provider, "id": responseData.data.statusMessage[0]._id ,"role":responseData.data.statusMessage[0].role,"room":req.id}
            let tokenArg = {
                id: user.id,
                provider: user.provider,
                role : user.role,
                room : user.room
            };
            user.proctorToken = jwt.sign(tokenArg, secret, { expiresIn: 5400000 });
            if (user.proctorToken) {
                return user.proctorToken;
            } else {
                return {success: false, message:'Error While Generating Token!'};
            }
        }else{
            return {success: false, message:'Data not found...'};
        }
    } catch (err) {
        console.log(err)
        return {success:false,message:'Something went wrong!'};
    }
};
module.exports = {
    generateProctorToken,
    ProctorTokenGeneration,
    generateToken,
    jwtToken
}