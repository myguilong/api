module.exports = app =>{
    const Router = require('koa-router')
    const commites = require('../../models/comities')
    const carts = require('../../models/cart')
    const order = require('../../models/order')
    const restrications = require('../../models/restrictions')
    const router = new Router({
       prefix:'/order'
    })
    router.post('/create',async ctx=>{
          const {foodsList,userid} = ctx.request.body
       //这是用户所在购物车的id
          //只要一提交到这个接口
          //就要去在order中创建订单表
          console.log(foodsList.length)
          let arr = []
          let sum = 0
          const timestrap = new Date().getTime()//时间戳
          console.log(timestrap+userid.substr(userid.length-1,1),'订单号')
          for(let i=0;i<foodsList.length;i++){
              // console.log('12')
            let res = await carts.findById(foodsList[i]).populate({path:'commites'})
            sum+=res.commites.price*res.number
              // console.log(res)
              if(res.commites.limit){
                console.log('当前为限购的商品')
                restrications.create({
                  userid,limitId:res.commites._id,orderNo:timestrap
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
          // console.log(arr,'数组')
          // console.log(sum,'金额')
          //创建订单
          console.log(arr,'数组')
          let res = await order.create({
             userid,list:arr,orderNo:timestrap,money:sum
          })
          //还需要去移除购物车
          for(let i=0;i<foodsList.length;i++){
            // 移除操作
          await carts.findByIdAndRemove(foodsList[i])
          }
          if(res){
            ctx.body = {
              code:0,
              msg:'订单创建成功'
            }
          }   
    })
    app.use(router.routes()).use(router.allowedMethods())
}