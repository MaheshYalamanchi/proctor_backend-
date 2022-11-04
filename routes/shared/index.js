let scheduleSevice = require("../shared/scheduleService");
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
        }catch{
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    }); 
}