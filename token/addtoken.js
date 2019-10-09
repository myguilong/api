const jwt = require('jsonwebtoken')
const serect = 'token'//密钥,不能丢
module.exports = userinfo =>{
    //创建token并导出
    const token = jwt.sign({
         username:userinfo.name,
         id:userinfo.id
    },serect,{
        expiresIn:60*60*24
    })
    return token
}
