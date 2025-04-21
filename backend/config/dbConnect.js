const mongoose = require('mongoose')

require('dotenv').config() ; 

const connectDB = ()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("connected with db");
    }).catch(()=>{
        console.log("Failed to connect with db ");
    })

}
module.exports =  {connectDB} ; 