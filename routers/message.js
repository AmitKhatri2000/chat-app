const express = require('express')
const messages = require('../models/message')
const auth = require('../middleware/auth')
const router = express.Router();

router.post('/addmsg' , auth ,  async(req,res)=>{ 
const message = new messages(req.body)
try {
await message.save()
} catch (error) {   
console.log(error);
}
})


router.post('/getmsg' , async(req,res)=>{
 const room = req.body.room;
 var data = await messages.find({room})
 try {
    res.status(200).send(data);
} catch (error) {
    console.log(error);
}

})

module.exports = router