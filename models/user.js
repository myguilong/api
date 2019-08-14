const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{
        type:String,
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
    },
    pintai:{
        type:String //判断用户的登录账户为平台还是管理系统
    }
})
module.exports = mongoose.model('User',schema)