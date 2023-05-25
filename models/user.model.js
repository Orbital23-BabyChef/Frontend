const mongoose = require("mongoose")

const newSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const User = mongoose.model("User",newSchema)

module.exports=User