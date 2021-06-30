const gettime = (msg , username)=>{
const now = new Date()   
time = (now.getMinutes() < 10) ? `${now.getHours()}:0${now.getMinutes()}` : `${now.getHours()}:${now.getMinutes()}`;  
if (!username) {
    username = "anonymous"
}
return { username , msg , time }
}

module.exports = gettime
    
