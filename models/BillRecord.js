const mongoose = require('mongoose')
//记录账单流水的数据表，每次用户进行购买产品，就往表中插入一条数据
//sumMoney为总金额
const schema = new mongoose.Schema({
   money:{
       type:Number,
       required:true
   },
   fromOrderNO:{
       type:String,
       required:true
   },
   sumMoney:{
      type:Number,
      
   }
})

module.exports = mongoose.model('BillRecord',schema)

