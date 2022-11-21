const sharedService = require("../schedule/sharedService");
var multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const multipleFileUpload = multer({ storage: inMemoryStorage });
const auth = require('../auth/auth');
const globalMsg = require('../../configuration/messages/message');
var Minio = require("minio");
// var minioClient = new Minio.Client({
//     endPoint: 'https://minioconsoledev.lntedutech.com/',
//     port: 9000,
//     secure: true,
//     accessKey: 'CXVH0A9XJW906PGB4857',
//     secretKey: 'ethcPXfCe8L4rkYhKoJDqwfimC1deCnWojzexl3C'
// });
module.exports = function (params) {
    var app = params.app;
    app.post("/api/chat/:userId", async (req, res) => {
        "use strict";
        try {
            if (req && req.body) {
                let result = await sharedService.getCandidateMessageSend(req);
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
    // app.post("/api/storage", multipleFileUpload.single('upload'), function(request, response) {
    // minioClient.fPutObject("testbucket", request.file.originalname, request.file.path, "application/octet-stream", function(error, etag) {
    //     if(error) {
    //         return console.log(error);
    //     }
    //     response.send(request.file);
    // });
    // });
};