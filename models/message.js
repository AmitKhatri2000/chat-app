const mongoose = require('mongoose');

const msgschema = new mongoose.Schema({
username :{
    type: String,
    required : true
},
msg : {
    type: String,
    required : true
},
room:{
type: String,
required : true
},
time:{
    type: String

}




})

const messages = mongoose.model('messsages' , msgschema);

module.exports = messages


