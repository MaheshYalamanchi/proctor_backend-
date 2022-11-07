const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const schedule =require("../auth/sehedule");
const jwt_decode = require('jwt-decode');
let getCandidateMessageSend = async (params) => {
    try{
        var decodeToken = jwt_decode(params.headers.authorization);
        params.body.createdAt = new Date();
        params.body.room = params.params.userId;
        params.body.user = decodeToken.id;
        var getdata = {
            url: process.env.MONGO_URI,
            client: "chats",
            docType: 0,
            query: params.body
        };
        let response = await invoke.makeHttpCall("post", "write", getdata);
        if(response && response.data && response.data.iid){
            let responseData = await schedule.MessageSend(response.data.iid);
            if(responseData && responseData.data && responseData.data.statusMessage){
                return{success:true,message:responseData.data.statusMessage}
            }else{
                return {success:false, message : 'Data Not Found'};
            }
        }else{
            return {success:false, message : 'Data Not Found'};
        }
    }catch{
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let getMessageTemplates = async (params) => {
    try{
        start = 0;
        count = 0;
        var getdata = {
            url: process.env.MONGO_URI,
            client: "Blank",
            docType: 1,
            query: params
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage){
            return{success:true,message:{data:responseData.data.statusMessage,pos:start,total_count:count}}
        }else{
            return {success:false, message : 'Data Not Found'};
        }
    }catch{
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};

module.exports = {
    getCandidateMessageSend,
    getMessageTemplates,
}