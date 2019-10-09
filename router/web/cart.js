module.exports = app =>{
   const Router =require('koa-router')
   const cart = require('../../models/cart')
   const restrication = require('../../models/restrictions')
   const router = new Router({
       prefix:'/cart'
   })
   router.post('/addCart',async ctx=>{
       //加入购物车,先拿到商品id,去数据库查找，如果存在就往已有的商品添加,如果不存在就直接创建新的商品,还需要拿用户的id
       const {userid,commitesid} = ctx.request.body
       let data = await restrication.find({
          userid:userid,
          limitId:commitesid
       })
     
       if(data.length!=0){
           ctx.body = {
               code:-1,
               msg:'你已经购买过限购商品不能再购买了哦'
           }
           return 
       }
       let res = await cart.findOne({
           commites:commitesid,
           userid:userid
       })
       console.log(res)
       if(res){
           await cart.findByIdAndUpdate(res._id,{
               $set:{
                   number:res.number+1
               }
           })
           ctx.body = {
            code:0
           }
       }else{
           await cart.create({
                number:1,
                commites:commitesid,
                userid:userid
            })
            ctx.body = {
                code:0,
                msg:'添加成功'
            }
       }
    
   })
   router.get('/getCart',async ctx=>{
       const {userid} = ctx.query
    
       const res = await cart.find({
           userid
       }).populate({
        path:'commites'
       })
       ctx.body = {
           code:0,
           data:res
       }
   })
   app.use(router.routes()).use(router.allowedMethods())
}