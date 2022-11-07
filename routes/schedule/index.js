const sharedService = require("../schedule/sharedService");
module.exports = function (params) {
    var app = params.app;
    app.post("/api/chat/:userId", async (req,res) => {
        "use strict";
        try{
            if(req && req.body){
                let result = await sharedService.getCandidateMessageSend(req);
                    if (result && result.success) {
                        app.logger.info({ success: true, message: result.message });
                        app.http.customResponse(res, result.message, 200);
                    } else {
                        app.logger.info({ success: false, message: result.message });
                        app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                    }
                }else{
                    app.http.customResponse(res,{success:false,message:'requset body error'}, 200);
                } 
        }catch{
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.get("/api/blank", async (req,res) => {
        "use strict";
        try{
            if(req && req.query){
                let result = await sharedService.getMessageTemplates(req.query);
                    if (result && result.success) {
                        app.logger.info({ success: true, message: result.message });
                        app.http.customResponse(res, result.message, 200);
                    } else {
                        app.logger.info({ success: false, message: result.message });
                        app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                    }
                }else{
                    app.http.customResponse(res,{success:false,message:'requset query error'}, 200);
                } 
        }catch{
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
};