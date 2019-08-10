const koa = require('koa')
const cors = require('koa2-cors')
const koabody = require('koa-bodyparser')
const session = require('koa-generic-session')
const passport = require('./utils/passport')
const app = new koa()
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', ctx.headers.origin); // 很奇怪的是，使用 * 会出现一些其他问题
  ctx.set('Access-Control-Allow-Headers', 'content-type');
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH')
  ctx.set('Access-Control-Allow-Credentials', true);
  await next();
});
app.keys = ['tg','keys']
app.use(koabody({
    extendTypes: ['json', 'form', 'text']
  }))
app.use(session({
  cookie:{
    secure:false,
    maxAge:86400000
  }
},app))

app.use(passport.initialize())
app.use(passport.session())
require('./plugins/db')()
require('./router/admin/rest')(app)
require('./router/admin/comities')(app)
require('./router/admin/user')(app)
app.listen('3000',()=>{
    console.log('服务启动监听端口3000')
})