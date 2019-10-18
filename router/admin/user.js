module.exports = app =>{
    const Router = require('koa-router')
    const User = require('../../models/user')
    const passport = require('../../utils/passport')
    const Money = require('../../models/money')
    let router = new Router({prefix:'/users'})
    const addtoken = require('../../token/addtoken')
    router.post('/regist',async ctx=>{
        //注册接口
        console.log('调用接口')
        let {username,password,pintai,name} = ctx.request.body
        //因为只有系统管理员才能添加账号,不做验证码验证
        //权限管理后期再考虑,注册只需要传入用户账号和密码
        console.log(username)
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
                username,password,pintai,name
            })
            console.log(nuser,'注册用户')
            if(pintai=="admin"){
                if(nuser){
                    ctx.body={
                        code:0,
                        msg:'添加管理员成功'
                    }
                }
            }else{
                if(nuser){
                    await Money.create({
                        userid:nuser._id,
                        money:500
                    })
                    ctx.body={
                        code:0,
                        msg:'注册成功'
                    }
                }
            }
           
        }
    })
    router.get('/getAdminList',async ctx=>{
        //返回所有的系统管理员
        const res = await User.find({
            pintai:"admin"
        })
        ctx.body = {
            code:0,
            data:res
        }
    })
    router.post('/addAdmin',async ctx=>{
        //新增加管理员的接口
        const {name,username,password} = ctx.request.body

        try {
            await User.create({
                name,username,password,
                pintai:"admin"
     
             })
            ctx.body = {
                code:0,
                msg:'添加成功'
            }
        } catch (error) {
            // console.log(error)
            ctx.body = {
                code:-1,
                msg:'添加失败'
            }
        }
       
        // if(res){
    
        // }else{
        //     ctx.body = {
        //         code:-1,
        //         msg:'添加失败'
        //     }
        // }
        // console.log(res)
        
    })
    //登陆接口
    router.post('/signin', async (ctx, next) => {
        //修改使用token登录
         const  {username,password,pintai} = ctx.request.body
         const res = await User.findOne({
              username,password,pintai
         })
        
         if(res){
             //当前用户存在
            console.log(res,'res')
            let tk = addtoken({name:res.name,id:res._id})
            console.log(tk)
        
              await User.findOneAndUpdate({
                 name:res.username,
                 $set:{
                     token:tk
                 }
             })
            ctx.body={
                code:0,
                tk,
                user:{
                    name:res.name,
                    id:res._id
                }
            }
         }else{
             ctx.body = {
                code:-1,
                msg:'当前用户不存在'
             }
            
         }
        //使用passport.authenticate进行验证
        //改为使用token验证登录,现在这种登录方式在移动端中使用不了,且小程序也使用不了
        // return passport.authenticate('local', (error, user, info, status) => {
        //   if (error) {
        //     ctx.body = {
        //       code: -1,
        //       msg: error
        //     }
        //   } else {
        //     console.log(user,'124')
        //     if (user.pintai=='admin') {
              
        //       ctx.body = {
        //         code: 0,
        //         msg: '管理系统登录成功'
        //       }
        //       return ctx.login(user)
             
        //     } else if(user.pintai=='web'){
        //         ctx.body = {
        //             code: 0,
        //             msg: '客户端登录成功'
        //           }
        //           return ctx.login(user)
        //     }
        //      else {
        //       ctx.body = {
        //         code: 1,
        //         msg: info
        //       }
        //     }
      
        //   }
        // })(ctx, next)
       
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
            const {username,name,_id} = ctx.session.passport.user
            ctx.body = {
                code:0,
                user:username,
                name,
                _id
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