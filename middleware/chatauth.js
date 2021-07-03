const users = require('../models/users')
const jwt = require('jsonwebtoken');

chatauth = async(req , res , next) =>{
try {
const token = req.cookies.jwt;
const decoded = jwt.verify(token , process.env.JWTCODE);
const user =  await users.findOne({_id : decoded.id})
if(decoded){
var username = req.query.username ;
var room =  req.query.room;
if (user.username === username && user.room === room ) {
 req.user = user;
next();
}
else{
    throw new Error("Not valid data")
}
}
} catch (error) {
    res.redirect('/signup')
}


}

module.exports = chatauth;