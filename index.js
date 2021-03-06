const koa = require('koa')
const cors = require('koa2-cors')
const koabody = require('koa-bodyparser')
const session = require('koa-generic-session')
const server = require('koa-static')
const passport = require('./utils/passport')
const path = require('path')
const app = new koa()
const staticPath = './public'
const home = server(path.join(__dirname,staticPath))
// app.use(server(path.join(__dirname+'./public/')))
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS','DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));
app.keys = ['tg','keys']
app.use(home)
app.use(koabody({
    extendTypes: ['json', 'form', 'text']
  }))
// app.use((ctx,next)=>{
//   console.log('调用')
// })
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
require('./router/web/cart')(app)
require('./router/web/webuser')(app)
require('./router/web/order')(app)
require('./router/web/header')(app)
require('./router/admin/adminheader')(app)
require('./router/admin/moneyManager')(app)
app.listen('3000',()=>{
    console.log('服务启动监听端口3000')
})