module.exports = app =>{
    const Router = require('koa-router')
    const money = require('../../models/money')
    const router = new Router({
        prefix:'/webuser'
    })
    //用户的一些购买操作
    router.get('/money',async ctx=>{
         //获得用户的可用金额
         const {id} = ctx.query
         console.log(id)
         const res = await money.findOne({
            userid:id
         })
         console.log(res)
         ctx.body = {
             code:0,
             msg:'获取用户金额成功',
             data:res
         }
    })
    app.use(router.routes()).use(router.allowedMethods())
}
