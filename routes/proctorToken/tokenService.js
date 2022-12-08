var jwt = require('jsonwebtoken');
var uuid = require('uuid-random');
let generateProctorToken = async (req) => {
    try {
        var secret = 'wie9iekohFingei5ieveith2';
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
        var secret = 'wie9iekohFingei5ieveith2';
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
        user.requestType = req.requestType
        var secret = 'eime6Daeb2xanienojaefoh4';
        let tokenArg = {
            // nickname : user.username,
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
            return 'Error While Generating Token!';
        }
    } catch (err) {
        return err;
    }
};
module.exports = {
    generateProctorToken,
    ProctorTokenGeneration,
    generateToken
}