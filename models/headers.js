//团长的数据模型
const mongoose = require('mongoose')
const user = require('./user')
const router = new mongoose.Schema({
    name: {
        type: String, //团长名字
        required: true
    },
    status:{
        //团长的状态,0为待审核 1为可用的 3为已经废弃
        type:Number
    },
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'/User'
    },
    address: {
        type: String, //团长地址
        required: true
    },
    unaddress:{
        type:String,
        required:true
    },
    city: {
        type: String, //团长城市
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: true
    },
    imgSrc: {
        type:String
    },
    location:{
        type:[Number],
        index:{
            type:'2dsphere',
            sparse:true
        }
    },
    tags:{
        type:[String],
        index:true
    },
    phone:{
        type:String,
        required:true
    }
},{
    collection:'Header'
})
module.exports = mongoose.model('headers', router)