var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//Models an config files
var User = require('../model/user.js');
var config = require('../config/database');
var googleAuth = require('../config/auth');


module.exports = function(passport) {

    var opts = {};
    opts.secretOrKey = config.secret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        User.find({id: jwt_payload.id}, function(err, user){
            if(err){
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

 /*   passport.use(new GoogleStrategy({

        clientID : googleAuth.googleAuth.clientID,
        clienSecret : googleAuth.googleAuth.clientSecret,
        callbackURL : googleAuth.googleAuth.callbackURL,
        passReqToCallback : true
        
    },
    function(req, token, refreshToken, profile, done) {

        process.nextTick(function() {

            if(!req.user) {
                User.findOne({ 'google.id': profile.id}, function(err, user){
                    if(err){
                        return done(err);
                    }

                    if(user){
                        if(!user.google.token) {
                            user.google.token = token;
                            user.google.name = profile.displayName;
                            user.google.email = (profile.emails[0].value || '').toLowerCase();

                            user.save(function(err){
                                if(err){
                                    return done(err);
                                }
                                else{
                                    var token = jwt.encode(user, config.secret);
                                    res.json({success: true, token: token});
                                    return done(null, user);
                                }
                            });
                        }
                        return done(null, user);
                    } else {
                        var newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = (profile.emails[0].value || '').toLowerCase();

                        newUser.save(function(err) {
                            if(err){
                                return done(err);
                            }
                            else{
                                var token = jwt.encode(newUser, config.secret);
                                res.json({success: true, token: token});
                                return done(null, newUser);
                            }
                        })
                    }

                })
            } else {
                var user = req.user 

                user.google.id = profile.id;
                user.google.toLowerCase = token;
                user.google.name = profile.displayName;
                user.google.email = (pofile.emails[0].value || '').toLowerCase();

                user.save(function(err) {
                    if(err){
                        return done(err);
                    }
                    else{
                        return done(null, user);
                    }
                });
            }

        });
    }));*/
};