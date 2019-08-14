module.exports = app =>{
   const Router =require('koa-router')
   const cart = require('../../models/cart')
   const router = new Router({
       prefix:'/cart'
   })
   router.post('/addCart',async ctx=>{
       //加入购物车,先拿到商品id,去数据库查找，如果存在就往已有的商品添加,如果不存在就直接创建新的商品,还需要拿用户的id
       const {userid,commitesid} = ctx.request.body
       console.log(userid,commitesid)
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
       console.log(userid)
       const res = await cart.find({
           userid
       }).populate({
        path:'commites'
       })
       console.log(res)
       ctx.body = {
           code:0,
           data:res
       }
   })
   app.use(router.routes()).use(router.allowedMethods())
}