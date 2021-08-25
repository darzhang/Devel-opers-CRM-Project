var mongoose = require('mongoose');
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
    username: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    }
})

UserSchema.methods.generateHash = function(password){
    console.log("generate hash\n");
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);