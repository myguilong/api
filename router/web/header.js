module.exports = app =>{
    const Router = require('koa-router')
    const router = new Router({
        prefix:'/header'
    })
    router.post('/create',async ctx=>{
        //团长申请接口
    })
    app.use(router.routes()).use(router.allowedMethods())
}