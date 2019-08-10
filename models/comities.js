const mongoose  = require('mongoose')
const category = require('./category')
const schema = new  mongoose.Schema({
   name:{
       type:String,//商品名字
       required:true
   },
   price:{
       type:Number,//商品价格
       required:true
   },
   content:{
       type:String//商品简介
   },
   parentCategory:{
       type:mongoose.SchemaTypes.ObjectId,//商品所属分类
       ref:'category'
   },
   oldprice:{
       type:Number, //对比价格
       required:true
   },
   specifications:{
       type:String,//商品规格
       required:true 
   },
   bannerlist:{
       type:Array, //商品伦轮播图
       required:true    
   },
   limit:{
       type:Number //限购数,如果这个参数存在，用户购买这个商品的数量就不能高于这个参数
   },
   stock:{
       type:Number,
       required:true //商品库存数量
   },
   sellOut:{
       type:Number, //商品已经售出数
       required:true
   },
   status:{
       type:Number,//商品是否上架
   }
})
module.exports = mongoose.model('comities',schema)