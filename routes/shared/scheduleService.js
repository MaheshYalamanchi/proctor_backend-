const invoke = require("../../lib/http/invoke");
const schedule = require("../auth/sehedule");
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

module.exports = {
    proctorRoomUserEdit
}