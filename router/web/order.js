module.exports = app =>{
    const Router = require('koa-router')
    const commites = require('../../models/comities')
    const carts = require('../../models/cart')
    const order = require('../../models/order')
    const restrications = require('../../models/restrictions')
    const money = require('../../models/money')
    const header = require('../../models/headers')
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
    router.post('/pay',async ctx=>{
      //传入订单号，减去金额,该接口为模拟支付
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
        const heade = await header.findOne({
            userId:res.headerId
        })
        //团长的信息model
        await header.findByIdAndUpdate(heade._id,{
          money:(heade.money+res.money*0.1).toFixed(2)
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
          console.log(foodsList.length)
          let arr = []
          let sum = 0
          const timestrap = new Date().getTime()//时间戳
          const time = new Date().getTime()
          console.log(timestrap+userid.substr(userid.length-1,1),'修改的订单号')
          const orderNo = timestrap+userid.substr(userid.length-1,1)
          console.log(orderNo,'修改的订单号')
          for(let i=0;i<foodsList.length;i++){
            let res = await carts.findById(foodsList[i]).populate({path:'commites'})
            sum+=res.commites.price*res.number
              if(res.commites.limit){
                console.log('当前为限购的商品')
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