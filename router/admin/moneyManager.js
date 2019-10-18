module.exports = app =>{
   const Router = require('koa-router')
   const commission = require('../../models/commission')
   const router = new Router({
       prefix:'/money'
   })
   router.post('/setCommission',async ctx=>{
       const num = ctx.request.body.commission
       let res = await commission.find()

       await  commission.findByIdAndUpdate(res[0]._id,{
           $set:{
               commit:num
           }
       })
       ctx.body = {
           code:0,
           msg:"修改成功"
       }
   })
   router.get('/commissionSeting',async ctx=>{
       const res =await commission.find()
       if(res.length){
             ctx.body = {
                 data:res[0].commit,
                 code:0
             }
       }else{
        await  commission.create({
            commit:0.2
           })
           ctx.body = {
               data:0.2,
               code:0
           }
       }
   })
   app.use(router.routes()).use(router.allowedMethods())
}