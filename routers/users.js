const express = require('express')
const users = require('../models/users')
const auth = require('../middleware/auth')
const router = new express.Router();


router.post('/addusers' ,  async(req,res)=>{
const user = new users(req.body)  
try {
 await user.save()
 res.status(201).send(); 
 } catch (error) {
   const errors = await users.errorcheck(error)
  res.status(400).send(errors);
}
})

router.post('/joinuser' , async(req,res)=>{
const data = req.body;    

try {
    const user = await users.verifyuser(data.username , data.password);
    const token = await user.gettoken();
    if (user.token) {
        throw new Error('please logout of other divices to continue');

    }
    res.cookie('jwt' , token , {
        httpOnly: true 
    })   
   user.token = token;
   user.room = data.room;
   await user.save();
   res.status(200).send();
} catch (error) {
      res.status(400).send(error.message);
}
})

router.get('/logout' , auth , async(req , res)=>{
 const user = req.user;
try { 
user.token = "";
user.room = "";
await user.save();
res.cookie('jwt' , "" , {
    httpOnly: true , maxAge : 1
})   
res.status(200).send();
} catch (error) {
   console.log(error);
}    
})

router.get('/userlist' , auth , async(req , res)=>{
    const user = req.user;
    var userlist = await users.find({room : user.room});
    try {
        res.status(200).send(userlist);
    } catch (error) {
        console.log(error);
    }

})

module.exports = router;