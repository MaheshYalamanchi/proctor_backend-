const sharedService = require("../schedule/sharedService");
let socketService=require('../shared/socketService');
var Minio = require("minio");
const tokenService = require('../../routes/proctorToken/tokenService');
const schedule_Service = require('../schedule/schedule.Service');
const schedule = require('./schedule');
const shared = require("../../routes/shared/shared");
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
                    // console.log(result.message,'final msg..............')
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
            console.log("chat Error================>>>>>>"+req.body.type+"", error)
            console.log("chat Body================>>>>>>", JSON.stringify(req.body))
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
            console.log("face Error Body1========>>>>",JSON.stringify(req.body))
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
                    let updatedresponse = await shared.updateRecord(req.body.decodeToken);
                } else {
                    app.logger.info({ success: false, message: result.message });
                    app.http.customResponse(res, { success: false, message: 'Data Not Found' }, 200);
                }
            }else{
                app.http.customResponse(res, { success: false, message: 'authorization error' }, 200);
            }
        } catch (error) {
            console.log("face Error Body4========>>>>",JSON.stringify(req.body))
            console.log(error,"face4====>>>>")
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
            console.log("storage Error================>>>>>>", error)
            console.log("storage Body================>>>>>>", JSON.stringify(req.body))
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
            console.log("next Error Body1========>>>>",JSON.stringify(req.body))
            console.log("next Error1========>>>>",error)
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
            console.log("passport Error Body1========>>>>",JSON.stringify(req.body))
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
            console.log("passport Error Body4========>>>>",JSON.stringify(req.body))
            console.log(error,"passport4====>>>>")
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
            console.log("start Error Body1========>>>>",JSON.stringify(req.body))
            console.log(error,"start1====>>>>")
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
            console.log("chat PUT Error================>>>>>>"+req.body.type+"", error)
            console.log("chat PUT Body================>>>>>>", JSON.stringify(req.body))
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
            console.log("updatephotostatus Error Body1========>>>>",JSON.stringify(req.body))
            console.log(error,"updatephotostatus error1==========>>>>")
            app.http.customResponse(res, { success: false, message: error }, 400);
        }
    })
    app.post('/approvecandidate',async(req,res)=>{
        try {
            if(req.body.roomid&&req.body.status){
                let approvalProcess=await sharedService.approvalProcess(req.body)
                let fetchuserwithroom=await sharedService.fetchuserwithroom(req.body)
                if( fetchuserwithroom && fetchuserwithroom.success){
                    fetchuserwithroom.message[0].rejectLog = fetchuserwithroom.message[0]?.verified?null:req.body.rejectLog;
                    app.http.customResponse(res, {success:true,message:'Candidate approved successfully.',data:{student:fetchuserwithroom.message[0],members:fetchuserwithroom.message[0].member}}, 200);
                } else {
                    app.http.customResponse(res, {success:false,message:'Records fetching error'}, 200);
                }
            }else{
                app.http.customResponse(res, { success: false, message: 'provide correct request' }, 200);
            }
            
        } catch (error) {
            console.log("approvecandidate error body1======>>>>",JSON.stringify(req.body))
            console.log(error,"approvecandidate Error1==========>>>>>>")
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
            console.log("fetchuserwithroom error body =====>>>>>",JSON.stringify(req.body))
            console.log(error,"fetchuserwithroom error ======>>>>>>>>")
            app.http.customResponse(res, { success: false, message: error }, 400);
        }
    })
};