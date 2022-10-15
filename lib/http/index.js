module.exports = function () {
    return {
        reqProcessor: require("./request.js"),
        resProcessor: require("./response.js"),
        httpRequestor: require("./invoke.js")
    }
};