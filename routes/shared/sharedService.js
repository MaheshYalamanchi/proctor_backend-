const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const crypto = require('crypto');
const tokenService = require('../../routes/proctorToken/tokenService');
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
module.exports = {
    proctorLoginCall
}