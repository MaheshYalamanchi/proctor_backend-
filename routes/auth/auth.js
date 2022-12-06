const globalMsg = require('../../configuration/messages/message');
var jwt = require('jsonwebtoken');
const secret = "secret"

let verifyToken = async (req, res) => {
    const token = req.authorization.split(" ")
    try {
        if (!token) {
            return { success: false, message: "A token is required for authentication" };
        } else {
            const decoded = jwt.verify(token[1], secret);
            if (decoded) {
                return { success: true, message: "token validated successfully" }
            } else {
                return { success: false, message: 'Data Not Found' };
            }
        }
    } catch (error) {
        if (error) {
            return { success: false, message: "TokenExpiredError" }
        } else {
            return { success: false, message: error }
        }
    }
};

module.exports = {
    verifyToken,
}