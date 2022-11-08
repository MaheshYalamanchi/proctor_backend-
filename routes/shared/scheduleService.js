const invoke = require("../../lib/http/invoke");
const schedule = require("../auth/sehedule");
const globalMsg = require('../../configuration/messages/message');
let proctorRoomUserEdit = async(params) =>{
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 0,
            query: params
        };
        let response = await invoke.makeHttpCall("post", "write", getdata);
        if(response && response.data && response.data.iid){
            let responseData = await schedule.roomUserEdit(response.data.iid);
            if(responseData && responseData.data && responseData.data.statusMessage){
                return{success:true,message:responseData.data.statusMessage[0]};
            }else{
                return {success:false, message : 'Data Not Found'};
            }
        }else{
            return {success:false, message : 'Data Not Found'}
        }
    }catch{
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let proctorDeleteSaveCall = async (params) => {
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query:{
                _id:params.UserId
            } 
        };
        let responseData = await invoke.makeHttpCall("post", "readData", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage){
            let response =await schedule.roomUserDelete(responseData.data.statusMessage[0]);
        }
        if(responseData && responseData.data){
            responseData.data.statusMessage[0].id=responseData.data.statusMessage[0]._id;
            delete responseData.data.statusMessage[0]._id;
            return {success:true,message:responseData.data.statusMessage[0]}
        }else{
            return {success:false, message : 'Data Not Found'}  
        }
    }catch{
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let UserLimitCall = async (params) => {
    var sort;
    if(params.query&&params.query.sort&&params.query.sort.nickname){
        if(params.query.sort.nickname=='desc'){
            sort=-1;
        }else if(params.query.sort.nickname=='asc'){
            sort=1;
        }
    }
    var limit = parseInt(params.query.limit);
    var start= parseInt(params.query.start);
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query:[
                {
                    $project:{rep:0}
                },
                {
                 $facet: 
                        {
                            "data": [
                                        {$sort: { nickname: sort }}, 
                                        { "$skip": start }, 
                                        { "$limit": limit }
                                    ],
                            "total_count":  [
                                                { $group: { _id: null, count:{ $sum: 1 }}},
                                                { $project: { _id: 0 } }
                                            ]
                        }
                },
            ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage.length>0){
            return{success:true,message:{data:responseData.data.statusMessage[0].data,pos:start,total_count:responseData.data.statusMessage[0].total_count[0].count}}
        }else{
            return {success:false, message : 'Data Not Found'}
        }
    }catch{
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let UserSearchCall = async (params) => {
    var sort;
    if(params.query&&params.query.sort&&params.query.sort.nickname){
        if(params.query.sort.nickname=='desc'){
            sort=-1;
        }else if(params.query.sort.nickname=='asc'){
            sort=1;
        }
    }
    var limit = parseInt(params.query.limit);
    var start= parseInt(params.query.start);
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query:[
                    {
                        $match:{
                            $or:[
                                {nickname:{$regex:params.query.filter, $options:'i'}},
                                {role:{$regex:params.query.filter, $options:'i'}},
                                {_id:{$regex:params.query.filter, $options:'i'}},
                                {loggedAt:{$regex:params.query.filter, $options:'i'}}
                            ]
                        }
                    },
                    {$project:{rep:0}},
                    {
                    $facet: 
                            {
                                "data": [
                                        {"$sort": { nickname: sort }}, 
                                        { "$skip": start }, 
                                        { "$limit": limit }
                                ],
                                "poc":[
                                        { $group: { _id: null, count:{ $sum: 1 }}},
                                        { $project: { _id: 0 } }
                                ]
                            }
                    },
                 ]
        };
        let responseData = await invoke.makeHttpCall("post", "aggregate", getdata);
        if(responseData && responseData.data){
            return{success:true,message:{data:responseData.data.statusMessage[0].data,pos:start,total_count:responseData.data.statusMessage[0].poc[0].count}};
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
let UserEdit = async(params) =>{
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 0,
            query: params
        };
        let response = await invoke.makeHttpCall("post", "write", getdata);
        if(response && response.data && response.data.iid){
            let responseData = await schedule.userEdit(response.data.iid);
            if(responseData && responseData.data && responseData.data.statusMessage){
                return{success:true,message:responseData.data.statusMessage[0]};
            }else{
                return {success:false, message : 'Data Not Found'};
            }
        }else{
            return {success:false, message : 'Data Not Found'}
        }
    }catch{
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let proctorUserSaveCall = async (params) => {
    try{
        params.createdAt=new Date()
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 0,
            query: params
        };
        
        let responseData = await invoke.makeHttpCall("post", "write", getdata);
        if(responseData && responseData.data&&responseData.data.iid){
            let getData = await schedule.UserSave(responseData.data.iid);
            if(getData && getData.data && getData.data.statusMessage){
                getData.data.statusMessage[0].id=getData.data.statusMessage[0]._id;
                delete getData.data.statusMessage[0]._id;
                return {success:true,message:getData.data.statusMessage[0]}
            }else{
                return {success:false, message : 'Data Not Found'}  
            }
        }else{
            return {success:false, message : 'Data Not Found'}   
        }
    }catch(error){
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let proctorUserDeleteCall = async (params) => {
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "users",
            docType: 1,
            query:{
                _id:params.UserId
            } 
        };
        let responseData = await invoke.makeHttpCall("post", "readData", getdata);
        if(responseData && responseData.data && responseData.data.statusMessage){
            let response = await schedule.UserDelete(responseData.data.statusMessage[0]);
        }
        if(responseData && responseData.data){
            responseData.data.statusMessage[0].id=responseData.data.statusMessage[0]._id;
            delete responseData.data.statusMessage[0]._id;
            return {success:true,message:responseData.data.statusMessage[0]}
        }else{
            return {success:false, message : 'Data Not Found'}  
        }
    }catch{
        if(error && error.code=='ECONNREFUSED'){
            return {success:false, message:globalMsg[0].MSG000,status:globalMsg[0].status}
        }else{
            return {success:false, message:error}
        }
    }
};
let getCandidateMessageCount = async (params) => {
    try{
        var getdata = {
            url: process.env.MONGO_URI,
            client: "rooms",
            docType: 1,
            query: {
                _id:params.room
            }
        };
        let responseData = await invoke.makeHttpCall("post", "readData", getdata);
        if(responseData && responseData.data){
            return{success:true,message:{}}
        }else{
            return {success:false, message : 'Data Not Found'}
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
    proctorRoomUserEdit,
    proctorDeleteSaveCall,
    UserLimitCall,
    UserSearchCall,
    UserEdit,
    proctorUserSaveCall,
    proctorUserDeleteCall,
    getCandidateMessageCount
}