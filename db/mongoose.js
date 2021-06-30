const mongoose = require('mongoose')

 
mongoose.connect(process.env.CONNECTIONSTRING , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('MongoDB successfully connected');
}).catch(error => {
    console.log('Error establishing MongoDB connection. Error:', error.message);
});    