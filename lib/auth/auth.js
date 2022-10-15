const bcrypt = require("bcryptjs");
const util = require("util");
const localAuth = require("./jwt");
const decode = util.promisify(localAuth.decodeToken);
const encode = localAuth.encodeToken

async function createUser(req, res) {
  try {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt);
    let insertData = {
      username: req.body.username,
      user_phone_no: req.body.user_phone_no,
      password: hash
    };

    // Need to insert the above 'insertdata' to champ_user collection
    return response;
  } catch (error) {
    throw error;
  }
}

let getUserToken =  user => {
    let data = encode(user)
    return data ; 
};

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function ensureAuthenticatedAsChamp(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({
      status: "Please log in"
    });
  }
  // decode the token
  const header = req.headers.authorization.split(" ");
  const token = header[1];
  localAuth.decodeToken(token, (err, payload) => {
    if (err) {
      return res.status(401).json({
        status: "Token has expired"
      });
    } else {
      if (payload.user_type != "CHAMP") {
        return res.status(401).json({
          error: "You have been banned from valucart contact support for more."
        });
      }
      return { status: "done" };
    }
  });
}

/**
 * generateOtp funcion for generate a six digit number
 * @param {Integer} max
 */
let generateOtp = (max = 999999, min = 100000) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * parseTokenToGetId function for get the user id from the auth token
 * @param {String} payload
 */
let parseTokenToGetId = async payload => {
  try {
   
    const header = payload.split(" ");
    const token = header[1];
    let decoded = await decode(token);
    return decoded.sub;
  } catch (error) {
    
    throw error;
  }
};




module.exports = {
  createUser,
  getUserToken,
  comparePass,
  ensureAuthenticatedAsChamp,
  generateOtp,
  parseTokenToGetId
};
