const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    name : {type : String, required : true},
    vfcode : {type : String, default : '0'},
});

const User = mongoose.model('users', userSchema, 'users');

module.exports = {User};

/* 



*/
