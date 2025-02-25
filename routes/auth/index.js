const sharedSevices = require("../shared/sharedService");
const scheduleSevice = require("../shared/scheduleService");
const shared = require("../schedule/sharedService")
const { Validator } = require('node-input-validator')
const auth = require('../auth/auth');
const globalMsg = require('../../configuration/messages/message');
const schedule = require("../schedule/sharedService")
module.exports = function (params) {
    var app = params.app;
    app.post("/api/auth/login", async (req, res) => {
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
            } else {
                let result = await sharedSevices.proctorLoginCall(req.body)
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
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
    app.post("/api/user/me", async (req, res) => {
        "use strict";
        try {
            let result = await sharedSevices.proctorMeCall(req.body)
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, result.message, 200);
            } else {
                app.logger.info({ success: false, message: result.message });
                app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
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
    app.post("/api/room/fetch", async (req, res) => {
        "use strict";
        try {
            let result = await sharedSevices.proctorFetchCall(req.body)
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, result.message, 200);
            } else {
                app.logger.info({ success: false, message: result.message });
                app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
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
    app.post("/api/auth", async (req, res) => {
        "use strict";
        try {
            let result = await sharedSevices.proctorAuthCall(req.body)
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, result.message, 200);
            } else {
                app.logger.info({ success: false, message: result.message });
                app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
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
    app.get("/api/room", async (req, res) => {
        "use strict";
        try {
            if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.subject) {
                let result = await sharedSevices.proctorSearchCall(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue) {
                let result = await sharedSevices.proctorSearchCall(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if (req.query.limit && req.query.filter) {
                let result = await sharedSevices.proctorSearchCall(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort && req.query.sort.subject) {
                let result = await sharedSevices.proctorLimitCall(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if (req && req.query && req.query.limit || req.query.limit && req.query.start && req.query.count && req.query.continue) {
                let result = await sharedSevices.proctorLimitCall(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            };
        } catch (error) {
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.get("/api/suggest/users", async (req, res) => {

        "use strict";
        try {
            let result = await sharedSevices.proctorSuggestCall(req)
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, result.message, 200);
            } else {
                app.logger.info({ success: false, message: result.message });
                app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
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
    app.get("/api/user/:username", async (req, res) => {
        "use strict";
        try {
            const validateSchema = new Validator(req.params, {
                username: 'required'
            });
            var validateSchemaResponse = await validateSchema.check()
            if (!validateSchemaResponse) {
                app.logger.info({ success: false, message: validateSchema.errors });
                app.http.customResponse(res, { success: false, message: validateSchema.errors }, 200);
            } else {
                let result = await sharedSevices.proctorUserDetailsCall(req.params);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }
        } catch (error) {
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.get("/api/auth/token", async (req, res) => {
        "use strict";
        try {
            const validateSchema = new Validator(req.query, {
                id: 'required'
            });
            var validateSchemaResponse = await validateSchema.check()
            if (!validateSchemaResponse) {
                app.logger.info({ success: false, message: validateSchema.errors });
                app.http.customResponse(res, { success: false, message: validateSchema.errors }, 200);
            } else {
                let result = await sharedSevices.proctorUserInfoCall(req.query);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }
        } catch (error) {
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.get("/api/room/:userId", async (req, res) => {
        "use strict";
        try {
            if (req.params.userId && req.query.populate && req.query.populate[0] && req.query.populate[1]) {
                const validateSchema = new Validator(req.params, {
                    userId: 'required'
                });
                var validateSchemaResponse = await validateSchema.check()
                if (!validateSchemaResponse) {
                    app.logger.info({ success: false, message: validateSchema.errors });
                    app.http.customResponse(res, { success: false, message: validateSchema.errors }, 200);
                } else {
                    let result = await sharedSevices.proctorRoomDetails(req);
                    if (result && result.success) {
                        app.logger.info({ success: true, message: result.message });
                        app.http.customResponse(res, result.message, 200);
                    } else {
                        app.logger.info({ success: false, message: result.message });
                        app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                    }
                }
            } else if (req.params.userId) {
                let result = await shared.roomUserDatails(req.params.userId);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }
        } catch (error) {
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.post("/api/room", async (req, res) => {
        "use strict";
        try {
            let result = await sharedSevices.proctorSuggestSaveCall(req.body)
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
    app.put("/api/room/:userId", async (req, res) => {
        "use strict";
        try {
            if (req && req.body) {
                let result = await scheduleSevice.proctorRoomUserEdit(req.body);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else {
                app.http.customResponse(res, { success: false, message: 'requset body error' }, 200);
            }
        } catch (error) {
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.delete("/api/room/:UserId", async (req, res) => {
        "use strict";
        try {
            let result = await scheduleSevice.proctorDeleteSaveCall(req.params)
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, result.message, 200);
            } else {
                app.logger.info({ success: false, message: result.message });
                app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
            }
        } catch(error) {
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400)
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400)
            }
        }
    });
};