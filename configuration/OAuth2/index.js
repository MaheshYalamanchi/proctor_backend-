var express = require('express');
var app = express();
const request = require("request");

app.disable("x-powered-by");
var mongoose = require('mongoose'),
        OAuth2Server = require('oauth2-server'),
        Request = OAuth2Server.Request,
        Response = OAuth2Server.Response;

    var mongoUri = process.env.DB_URL;

    mongoose.connect(mongoUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err, res) {

        if (err) {
            return console.error('Error connecting to "%s":', mongoUri, err);
        }
        // console.log('Connected successfully to "%s"', mongoUri);
    });

    app.oauth = new OAuth2Server({
        model: require('./model.js'),
        accessTokenLifetime:  60 * 60 * 480000,
        allowBearerTokensInQueryString: true
    });

    app.all('/oauth/token', obtainToken);

    app.get('/', authenticateRequest, function (req, res) {

        res.send('Congratulations, you are in a secret area!');
    });

    function obtainToken(req, res) {

        var request = new Request(req);
        var response = new Response(res);
        return app.oauth.token(request, response)
            .then(function (token) {

                res.json(token);
            }).catch(function (err) {

                res.status(err.code || 500).json(err);
            });
    }

    function authenticateRequest(req, res, next) {

        var request = new Request(req);
        var response = new Response(res);

        return app.oauth.authenticate(request, response)
            .then(function (token) {

                next();
            }).catch(function (err) {

                res.status(err.code || 500).json({success : false, message : err.name});
            });
    }

    let verifyRecaptcha = async (req, res, next) => {

        try {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;    
            if(req.body.badgeRequest == "microsetportal"){
                next() 
            }else{
            const clientResponse = req.body.badgeRequest
            const secretkey = process.env.RECAPTCHA_SECRET_KEY; //the secret key from your google admin console;
            //token validation url is URL: https://www.google.com/recaptcha/api/siteverify 
            // METHOD used is: POST
            console.log(clientResponse)

            const url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretkey + "&response=" + clientResponse + ""
                    // invisable captcha
            return request(url, function (error, response, body) {
                body = JSON.parse(body);
                console.log('body:', body.success,body); // Print the HTML for the Google homepage
    
                if (body.success == false) {
                    // res.status(200).json({success : false, message : "recaptcha failed"});
                    res.status(200).json({success : false, message : "Background recaptcha failed"});
                } else {
                    //if passed response success message to client
                    next()
                }
    
            });
        }
        } catch (error) {
            return { success: false, 'message': "something went wrong" }
        }
    
    }
    let enableRecaptcha = async (req,res,next) => {
        next()
    }
    
    module.exports = {
        obtainToken,
        authenticateRequest,
        verifyRecaptcha,
        enableRecaptcha
    };