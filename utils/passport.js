//提交数据策略,做用户是否登录的验证
//使用koa-passport去注册本地passport
const passport = require('koa-passport')
//本地策略
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../models/user')
//提交数据(策略),做用户登陆验证
passport.use(new LocalStrategy(async (username,password,done)=>{

    let where = {username}
    //此处等于 let where = {username:username}
    let result = await UserModel.findOne(where)
    if(result){
        if(password==result.password){
            return done(null,result)
        }else{
            return done(null,false,'密码错误')
        }
    }else{
        return done(null,false,'用户不存在')
    }
}))
//反序列化
passport.serializeUser((user,done)=>{

    return done(null,user)
})
//序列化
passport.deserializeUser((user,done)=>{

    return done(null,user)
})
module.exports = passport