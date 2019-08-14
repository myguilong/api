//佣金表，对应用户表里面注册的pintai属性为web的,当用户注册后再在这个表去生成数据
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    userid:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user'
    },
    money:{
        type:String,
        required:true
    }

})
module.exports = mongoose.model('money',schema)