var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var UserSchema = new Schema({
    
    local: {
        email: String,
        firstname: String,
        lastname: String,
        password: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt){
            if(err){
                return next(err);
            }
            bcrypt.hash(user.local.password, salt, function (err, hash) {
                if(err) {
                    return next(err);
                }
                user.local.password = hash;
                next();
            });
        });
    }
    else{
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.local.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);