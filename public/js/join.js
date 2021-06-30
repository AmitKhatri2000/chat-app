
const form = document.querySelector('.join-form');
const errordiv = document.querySelector('.errordiv')

async function joinuser(username ,room , password) {

const res = await fetch('/joinuser' , {
    method:'POST' ,
    body : JSON.stringify({username , room , password }),
    headers: {'content-type':'application/json'}
    
        })
if (res.status === 200) {
    location.assign(`/chat?username=${username}&room=${room}`);
}

else{
       const error = await res.text();
       errordiv.innerHTML = ""
       errordiv.innerHTML += `<p>${error}</p>`
       setTimeout(function(){errordiv.innerHTML = ""}, 4000)

}
}

form.addEventListener('submit' , (e)=>{
e.preventDefault();
const username = form.username.value.trim();
const room = form.room.value.trim();
const password = form.password.value.trim();
if (username && password) {
    if (room) {
        joinuser(username , room , password);
    }
   
}

})