const mongoose = require("mongoose");


const Message = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.ObjectId , 
        ref:"UserSchema" , 
        required:true ,
    },
    reciverId:{
        type:mongoose.Schema.ObjectId , 
        ref:"UserSchema" , 
        required:true , 
    },
    text:{
        type:"String", 
        required:true , 
    }
})

module.exports = mongoose.model("Messages" , Message) ; 