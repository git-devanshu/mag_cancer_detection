const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    imageURL : {type : String, default : ""},
    testDate : {type : String, default : ""},
    category : {type : String, default : ""},
    confidence : {type : Number, default : 0},
});

const Record = mongoose.model('records', recordSchema, 'records');

module.exports = {Record};