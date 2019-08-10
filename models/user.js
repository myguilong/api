const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('User',schema)