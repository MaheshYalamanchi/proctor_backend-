const moment = require('moment');
const jwt = require('jwt-simple');

function encodeToken(user) {
  const playload = {
    exp: moment().add(365, 'days').unix(),
    iat: moment().unix(),
    sub: user._id,
    mobile : user.mmobile,
    user_type : user.user_type,
    user_client : user.client
  };
  //console.log(jwt.encode(playload, "process.env.TOKEN_SECRET"))
  return jwt.encode(playload, "process.env.TOKEN_SECRET");
}

function decodeToken(token, callback) {
  const payload = jwt.decode(token, "process.env.TOKEN_SECRET",true,'HS512');
  //console.log(payload);
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
}

module.exports = {
  encodeToken,
  decodeToken
};
