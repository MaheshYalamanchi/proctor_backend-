var oauthindex = require('./index');
module.exports = function (params, passport) {
    var app = params.app;
    app.all('/oauth/token', oauthindex.obtainToken);

    app.get('/', oauthindex.authenticateRequest, function (req, res) {

        res.send('Congratulations, you are in a secret area!');
    });
}