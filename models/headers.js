//团长的数据模型
const mongoose = require('mongoose')
const router = new mongoose.Schema({
   name:{
       type:String,//团长名字
       required:true
   },
   address:{
       type:String,//团长地址
       required:true
   },
   city:{
       type:String,//团长城市
       required:true
   },
   longitude:{
       type:String,
       required:true
   },
   latitude:{
       type:String,
       required:true
   },
   money:{
       type:Number,
       required:true
   }
   
})
module.exports = mongoose.model('headers',router)
