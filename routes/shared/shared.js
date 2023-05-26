const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
var qrcode = require("qrcode");
const jwt_decode = require('jwt-decode');

let getSessions = async (params) => {
    try {
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 1,
            query: {
                filter:{ complete: { $ne: !0 }, status: "started", updatedAt: { $lt: new Date(Date.now() - 12e4) } },
                update:{$set:{ status: "paused"}}
            }   
        };
        let responseData = await invoke.makeHttpCall("post", "updatedataMany", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage.nModified>0) {
            let closeconnection = await invoke.makeHttpCall("get", "closeconnection");
            return { success: true, message: 'Status updated successfully...' };
        } else {
            let closeconnection = await invoke.makeHttpCall("get", "closeconnection");
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
            url:process.env.MONGO_URI, 
            database:"proctor",
            model: "rooms",
            docType: 0,
            query: {
                filter:{_id:params._id},
                update:{$set:{ updatedAt: updatedAt}}
            }   
        };
        let responseData = await invoke.makeHttpCall("post", "update", getdata);
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
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "rooms",
            docType: 1,
            query: [
                {$match:{_id:params.room}}
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
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
let getChatDetails = async (params) => {
    try { 
        let Data = [] 
        for (const data of params.attach) {
            var getdata = {
                url:process.env.MONGO_URI,
                database:"proctor",
                model: "attaches",
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
let getQRcode = async (params) => {
    try { 
        const header = params.authorization.split(" ");
        const authorization = header[1];
        let decodeToken = jwt_decode(params.authorization)
        if(decodeToken){
            let origin = params.body.origin || "";
            let redirect = params.body.redirect || "";
            let token = authorization;
            let exp = new Date(1e3 * decodeToken.exp);
            let data = `${origin}/?token=${token}&redirect=${redirect}`;
            let response = await qrcodeData(data)
            if (response && response.success){
                return { success: true, message: { expires: exp, token: token, url: data, qrcode: response.message } };
            } else {
                return { success: false, message: 'data  not found...' };
            }
        } else {
            return { success: false, message: 'decode token error' };
        }
    } catch (error) {
        if (error && error.code == 'ECONNREFUSED') {
            return { success: false, message: globalMsg[0].MSG000, status: globalMsg[0].status }
        } else {
            return { success: false, message: error }
        }
    }
};
function qrcodeData(data) {
    return new Promise((resolve, reject) => {
  
        try {
            qrcode.toDataURL(data, { margin: 0 }, function (A, w) {
                if (!w) {
                    resolve({ success: false, message: A })
                } else{
                    resolve({ success: true, message: w })
                }
            });
        } catch (error) {
            console.log(error)
            reject({ success: false, message: error })
        }
  
 })
};
let getViolated = async (params) => {
    try {  
        var getdata = {
            url:process.env.MONGO_URI,
            database:"proctor",
            model: "chats",
            docType: 1,
            query: [
                {
                    $match: { room:params.id ,"metadata.violated" : true}
                },
                {   $project:{attach:1}
                },
                {   $unwind: { path: "$attach", preserveNullAndEmptyArrays: true } 
                },
                {
                    $lookup: {
                        from: 'attaches',
                        localField: 'attach',
                        foreignField: '_id',
                        as: 'data',
                    }
                },
                {   $unwind: { path: "$data", preserveNullAndEmptyArrays: true } },
                {
                    $project  :{data:1}
                },
                {
                    $match:{"data.filename":"screen.jpg"}
                },
                {
                    $project:{id:"$data._id",filename:"$data.filename",createdAt:"$data.createdAt",_id:0}
                }
        ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage) {
            return { success: true, message: responseData.data.statusMessage};
        } else {
            return { success: false, message: 'data not found...' };
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
    getChatDetails,
    getQRcode,
    getViolated
}