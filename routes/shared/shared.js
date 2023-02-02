const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');

let getSessions = async (params) => {
    try {
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 0,
            query: {
                filter:{ complete: { $ne: !0 }, status: "started", updatedAt: { $lt: new Date(Date.now() - 12e4) } },
                update:{$set:{ status: "paused"}}
            }   
        };
        let responseData = await invoke.makeHttpCall("post", "updatemany", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage.nModified) {
            return { success: true, message: 'Status updated successfully...' };
        } else {
            return { success: false, message: 'Status not updated...' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let updateRecord = async (params) => {
    try {
        let updatedAt = new Date().toISOString()    
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 0,
            query: {
                filter:{_id:params._id},
                update:{$set:{ updatedAt: updatedAt}}
            }   
        };
        let responseData = await invoke.makeHttpCall("post", "updateRecord", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage.nModified) {
            return { success: true, message: 'Status updated successfully...' };
        } else {
            return { success: false, message: 'Status not updated...' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getRecord = async (params) => {
    try {  
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query: {
                student:params.id
            }
        };
        let responseData = await invoke.makeHttpCall("post", "read", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: responseData.data.statusMessage[0]};
        } else {
            return { success: false, message: 'Status not updated...' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
let getEventDetails = async (params) => {
    try { 
        let Data = [] 
        for (const data of params.attach) {
            var getdata = {
                url: process.env.MONGO_URI,
                client: "attaches",
                docType: 1,
                query: [
                    {
                        "$addFields": {"test": { "$toString": "$_id" }} 
                    },
                    {
                        "$match": {"test":data}
                    },
                    {
                        "$project":{"id":"$_id","filename":"$filename","mimetype":"$mimetype",_id:0}
                    }
                ]
            };
            let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
            if(responseData && responseData.data && responseData.data.statusMessage) {
                Data.push(responseData.data.statusMessage[0])
            } else {
                return { success: false, message: 'data  not found...' };
            }
        }
        if (Data){
            return { success: true, message: Data };
        } else {
            return { success: false, message: 'data  not found...' };
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
    getSessions,
    updateRecord,
    getRecord,
    getEventDetails
}