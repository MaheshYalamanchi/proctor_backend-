const invoke = require("../../lib/http/invoke");
let getcount = async(params) =>{
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
};

module.exports = {
    getcount,
}