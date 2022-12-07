const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
const schedule = require("../auth/sehedule");
const jwt_decode = require('jwt-decode');
var jwt = require('jsonwebtoken');
const TOKEN_KEY ="eime6Daeb2xanienojaefoh4"
let getCandidateMessageSend = async (params) => {
    try {
        var decodeToken = jwt_decode(params.headers.authorization);
        params.body.createdAt = new Date();
        params.body.room = params.params.userId;
        params.body.user = decodeToken.id;
        delete params.body.headers;
        var getdata = {
            url: process.env.MONGO_URI,
            client: "chats",
            docType: 0,
            query: params.body
        };
        let response = await invoke.makeHttpCall("post", "write", getdata);
        if (response && response.data && response.data.iid) {
            let responseData = await schedule.MessageSend(response.data.iid);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
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
let getMessageTemplates = async (params) => {
    try {
        start = 0;
        count = 0;
        var getdata = {
            url: process.env.MONGO_URI,
            client: "Blank",
            docType: 1,
            query: params
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: { data: responseData.data.statusMessage, pos: start, total_count: count } }
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
let roomUserDatails = async (params) => {
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query: [
                { $match: { _id: params } }
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            responseData.data.statusMessage[0].id = responseData.data.statusMessage[0]._id;
            delete responseData.data.statusMessage[0]._id;
            return { success: true, message: responseData.data.statusMessage[0] }
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
let MessageTemplates = async (params) => {
    try {
        start = 0;
        count = 0;
        var getdata = {
            url: process.env.MONGO_URI,
            client: "Blank",
            docType: 1,
            query: params
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: { data: responseData.data.statusMessage, pos: start, total_count: count } }
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
let getNewChatMessagesV2 = async (params) => {
    try {
        if (params) {
            return { success: true, message: { data: {} , success:true} }
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
let getFaceResponse = async (params) => {
    decodeToken = jwt_decode(params.authorization)
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query: [
                {$match:{_id:decodeToken.id}},
                {
                    $lookup:{
                                from: 'attaches',
                                localField: '_id',
                                foreignField: 'user',
                                as: 'data',
                            }
                },
                { $unwind: { path: "$data", preserveNullAndEmptyArrays: true } },
                {$project:{id:"$data._id",_id:0,createdAt:"$data.createdAt",filename:"$data.filename",metadata:"$data.metadata",
                           mimetype:"$data.mimetype",size:"$data.size",user:"$_id"}
                }
                ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if (responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: responseData.data.statusMessage[0] }
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
let attachmentPostCall = async (params) => {
    decodeToken = jwt_decode(params.headers)
    var createdAt = new Date()
    try {
        var jsonData = {
            "createdAt":createdAt,
            "filename":params.myfile.originalFilename,
            "mimetype":params.myfile.mimetype,
            "size":params.myfile.size,
            "user":decodeToken.id,
            "attached" : true
        }
        var getdata = {
            url: process.env.MONGO_URI,
            client: "attaches",
            docType: 0,
            query: jsonData
        };
        let response = await invoke.makeHttpCall("post", "write", getdata);
        if (response && response.data && response.data.iid) {
            let responseData = await schedule.attachCall(response.data);
            if (responseData && responseData.data && responseData.data.statusMessage) {
                return { success: true, message: responseData.data.statusMessage[0] }
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
let tokenValidation = async(req, res )=> {
    const token = req.headers.authorization.split(" ");
    try {
        if (!token) {
            return {success:false,message:"A token is required for authentication"};
        }else{
            const decoded = jwt.verify(token[1],TOKEN_KEY);
            if(decoded){
                return{success:true,message:{Token:token[1]}}
            }else{
                return {success:false, message : 'Data Not Found'};
            }
        }
    }catch(error){
        if(error){
            return {success:false, message:"TokenExpiredError"}
        }else{
            return {success:false, message:error}
        }
    }
};


module.exports = {
    getCandidateMessageSend,
    getMessageTemplates,
    roomUserDatails,
    MessageTemplates,
    getNewChatMessagesV2,
    getFaceResponse,
    attachmentPostCall,
    tokenValidation
}