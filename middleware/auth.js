const users = require('../models/users')
const jwt = require('jsonwebtoken');

auth = async(req , res , next) =>{
try {
const token = req.cookies.jwt;
const decoded = jwt.verify(token , process.env.JWTCODE);
const user =  await users.findOne({_id : decoded.id})
if(decoded){
req.user = user;
next();
}
} catch (error) {
    res.redirect('/')
}


}

module.exports = auth