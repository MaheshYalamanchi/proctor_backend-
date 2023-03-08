const sharedService = require("../schedule/sharedService");
let socketService=require('../shared/socketService');
var Minio = require("minio");
const tokenService = require('../../routes/proctorToken/tokenService');
const schedule_Service = require('../schedule/schedule.Service');
var minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: 443,
    // secure: false,
    useSSL : true,
    accessKey: process.env.MINIO_ACCESSKEY,
    secretKey: process.env.MINIO_SECRETKEY
});
module.exports = function (params) {
    var app = params.app;
    app.post("/api/chat/:roomId", async (req, res) => {
        "use strict";
        try {
            if (req && req.body && req.body.type && req.body.type== 'message') {
                let result = await sharedService.getCandidateMessageSend(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                    //await socketService.messageTrigger(result.message)
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if(req && req.body && req.body.type && req.body.type == 'face') {
                let result = await schedule_Service.getCandidateFcaeSend(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                    //await socketService.messageTrigger(result.message)
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else if(req && req.body && req.body.type && req.body.type == 'event') {
                let result = await schedule_Service.getCandidateEventSend(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                    //await socketService.messageTrigger(result.message)
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }
            else {
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
    app.get("/api/blank", async (req, res) => {
        "use strict";
        try {
            if (req.query.limit && req.query.filter) {
                let result = await sharedService.getMessageTemplates(req.query);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            } else if (req.query.limit) {
                let result = await sharedService.MessageTemplates(req.query);
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
    app.get("/api/getNewChatMessagesV2", async (req, res) => {
        "use strict";
        try {
            let result = await sharedService.getNewChatMessagesV2(req.query);
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
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.get('/api/storage/:imageId', (req, res) => {
        let data;
		minioClient.getObject('storage', req.params.imageId, function(err, objStream) {
			if (err) {
				return console.log(err)
			}
			objStream.on('data', function(chunk) {
				data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk]);
			})
			objStream.on('end', function() {
				res.writeHead(200, {'Content-Type': 'image/jpeg'});
				res.write(data);
				res.end();
			})
			objStream.on('error', function(err) {
				res.status(500);
                console.log(err)
				res.send(err);
			})
		});
    });
    app.post('/api/storage/face', async (req, res,next) => {
        try {
            if(req.body){
                let result = await sharedService.getFaceResponse(req.body);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
                app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
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
    app.post('/api/storage', async (req, res,next) => {
        try {
            if(req.body){
                let result = await sharedService.attachmentPostCall(req.body);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
                app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
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
    app.post('/api/generateProctorToken', async (req, res,next) => {
        try {
            if(req.body){
                let result = await tokenService.generateToken(req.body);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result });
                    app.http.customResponse(res, result, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
                app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
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
    app.post('/api/auth/jwt', async (req, res,next) => {
        try {
            console.log(JSON.stringify(req.body))
            if(req.body && req.body.authorization){
                let result = await sharedService.tokenValidation(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
                app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
            }
        } catch (error) {
            console.log(error)
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.post('/api/room/next', async (req, res,next) => {
        try {
            if(req.body){
                let result = await sharedService.getDatails(req);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
                app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
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
    app.post('/api/storage/passport', async (req, res,next) => {
        try {
            if(req.body){
                let result = await sharedService.getPassportPhotoResponse(req.body);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
                app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
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
    app.post('/api/room/start', async (req, res,next) => {
        try {
            if(req && req.query){
                let result = await sharedService.getCandidateDetails(req.query);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
                app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
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
    app.post('/api/room/stop', async (req, res,next) => {
        try {
            if(req && req.query){
                let result = await sharedService.getCandidateDetailsStop(req.query);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
                app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
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
    app.post('/api/chat/:roomId/:chatId', async (req, res,next) => {
        try {
            let result = await schedule_Service.getChatDetails(req);
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
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
};