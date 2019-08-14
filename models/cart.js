const mongoose = require('mongoose')
const user = require('./user')
const commites = require('./comities')
const schmma = new mongoose.Schema({
   userid:{
      type:mongoose.SchemaTypes.ObjectId,
      ref:'User'
   },
   commites:{
       type:mongoose.SchemaTypes.ObjectId,
       ref:'comities'
   },
   number:{
       type:Number
   }
})
module.exports = mongoose.model('Cart',schmma)