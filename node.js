const { error } = require('console')
const { Socket } = require('dgram')
require('./db/mongoose')
const express = require('express')
const http = require('http')
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser');
const gettime = require('./public/js/utils/time')
const userrouter = require('./routers/users')
const msgrouter = require('./routers/message')
const socket = require('socket.io')
const app = express()
const auth = require('./middleware/auth') 
const server = http.createServer(app)
const io = socket(server)


const port = process.env.PORT 


app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bodyparser());
app.use(cookieparser());
app.use(userrouter , msgrouter);
app.get('/' , (req,res)=>res.render('join'));
app.get('/chat' , auth , (req,res)=>res.render('chat'));
app.get('/signup' , (req,res)=>res.render('signup'));



io.on('connection'  , (socket)=>{

    console.log("new connection");
    socket.on('join' , ({username , room} , callback)=>{
 
        socket.join(room)
        socket.emit('alert' , gettime(`welcome ${username}`))
        socket.broadcast.to(room).emit('alert' , gettime(`${username} has joined`))
        socket.emit('old-message') 
        io.to(room).emit('userlist')

        callback()
        
        socket.on('usermessage' , (msg , callback)=>{
        
         io.to(room).emit('message' ,gettime(msg , username)) 
         callback(gettime(msg , username) , room );
        
        })
        
        socket.on('location' , ({lan , log} , callback)=>{
         callback();
        var locationtag = `https://www.google.com/maps?q=${lan},${log}`;
        io.to(room).emit('location'  , gettime(locationtag , username))
        
        }) 
        
        socket.on('disconnect' , ()=>{
       
                io.to(room).emit('alert' , gettime(`${username} had left`))
                io.to(room).emit('userlist')
              
        })
    
    })    
})

server.listen(port , ()=>{

    console.log(` app listening at http://localhost:${port}`)

})