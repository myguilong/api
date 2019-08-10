//商品的操作
module.exports = app =>{
    const Router = require('koa-router')
    const comities = require('../../models/comities')
    const router = new Router({
        prefix:'/comities'
    })
    router.get('/getDownCom',async ctx=>{
          let res = await comities.find({
               status:0
          })
          ctx.body = {
              code:0,
              data:res
          }
    })
    router.post('/setComities',async ctx=>{
        //该接口管理商品上下架
          let data = await comities.findById(ctx.request.body.id)
          console.log(data)
          if(data.status==0){
            await comities.findByIdAndUpdate(ctx.request.body.id,{
                $set: {
                    status:1
                }
            })
            ctx.body={
                code:0,
                msg:"上架成功"
            }
          }
          else{
            await comities.findByIdAndUpdate(ctx.request.body.id,{
                $set: {
                    status:0
                }
            })
            ctx.body={
                code:0,
                msg:"下架成功"
            }
          }
        })
    app.use(router.routes()).use(router.allowedMethods())
}