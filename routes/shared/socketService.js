const invoke = require("../../lib/http/invoke");

let messageTrigger = async (params) => {
    try {
        jsonData = {
            "id": "socket:emit",
            "room": "c7663e39-3c31-4441-aeb7-cbe587c383a3",
            "event": "chat:message",
            "data": params
        }
        let responseData = await invoke.makeHttpCallSocket("post", "message", jsonData);
        if (responseData && responseData.data) {
            return {success:true,message:"message sent to socket"}
        } else {

        }
    } catch (error) {
        throw error
    }
}

module.exports={
    messageTrigger
}