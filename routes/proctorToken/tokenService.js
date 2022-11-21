var jwt = require('jsonwebtoken');
let generateProctorToken = async (req) => {
    try {
        var secret = 'eime6Daeb2xanienojaefoh4';
        let user = { "provider": req.data.statusMessage[0].role, "username": req.data.statusMessage[0]._id }
        let tokenArg = {
            id: user.username,
            role: user.provider
        };
        user.proctorToken = jwt.sign(tokenArg, secret, { expiresIn: 5400000 });
        if (user.proctorToken) {
            return user.proctorToken;
        } else {
            return 'Error While Generating Token!';
        }
    } catch (err) {
        return err;
    }
};
let ProctorTokenGeneration = async (req) => {
    try {
        var secret = 'eime6Daeb2xanienojaefoh4';
        let user = { "id": req.statusMessage[0]._id, "provider": req.statusMessage[0].provider, "role": req.statusMessage[0].role };
        let tokenArg = {
            id: user.id,
            provider: user.provider,
            role: user.role
        };
        user.proctorToken = jwt.sign(tokenArg, secret, { expiresIn: 5400000 });
        if (user.proctorToken) {
            return user.proctorToken;
        } else {
            return 'Error While Generating Token!';
        }
    } catch {

    }
};
module.exports = {
    generateProctorToken,
    ProctorTokenGeneration
}