const invoke = require("../../lib/http/invoke");
let userDetails = async(params)=>{
    var userdata = {
        url: process.env.MONGO_URI,
        client: "users",
        docType: 1,
        query:[
            {
                $match:{_id:params._id}
            },
            {
                $unwind:"$similar"
            },
            {
                $lookup:{
                            from: 'users',
                            localField: 'similar.user',
                            foreignField: '_id',
                            as: 'data',
                        }
            },
             { $unwind: { path: "$data", preserveNullAndEmptyArrays: true } },
            {
                $project:{
                    _id:0,
                    user:{
                        "id":"$data._id",
                        "face":"$data.face",
                        "nickname":"$data.nickname",
                        "username":"$data._id"    
                    },
                    "distance":"$similar.distance"
                }
            }
        ]
    }
    let responseData = await invoke.makeHttpCall("post", "aggregate",userdata);
    if(responseData){
      return responseData;  
    }else{
        return "Data Not Found";
    }
}
let userEdit = async(params) =>{
    var postdata = {
        url: process.env.MONGO_URI,
        client: "rooms",
        docType: 1,
        query: [
            { 
                $addFields: {test: { $toString: "$_id" }} 
            },
            {
                $match:{test:params}
            },
            {
                $project:{_id:0,test:0}
            }
        ]
    };
    let responseData = await invoke.makeHttpCall("post", "aggregate", postdata);
    if(responseData){
        return responseData;
    }else{
        return "Data Not Found";
    }
}
module.exports ={
    userDetails,
    userEdit
}