const fs = require('fs');
const path = require('path');

// const pathToKey = path.join(__dirname, '..', '/crypto/id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8');
const PUB_KEY = process.env.PUBLIC_KEY;

//prisma
const prisma = require('./prisma');

//passport
const passport = require('passport');
const session = require('express-session');

//Jwt Strat
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//Options
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
};

const strategy = new JwtStrategy(options, (payload, done) => {
    prisma.getUserById(payload.sub)
    .then((user) => {
        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
    .catch(err => done(err, null));
})

module.exports = (passport) => {
    passport.use(strategy)
};