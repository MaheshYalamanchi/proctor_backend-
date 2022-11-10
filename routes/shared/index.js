let scheduleSevice = require("../shared/scheduleService");
let service = require("../shared/schedule.service");
const { Validator } = require('node-input-validator');
module.exports = function (params) {
    var app = params.app;
    app.get("/api/user",async (req, res) => {
        "use strict";
        if(req && req.query && req.query.filter){
            let result = await scheduleSevice.UserSearchCall(req);
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, result.message, 200);
            } else {
                app.logger.info({ success: false, message: result.message });
                app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
            }
        }else if(req && req.query && req.query.start){
            let result = await scheduleSevice.UserLimitCall(req);
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, result.message, 200);
            } else {
                app.logger.info({ success: false, message: result.message });
                app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
            }
        }
    });
    app.put("/api/user/:userId", async (req,res) => {
        "use strict";
        try{
            if(req && req.body){
                let result = await scheduleSevice.UserEdit(req.body);
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
        }catch(error){
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.post("/api/user",async (req, res) => {
        "use strict";
        try {
            let result = await scheduleSevice.proctorUserSaveCall(req.body)
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, result.message, 200);
            } else {
                app.logger.info({ success: false, message: result.message });
                app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
            }
        }catch{
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400)
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400)
            }
        }
    });
    app.delete("/api/user/:UserId",async (req, res) => {
        "use strict";
        try {
            let result = await scheduleSevice.proctorUserDeleteCall(req.params)
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, result.message, 200);
            } else {
                app.logger.info({ success: false, message: result.message });
                app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
            }
        }catch(error){
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400)
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400)
            }
        }
    });
    app.get("/api/getCandidateMessageCount", async (req,res) => {
        "use strict";
        try{
            if(req && req.query){
                let result = await scheduleSevice.getCandidateMessageCount(req.query);
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
        }catch(error){
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.get("/api/chat/:userId", async (req,res) => {
        "use strict";
        try{
            if(req && req.query){
                let result = await service.getCandidateMessages(req);
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
        }catch(error){
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });  
}