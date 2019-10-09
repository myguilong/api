const mongoose = require('mongoose')
const headers = require('./headers')
const Users = require('./user')
const schema = new mongoose.Schema({
     //订单号，userid，商品列表，金额
     list:{
         type:Array
     },
     userid:{
         type:mongoose.SchemaTypes.ObjectId,
         ref:'User'
     },
     orderNo:{
         type:String
     },
     money:{
         type:Number
     },
     headerId:{
         type:mongoose.SchemaTypes.ObjectId,
         ref:'headers'
     },
     status:{
         type:Number//订单状态
     },
     time:{
         type:String
     }
})
module.exports = mongoose.model('order',schema)