let sharedSevices = require("../../routes/shared/sharedService");
const { Validator } = require('node-input-validator')
module.exports = function (params) {
    var app = params.app;
    app.post("/api/auth/login",async (req, res) => {
            "use strict";
            try {
                const validateSchema = new Validator(req.body, {
                    password: 'required',
                    provider: 'required',
                    username: 'required'
                })
                var validateSchemaResponse = await validateSchema.check()
                if (!validateSchemaResponse) {
                    app.logger.info({ success: false, message: validateSchema.errors });
                    app.http.customResponse(res, { success: false, message: validateSchema.errors }, 200);
                }else {
                    let result = await sharedSevices.proctorLoginCall(req.body)
                    if (result && result.success) {
                        app.logger.info({ success: true, message: result.message });
                        app.http.customResponse(res, result, 200);
                    } else {
                        app.logger.info({ success: false, message: result.message });
                        app.http.customResponse(res, { success: false, message: 'Unauthorized' }, 200);
                    }
                }
            } catch (error) {
                app.logger.error({ success: false, message: error });
                if (error && error.message) {
                    app.http.customResponse(res, { success: false, message: error.message }, 400)
                } else {
                    app.http.customResponse(res, { success: false, message: error }, 400)
                }
            }
        });
};