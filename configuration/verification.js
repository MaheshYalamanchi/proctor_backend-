const invoke = require("../lib/http/invoke");
const { Validator } = require('node-input-validator');

let tokenverification = async request => {
    try {
        const validate_schema = new Validator(request, {
            token: 'required|string'
        });
        var result = await validate_schema.check();
        if (!result) {
            return "unauthorized api call";
        }
        else {
            var postdata = {
                url: process.env.DB_URL,
                client: "auth_token",
                docType: 0,
                query: { auth_token: request.token }
            };
            let responsedata = await invoke.makeHttpCall("post", "read", postdata);
            if (responsedata.data.statusMessage != undefined) {
                return true;
            }
            else {
                return "Invalid Token";
            }
        }
    } catch (err) {
        return { status: false };
    }
};

module.exports = {
    tokenverification
};
