const jwt = require('jsonwebtoken')
const serect = 'token'//密钥,不能丢
module.exports =tokens =>{
    //创建token并导出
    // console.log(tokens,'调用解析')
    let is = true
   if(tokens){
    //    let toke = tokens.split('.')[1]
    //    //解析
    //    console.log(toke,'toke')
    //    let decoded = jwt.decode(toke,serect)
    //    return decoded
       jwt.verify(tokens,serect,(err,decode)=>{
           if(err){
              is = false
           }else
           {
               is = true
           }
       })
       return is

   }
}
