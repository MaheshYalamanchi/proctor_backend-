const invoke = require("../../lib/http/invoke");
const globalMsg = require('../../configuration/messages/message');
let getcount = async(params) =>{
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "chats",
            docType: 1,
            query:[
                {
                    "$match":{"room":params.room,
                                "type":{"$regex":params.type, "$options":'i'}
                            }
                },
                { 
                    "$group": { "_id": null, "incidents":{ "$sum": 1 }}
                },
                { 
                    "$project": { "_id": 0 } 
                }
                ] 
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(responseData){
            return responseData;
        }else{
            return "Data Not Found";
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
    getcount,
}