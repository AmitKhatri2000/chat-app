
const form = document.querySelector('.join-form');
const errordiv = document.querySelector('.errordiv')

async function adduser(username , password) {

const res = await fetch('/addusers' , {
    method:'POST' ,
    body : JSON.stringify({username , password }),
    headers: {'content-type':'application/json'}
    
        })
if (res.status === 201) {
      location.assign('/');
}
else{    
const error = await res.json();
const es = Object.keys(error);
errordiv.innerHTML = ""
es.forEach(e =>{
 errordiv.innerHTML += `<p>${error[e]}</p>`
})
setTimeout(function(){errordiv.innerHTML = ""}, 4000)

}


}

form.addEventListener('submit' , (e)=>{
e.preventDefault();
const username = form.username.value.trim();
const password = form.password.value.trim();
if (username && password) {
    adduser(username , password);
}

})