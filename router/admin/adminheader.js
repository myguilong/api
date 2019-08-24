module.exports = app =>{
  const Router = require('koa-router')
  const header = require('../../models/headers')
  const router = new Router({
      prefix:'/adminheader'
  })
  router.get('/noHeader',async ctx=>{
      //此接口返回没有审核通过的团长
      const res = await header.find({
          status:0
      })
      ctx.body = {
          code:0,
          data:res
      }
  })
  router.get('/isHeader',async ctx=>{
      ///此接口返回已经是团长的用户
      const res = await header.find({
          status:1
      })
      ctx.body = {
          code:0,
          data:res
      }
  })
  router.post('/setHeader',async ctx=>{
      //此接口为废弃团长的接口,将团长的id废弃
      const {userId,status} = ctx.request.body 
      await header.findByIdAndUpdate(userId,{
          $set:{
              status
          }
      })
      ctx.body={
          code:0,
          msg:"设置团长成功"
      }

  })
  app.use(router.routes()).use(router.allowedMethods())
}