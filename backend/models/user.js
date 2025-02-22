const mongoose = require('mongoose');
const {getCurrentDate} = require('../utils/helperFunctions');

const userSchema = new mongoose.Schema({
    username : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    name : {type : String, default : ''},
    vfcode : {type : String, default : '0'},
    dateOfBirth : {type : String, default : ''},
    gender : {type : String, default : ''},
    registeredOn : {type : String, default : getCurrentDate(2)},
    doctorEmail : {type : String, default : ''},
    pastRecords : [{type : mongoose.Schema.Types.ObjectId, ref : 'records'}]
});

const User = mongoose.model('users', userSchema, 'users');

module.exports = {User};

/* 



*/
