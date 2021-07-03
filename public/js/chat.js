 const form = document.querySelector('.msg-form')
 const locationbut = document.querySelector('.location-but')
 const altdiv = document.querySelector('.alert-sub-div')
 const msgdiv = document.querySelector('.msg-sub-div')
 const roomdiv = document.querySelector('.room-list-div')
 const $msgdiv = document.querySelector('.msg-div')
 const logout = document.querySelector('.logout')
 const settingbut = document.querySelector('.s')
 const settingdiv = document.querySelector('.setting')
 const changeroom = document.querySelector('.changeroom')


// updateuserroom

const updateroom = async(room)=>{

  const res = await fetch('/updateuser',{
    method : 'POST',
    body : JSON.stringify({room}),
    headers: {'content-type':'application/json'}
    })
  if (res.status === 200) {
    const username =  await res.text()
    location.assign(`/chat?username=${username}&room=${room}`);
  }

}


// settingbut

settingbut.addEventListener('click' , ()=>{
settingdiv.classList.toggle('active')  
})

changeroom.addEventListener('keyup' ,(e)=>{
if (e.keyCode === 13){
  const room = changeroom.value.trim();
  if (room) {
    updateroom(room);
  }
  changeroom.value = "";
}

})




// reload function

window.addEventListener( "pageshow", function ( event ) {
  var historyTraversal = event.persisted || 
                         ( typeof window.performance != "undefined" && 
                              window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    // Handle page restore.
    window.location.reload();
  }
});


// logout


logout.addEventListener('click' , async()=>{
const res = await fetch('/logout');
if (res.status === 200) {
  location.assign('/');
} 
})


// addmsg

const addmsg = async(msg , username , time , room)=>{
const res = await fetch('/addmsg' ,{
method : 'POST',
body : JSON.stringify({username , msg  , time ,room}),
headers: {'content-type':'application/json'}
})
}

// get msg


const getmsg = async(room)=>{
  const res = await fetch('/getmsg',{
    method : 'POST',
    body : JSON.stringify({room}),
    headers: {'content-type':'application/json'}
    })
  if (res.status === 200) {
    const data = await res.json();
    return data;
  }
  }


// userlist fetch

const userlist = async (room)=>{
  const res = await fetch('/userlist' ,{
    method : 'POST',
    body : JSON.stringify({room}),
    headers: {'content-type':'application/json'}
    });
  if (res.status === 200) {
     data = await res.json();
        return data
  }
  }

// autoscroll

const autoscroll = ()=>{
$msgdiv.scrollTop = $msgdiv.scrollHeight
}



 const filterurl = ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const username  = urlParams.get('username');
    const room  = urlParams.get('room');
    
    return{
      username , room 
    }
   
   }
 
 const socket = io()

socket.on('userlist' , async(room)=>{
const data = await userlist(room);
roomdiv.innerHTML = `  
<h1>chat app</h1>
<h3 class="room">room : ${data[0].room}</h3>
<p class="text">online users</p>` 
data.forEach( user => {
roomdiv.innerHTML += `<p class="username">${user.username}</p>`
});

})
 

socket.on('old-message' , async (room)=>{
const data = await getmsg(room);
if(data){
  data.forEach(data => {
    msgdiv.innerHTML += `<div class="chat-div com-div">
  <span class="username">${data.username}</span>
  <p class="chat-p">${data.msg}</p>
  <span class="span">${data.time}</span>
  </div>`
  });
  $msgdiv.scrollTop = $msgdiv.scrollHeight
  }
})


 socket.on('message' , (data)=>{

    msgdiv.innerHTML += `<div class="chat-div com-div">
    <span class="username">${data.username}</span>
    <p class="chat-p">${data.msg}</p>
    <span class="span">${data.time}</span>
    </div>`
    autoscroll();
     })

 socket.on('location' , (data)=>{

    msgdiv.innerHTML +=  `<div class="loc-div com-div">
    <span class="username">${data.username}</span>
    <p class="loc-p"><a target="_blank" href="${data.msg}">current location</a></p>
    <span class="loc-span span">${data.time}</span>
   </div>`
   autoscroll();
   })

socket.on('alert' , (data)=>{

    altdiv.innerHTML = `<div class="alert-div com-div">
    <p class="alert-p">${data.msg}</p>
    <span class="span">${data.time}</span>
    </div>`
    setTimeout(() => {
    document.querySelector('.alert-div').style.display = "none"
    }, 3000);
  
   }) 

form.addEventListener('submit' , (e)=>{
e.preventDefault()
const value = form.message.value.trim();
form.reset()
if (value) {
    socket.emit('usermessage', value , (data , room)=>{
        addmsg(data.msg , data.username , data.time , room);
    })
}

 })

 locationbut.addEventListener('click' , ()=>{
  if (!navigator.geolocation) {
      return alert("sorry your browser doesn't support this feature")
    
  }  
locationbut.setAttribute('disabled' , 'disabled')
   navigator.geolocation.getCurrentPosition((pos)=>{
   lan = pos.coords.latitude
   log = pos.coords.longitude 
  
   socket.emit('location' , {lan , log} , ()=>{
    locationbut.removeAttribute('disabled')
    console.log('location send');
   })
 
  })    

 })

 socket.emit('join' , filterurl() ,  (error)=>{
  if (error) {
  alert(error)
  location.assign('/')
 }
 
 })

 
