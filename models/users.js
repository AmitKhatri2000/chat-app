const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userschema = new mongoose.Schema({

username:{
type : String ,
unique : true ,
validate(value){
    if(value.length < 4){
        throw new Error('username should be atleast four character long')
}}},
password : {
type : String ,
validate(value){
if (value.length < 7){
    throw new Error('password should be atleast seven character long')
    }

}},
token : {
type : String
} ,
room : {
type : String
}  


})


userschema.statics.errorcheck = async(error) =>{
  var errors = {};
  if (error.code === 11000) {
    errors.username = "this username has already been registered";
    return errors  
  } 
const es = Object.keys(error.errors);
es.forEach( e => {
errors[e] = error.errors[e].message ;
});
return errors;
 }

userschema.methods.gettoken = async function (){
return jwt.sign({id : this.id} , process.env.JWTCODE);
}


userschema.statics.verifyuser = async (username , password) =>{
const user = await users.findOne({username});
if(!user){
  throw new Error('username is invalid')
}
const ismatch = await bcrypt.compare(password , user.password);
if (!ismatch) {
  throw new Error('password is invalid')
}
return user;
}

userschema.pre('save' , async function(next) {
  const user = this
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
  
  }
  next()
})

const users =  mongoose.model('users', userschema)

module.exports = users