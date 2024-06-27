const sharedService = require("../schedule/sharedService");
let socketService=require('../shared/socketService');
var Minio = require("minio");
const tokenService = require('../../routes/proctorToken/tokenService');
const schedule_Service = require('../schedule/schedule.Service');
const schedule = require('./schedule');
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
                    app.logger.info({ success: true, message: result.message.data });
                    app.http.customResponse(res, result.message.data, 200);
                    let score = await schedule.updateScore(result.message.json)
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
            console.log(error,"face1====>>>>")
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.post('/api/storage/face1', async (req, res,next) => {
        try {
            if(req.body){
                let result = await sharedService.getFaceResponse1(req.body);
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
            console.log(error,"face3====>>>>")
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
                    // console.log(result,'result')
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
    // app.post('/api/generateProctorToken', async (req, res,next) => {
    //     try {
    //         if(req.body){
    //             let result = await tokenService.generateToken(req.body);
    //             if (result && result.success) {
    //                 app.logger.info({ success: true, message: result });
    //                 app.http.customResponse(res, result, 200);
    //             } else {
    //                 app.logger.info({ success: false, message: result.message });
    //                 app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
    //             }
    //         }else{
    //             app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
    //         }
    //     } catch (error) {
    //         console.log(err,"geenrateToken1===>>>>")
    //         app.logger.error({ success: false, message: error });
    //         if (error && error.message) {
    //             app.http.customResponse(res, { success: false, message: error.message }, 400);
    //         } else {
    //             app.http.customResponse(res, { success: false, message: error }, 400);
    //         }
    //     }
    // });
    app.post('/api/generateProctorToken1', async (req, res,next) => {
        try {
            if(req.body){
                let result = await tokenService.generateToken1(req.body);
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
    // app.post('/api/auth/jwt', async (req, res,next) => {
    //     try {
    //         console.log('jwtapicall')
    //         if(req.body && req.body.authorization){
    //             let result = await sharedService.tokenValidation(req);
    //             if (result && result.success) {
    //                 app.logger.info({ success: true, message: result.message });
    //                 app.http.customResponse(res, result.message, 200);
    //             } else {
    //                 app.logger.info({ success: false, message: result.message });
    //                 app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
    //             }
    //         }else{
    //             app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
    //         }
    //     } catch (error) {
    //         console.log('jwtapicallfailedapi')
    //         console.log(error,"jwtError1===>>>>")
    //         app.logger.error({ success: false, message: error });
    //         if (error && error.message) {
    //             app.http.customResponse(res, { success: false, message: error.message }, 400);
    //         } else {
    //             app.http.customResponse(res, { success: false, message: error }, 400);
    //         }
    //     }
    // });
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
    app.post('/api/storage/passport1', async (req, res,next) => {
        try {
            if(req.body){
                let result = await sharedService.getPassportPhotoResponse1(req.body);
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
            console.log(error,"passport1====>>>>")
            app.logger.error({ success: false, message: error });
            if (error && error.message) {
                app.http.customResponse(res, { success: false, message: error.message }, 400);
            } else {
                app.http.customResponse(res, { success: false, message: error }, 400);
            }
        }
    });
    app.post('/api/storage/passport2', async (req, res,next) => {
        try {
            if(req.body){
                let result = await sharedService.getPassportPhotoResponse2(req.body);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
                app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
            }
        } catch (error) {
            console.log(error,"passport3====>>>>")
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
            let result = await sharedService.getCandidateDetails(req);
            if (result && result.success) {
                app.logger.info({ success: true, message: result.message });
                app.http.customResponse(res, result.message, 200);
            } else {
                app.logger.info({ success: false, message: result.message });
                app.http.customResponse(res, { success: false, message: 'Data Not Found1' }, 200);
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
                req.query.body = req.headers.authorization;
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
    app.post('/api/broadcast/sendToAll', async (req, res,next) => {
        try {
            if(req && req.body){
                let result = await schedule_Service.broadcastMesssage(req.body);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
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
    app.get('/api/verifymobile/:bearer', async (req, res,next) => {
        try {
            if(req.params){
                let result = await sharedService.mobilecheck(req.params);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
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
    app.get('/api/headphone/:bearer', async (req, res,next) => {
        try {
            if(req.params){
                let result = await sharedService.headphonecheck(req.params);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
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
    app.post('/api/stop/:id', async (req, res,next) => {
        try {
            if(req.body ){
                req.params.body = req.body;
                let result = await sharedService.stoppedAt(req.params);
                if (result && result.success) {
                    app.logger.info({ success: true, message: result.message });
                    app.http.customResponse(res, result.message, 200);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
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
    app.post('/updatephotostatus',async(req,res)=>{
        try {
            if(req.body.id){
                let updatePhotoStatus=await sharedService.updatePhotoStatus(req.body)
                app.http.customResponse(res, updatePhotoStatus, 200);
            }else{
                app.http.customResponse(res, { success: false, message: 'provide correct request' }, 200);
            }
            
        } catch (error) {
            app.http.customResponse(res, { success: false, message: error }, 400);
        }
    })
    app.post('/approvecandidate',async(req,res)=>{
        try {
            if(req.body.roomid&&req.body.status){
                let approvalProcess=await sharedService.approvalProcess(req.body)
                let fetchuserwithroom=await sharedService.fetchuserwithroom(req.body)
                console.log(fetchuserwithroom,'fetch before')
                var jsonData={
                    id: fetchuserwithroom.message[0]?.student,
                    browser: { name: fetchuserwithroom.message[0].browser.name, version:fetchuserwithroom.message[0].browser.version },
                    createdAt: fetchuserwithroom.message[0].createdAt,
                    exclude: [],
                    face: fetchuserwithroom.message[0].face,
                    passport: fetchuserwithroom.message[0].passport,
                    labels: [],
                    loggedAt:fetchuserwithroom.message[0].loggedAt,
                    nickname: fetchuserwithroom.message[0].email,
                    os: { name: fetchuserwithroom.message[0].os.name, version:fetchuserwithroom.message[0].version, versionName: 'NT 10.0' },
                    platform: { type: 'desktop' },
                    provider: 'jwt',
                    referer: 'https://lntproctordev.lntedutech.com/test_2.html?userToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6InN0ZXBjaGVjazExMDE4QGRpc3Bvc3RhYmxlLmNvbSIsImlkIjoiMjhkMDNkYTAtNzQ0YS00OTI5LTlkOGItNDg3Zjg3NzU1MzE1IiwidGFncyI6WyJzdGVwY2hlY2sxMTAxOEBkaXNwb3N0YWJsZS5jb20iLCI1ODcyNDgyNDI0Nzk5MiIsIjQ4NTgyNzU0OTgxMiJdLCJ1c2VybmFtZSI6InN0ZXBjaGVjazExMDE4QGRpc3Bvc3RhYmxlLmNvbSIsInRlbXBsYXRlIjoiZGVmYXVsdCIsInN1YmplY3QiOiJTdGVwIHByb2N0b3IgY2hlY2sgOCIsInRpbWVvdXQiOiI2OTAiLCJpYXQiOjE3MTk0Nzc4MTcsImV4cCI6MTcyNDg3NzgxN30.f2qYdLCVMUX3ygyUbErW7CXBC_Azbk5CBnXnSJVagvU',
                    role: 'student',
                    similar: [],
                    useragent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                    username: fetchuserwithroom.message[0].student
                    
                  }
                  console.log(jsonData,'jsondata after')
                app.http.customResponse(res, {success:true,student:jsonData,members:fetchuserwithroom.message[0].member}, 200);
            }else{
                app.http.customResponse(res, { success: false, message: 'provide correct request' }, 200);
            }
            
        } catch (error) {
            console.log(error)
            app.http.customResponse(res, { success: false, message: error }, 400);
        }
    })
    app.post('/fetchuserwithroom',async(req,res)=>{
        try {
            if(req.body.roomid){
                let fetchuserwithroom=await sharedService.fetchuserwithroom(req.body)
                app.http.customResponse(res, fetchuserwithroom, 200);
            }else{
                app.http.customResponse(res, { success: false, message: 'provide correct request' }, 200);
            }
            
        } catch (error) {
            app.http.customResponse(res, { success: false, message: error }, 400);
        }
    })
};