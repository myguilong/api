//限购表,如果用户有购买限购商品就往此处存,用户id和订单号，注意一点是不能只是购买限购的商品
const mongoose = require('mongoose')
const user = require('./user')
const commites = require('./comities')
const schema = new mongoose.Schema({
   userid:{
       type:mongoose.SchemaTypes.ObjectId,
       ref:'User'
   },
   limitId:{
       type:mongoose.SchemaTypes.ObjectId,
       ref:'comities'
   },
   orderNo:{
       type:String
   }

})
module.exports = mongoose.model('restriction',schema)