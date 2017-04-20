var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../model/user.js');
var config = require('../config/database');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GoogleAuth = require('../config/auth');

module.exports = function (passport) {

    var opts = {};
    opts.secretOrKey = config.secret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.find({ id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
    }));

    //Google Strategy

    passport.use(new GoogleStrategy({

        clientID: GoogleAuth.googleAuth.clientID,
        clientSecret: GoogleAuth.googleAuth.clientSecret,
        callbackURL: GoogleAuth.googleAuth.callbackURL,
        passReqToCallback: true,

    },
        function (req, token, refreshToken, profile, done) {

            process.nextTick(function () {

                if (!req.user) {
                    User.findOne({ 'google.id': profile.id }, function (err, user) {
                        if (err) {
                            return done(err);

                            if (user) {

                            var token = jwt.encode(user, config.secret);
                            res.json({success: true, token: token});
                            return done(null, user);
                            
                            }
                            else {
                                var newUser = new User();

                                newUser.google.id = profile.id;
                                newUser.google.token = token;
                                newUser.google.name = profile.displayName;
                                newUser.google.email = (profile.emails[0].value || '').toLowerCase();

                                newUser.save(function (err) {
                                    if (err) {
                                        return done(err);
                                    }
                                    else {
                                        var token = jwt.encode(newUser, config.secret);
                                        res.json({success: true, token: token});
                                        return done(null, newUser);
                                        
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    ))
}