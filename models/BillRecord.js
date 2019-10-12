const mongoose = require('mongoose')

const schema = new mongoose.Schema({
   money:{
       type:Number,
       required:true
   },
   fromOrderNO:{
       type:String,
       required:true
   }
})

module.exports = mongoose.model

