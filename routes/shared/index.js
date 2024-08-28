let scheduleSevice = require("../shared/scheduleService");
let service = require("../shared/schedule.service");
let schedule = require("../shared/shared");
const { Validator } = require('node-input-validator');
const auth = require('../auth/auth');
const globalMsg = require('../../configuration/messages/message');
const _ = require("lodash");
module.exports = function (params) {
    var app = params.app;
    app.get("/api/user", async (req, res) => {
        "use strict";
        try {
            if (req.query && req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort ) {
                let result = await scheduleSevice.UserSearchCall(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if(req.query && req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue) {
                let result = await scheduleSevice.UserSearchCall(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if (req && req.query && req.query.filter) {
                let result = await scheduleSevice.UserSearchCall(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if (req.query && req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort) {
                let result = await scheduleSevice.UserLimitCall(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if (req.query && req.query.limit && req.query.start && req.query.count && req.query.continue) {
                let result = await scheduleSevice.UserLimitCall(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if (req && req.query && req.query.limit) {
                let result = await scheduleSevice.UserLimitCall(req);
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
                app.http.customResponse(res, { success: false, message: error.message }, 400)
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400)
            }
        }
    });
    app.put("/api/user/:userId", async (req, res) => {
        "use strict";
        try {
            if (req && req.body) {
                let result = await scheduleSevice.UserEdit(req.body);
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
    app.post("/api/user", async (req, res) => {
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
        } catch (error) {
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400)
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400)
            }
        }
    });
    app.delete("/api/user/:UserId", async (req, res) => {
        "use strict";
        try {
            req.params.authorization = req.query.authorization;
            let result = await scheduleSevice.proctorUserDeleteCall(req.params)
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, { success: true, message: result.message }, 200);
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
    app.get("/api/getCandidateMessageCount", async (req, res) => {
        "use strict";
        try {
            if (req && req.query) {
                let result = await scheduleSevice.getCandidateMessageCount(req.query);
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
    app.get("/api/chat/:roomId", async (req, res) => {
        "use strict";
        try {
            if (req.query.limit && req.query.count && req.query.filter && req.query.filter.type || req.query.filter && req.query.filter.type ||req.query.limit && req.query.skip && req.query.filter && req.query.filter.type) {
                let result = await service.getCandidateMessages(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                   
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if (req.query && req.query.sort && req.query.sort.id) {
                let result = await service.getCandidateMessagesDetails(req);
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
            console.log("chat fetch Error Token========>>>>",JSON.stringify(req.headers.authorization))
            console.log(error,"chat fetch error=======>>>>>>>>")
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    }); 
    app.post("/api/room/submit", async (req, res) => {
        "use strict";
        try {
            let result = await service.SubmitSaveCall(req)
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
    app.get("/api/jobs", async (A, B) => {
        "use strict";
        try {
            if (A && A.headers) {
                let result = await scheduleSevice.fetchjobs(A);
                if (result && result.success) {
                    B.json(
                        result.message.map(function (A) {
                            let B = A.attrs;
                            return (B.id = B._id), delete B._id, B;
                        }))
                   // app.logger.info({ success: true, message: result.message });
                   // app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(A, { success: false, message: 'Data Not Found' }, 200);
                }
            } else {
                app.http.customResponse(A, { success: false, message: 'requset body error' }, 200);
            }
        } catch (error) {
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(A, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(A, { success: false, message: error }, 400);
            }
        }
    });
    app.get("/api/sessions", async (req, res) => {
        "use strict";
        try {
            let result = await schedule.getSessions(req)
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, result.message, 200);
            } else {
                app.logger.info({ success: false, message: result.message });
                app.http.customResponse(res, { success: false, message: result.message }, 200);
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
    app.post("/api/auth/qrcode", async (req, res) => {
        "use strict";
        try {
            if (req && req.body){
                let result = await schedule.getQRcode(req.body)
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: result.message }, 200);
                }
            } else {
                app.http.customResponse(res, "request body is missing" , 200);
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
    app.post("/api/Paused", async (req, res) => {
        "use strict";
        try {
            if (req && req.body) {
                let result = await schedule.roomstatusUpdate(req.body);
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
    app.put("/api/room/timeoutupdate/:roomId", async (req, res) => {
        "use strict";
        try {
            if (req ) {
                let result = await schedule.timeoutupdate(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, {success: true, message: result.message}, 200);
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
}