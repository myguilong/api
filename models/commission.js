//系统佣金比例
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
      commit:{
          type:Number, //此数据表只能存放一条模型
          required:true
      }
      
})
module.exports = mongoose.model('commission',schema)