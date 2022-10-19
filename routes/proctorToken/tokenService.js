var jwt = require('jsonwebtoken');
let generateProctorToken = async (req) => {
    try {
        var secret = 'eime6Daeb2xanienojaefoh4';
        let user = {"provider": req.data.statusMessage[0].role,"username": req.data.statusMessage[0].username}
        let tokenArg = {
            id : user.username,
            role : user.provider
        };
        user.proctorToken = jwt.sign(tokenArg, secret, { expiresIn: 5400000 });
        if (user.proctorToken){
            return  user.proctorToken;
        }else{
            return 'Error While Generating Token!';
        }
    } catch (err) {
        return err;
    }
};
module.exports = {
    generateProctorToken,
}