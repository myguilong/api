module.exports = app =>{
    const Router = require('koa-router')
    const User = require('../../models/user')
    const passport = require('../../utils/passport')
    let router = new Router({prefix:'/users'})
   
    router.post('/regist',async ctx=>{
        //注册接口
        console.log('调用接口')
        let {username,password} = ctx.request.body
        //因为只有系统管理员才能添加账号,不做验证码验证
        //权限管理后期再考虑,注册只需要传入用户账号和密码
        if(username){
            //用用户名去数据库查找是否存在相同的
            let res = await User.findOne({username})
            if(res){
                //当前输入的用户名是在数据库
                ctx.body={
                    code:-1,
                    msg:'当前输入的用户名已经被注册过'
                }
                return false
            }
            let nuser = await User.create({
                username,password
            })
            if(nuser){
                ctx.body={
                    code:0,
                    msg:'添加管理员成功'
                }
            }
        }
    })
    //登陆接口
    router.post('/signin', async (ctx, next) => {
        //使用passport.authenticate进行验证
        return passport.authenticate('local', (error, user, info, status) => {
          if (error) {
            ctx.body = {
              code: -1,
              msg: error
            }
          } else {
            if (user) {
              ctx.body = {
                code: 0,
                msg: '登陆成功'
              }
              return ctx.login(user)
             
            } else {
              ctx.body = {
                code: 1,
                msg: info
              }
            }
      
          }
        })(ctx, next)
       
      })
    router.get('/exit',async (ctx,next)=>{
    
        await ctx.logout()
      
        if(!ctx.isAuthenticated()){
            //判断用户是否登陆
            ctx.body = {
                code:0
            }
        }else{
            ctx.body = {
                code:-1
            }
        }
    })
    router.get('/getuser',async (ctx,next)=>{
        if(ctx.isAuthenticated()){
            const {username,name} = ctx.session.passport.user
            ctx.body = {
                code:0,
                user:username,
                name
            }
        }else{
            ctx.body = {
                code:-1,
                msg:'您未登录'
            }
        }
    })
    app.use(router.routes()).use(router.allowedMethods())
}