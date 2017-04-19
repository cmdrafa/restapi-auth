var User = require('../model/user');
var jwt = require('jwt-simple');
var config = require('../config/database');
var Q = require('q');
var _ = require('lodash');

var functions = {
    authenticate: function(req, res){
        User.findOne({ 'local.email' : req.body.email }, function(err, user){
            if(err) throw err;
            if(!user) {
                return res.status(403).send({success: false,
                    msg: 'Authentication failed, user not found'});
                    console.log("User not found " + req.body.email);
            }

            else{
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err){
                        var token = jwt.encode(user, config.secret);
                        res.json({success: true, token: token});
                    }
                    else{
                        return res.status(403).send({success: false, 
                            msg: 'Authentication failed, wrong password.'});
                            console.log("Password problem");
                        }
                })
            }

        })
    },
    addNew: function(req, res){
        if((!req.body.email) || (!req.body.password)){
            console.log(req.body.email);
            console.log(req.body.password);

            res.json({success: false, msg: 'Enter all values'});
        }
        else{
            var newUser = new User();
                newUser.local.email = req.body.email;
                newUser.local.firstname = req.body.firstname;
                newUser.local.lastname = req.body.lastname;
                newUser.local.password = req.body.password;
            };

            newUser.save(function(err, newUser){
                if(err){
                    res.json({success: false, msg:'Failed to save'})
                }

                else{
                    res.json({success: true, msg: 'Successfully saved'});
                }
            })
    },

    getinfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.json({success: true, msg: 'hello' +decodedtoken.email});
        }
        else{
            return res.json({success: false, msg: 'No header'});
        }
    }
    
};

module.exports = functions;