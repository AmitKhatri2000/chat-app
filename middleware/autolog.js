const users = require('../models/users')
const jwt = require('jsonwebtoken');

autolog = async(req , res , next) =>{
    try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token , process.env.JWTCODE);
    const user =  await users.findOne({_id : decoded.id})
    if(decoded){
      if (!(user.room)) {
        user.room = "emergency room";
        await user.save();
        }
      res.redirect(`/chat?username=${user.username}&room=${user.room}`);
    }
    } catch (error) {

      next();
    }
    
    
    }

module.exports = autolog;