const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', '/crypto/id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf-8');

// const PRIV_KEY = process.env.PRIVATE_KEY;





function validPassword(password, hash, salt) {
    var hashVerify = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    return hash === hashVerify;
  }

function genPassword(password) {
var salt = crypto.randomBytes(32).toString("hex");
var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

return {
    salt: salt,
    hash: genHash,
};
}

const issueJWT = (user) => {
    const id = user.id;
    const expiresIn = '1d';

    const payload = {
        sub: id,
        iat: Date.now(),
    }

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn,
        algorithm: "RS256",
    })

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn,
    }
}


  module.exports = {
    genPassword, 
    validPassword,
    issueJWT
  }