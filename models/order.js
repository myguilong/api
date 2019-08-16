const mongoose = require('mongoose')
const schema = new mongoose.Schema({
     //订单号，userid，商品列表，金额
     list:{
         type:Array
     },
     userid:{
         type:mongoose.SchemaTypes.ObjectId
     },
     orderNo:{
         type:String
     },
     money:{
         type:String
     }
})
module.exports = mongoose.model('order',schema)