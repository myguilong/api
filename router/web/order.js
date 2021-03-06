module.exports = app =>{
    const Router = require('koa-router')
    const commites = require('../../models/comities')
    const commission = require('../../models/commission')
    const carts = require('../../models/cart')
    const order = require('../../models/order')
    const restrications = require('../../models/restrictions')
    const money = require('../../models/money')
    const header = require('../../models/headers')
    const BillRecord = require('../../models/BillRecord')
    const router = new Router({
       prefix:'/order'
    })
    router.get('/getOrder',async ctx=>{
      const {userid,status} = ctx.query
      let res;
      if(status==200){
        res = await order.find({
          userid
        })
      }else{
        res = await order.find({
          userid,status
        })
      }
      ctx.body = {
        code:0,
        data:res
      }
    })
     router.post('/deleteOrder',async ctx=>{
       //删除订单
       const {orderid,userid,orderNo} = ctx.request.body
       if(!userid){
           ctx.body = {
             code:-1,
             msg:"用户id未传入参数"
           }
           return
       }
       if(!orderNo){
         //订单号未传入
         ctx.body={
            code:-1,
            msg:'用户的订单号没有正确传入'
         }
       }
       order.deleteOne({
         orderNo,userid
       }).then(res=>{
        ctx.body = {
          code:0,
          msg:'删除未支付的订单成功'
        }
       }).catch(err=>{
         ctx.body={
           code:-1,
           msg:"删除失败",
           errMsg:err
         }
       })      
     })
     router.post('/pay',async ctx=>{
      //传入订单号，减去金额,该接口为模拟支付
      console.log('调用')
      const commM =await commission.find()
     console.log(typeof commM[0].commit)
    //  ctx.body = {
    //    code:-1
    //  }
        const {orderNo,userid} = ctx.request.body
        const res = await order.findOne({
          orderNo,userid
        })
        //拿订单号和userid去订单表查询订单数据
        //将拿到的数据再去团长佣金表去修改团长所得的佣金
        // console.log(res)
        const resmoney = await money.findOne({
          userid:res.userid
        })
        //可用额度数据model
        const heade = await header.findById(res.headerId)
        //团长的信息model
        await header.findByIdAndUpdate(heade._id,{
          money:(heade.money+res.money*commM[0].commit).toFixed(2)
        })
        //去修改团长的佣金数据
        // console.log(resmoney)
        await money.findByIdAndUpdate(resmoney._id,{
          $set:{
                money:resmoney.money-res.money
          }
        })
        await order.findByIdAndUpdate(res._id,{
          $set:{
            status:1
          }
        })
        await BillRecord.create({
          money:res.money,
          fromOrderNO:res.orderNo
        })
        ctx.body = {
              code:0,
              msg:'支付成功待商家发货'
        }      
    })
    router.post('/create',async ctx=>{
          const {foodsList,userid,headerId} = ctx.request.body
          //这是用户所在购物车的id
          //只要一提交到这个接口
          //就要去在order中创建订单表
          let arr = []
          let sum = 0
          const timestrap = new Date().getTime()//时间戳
          const time = new Date().getTime()
          const orderNo = timestrap+userid.substr(userid.length-1,1)
          for(let i=0;i<foodsList.length;i++){
            let res = await carts.findById(foodsList[i]).populate({path:'commites'})
            sum+=res.commites.price*res.number
              if(res.commites.limit){
                restrications.create({
                  userid,limitId:res.commites._id,orderNo,time
                })
              }
                let obj={}
                obj.name= res.commites.name
                obj.specifications=res.commites.specifications
                obj.price = res.commites.price
                obj.oldprice = res.commites.oldprice
                obj.thumbe = res.commites.bannerlist[0]
                obj.num = res.number
                arr.push(obj)
          }
          //创建订单
          let res = await order.create({
             userid,list:arr,orderNo,money:sum,headerId,time,status:0
          })
          //还需要去移除购物车
          for(let i=0;i<foodsList.length;i++){
            // 移除操作
           await carts.findByIdAndRemove(foodsList[i])
          }
          if(res){
            ctx.body = {
              code:0,
              msg:'订单创建成功',
              data:{
                DDNO:res.orderNo
              }
            }
          }   
    })
    app.use(router.routes()).use(router.allowedMethods())
}