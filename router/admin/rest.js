//此处存放通用接口
module.exports = app => {
    const Router = require('koa-router')
    const router = new Router({
        prefix: '/rest/:resources'
    })
    function Model(value) {
        return require(`../../models/${value}`)
    }
    router.post('/create', async ctx => {
        // const model = require(`../../models/${ctx.params.resources}`)
        if (ctx.params.resources == 'commission') {
            //如果调用的是佣金的创建就先去查找佣金比例在数据库中是否存在
            const res = await Model(ctx.params.resources).find()
            if (res.length == 0) {
                Model(ctx.params.resources).create(ctx.request.body)
                ctx.body = {
                    code: 0,
                    msg: '添加佣金成功'
                }
                return 
            } else {
                ctx.body = {
                    code: 0,
                    msg: '佣金比例已经存在,请修改佣金比例'
                }
                return
            }
        }
         Model(ctx.params.resources).create(ctx.request.body)
                ctx.body = {
                    code:0,
                    msg:'添加成功'
                }
         //创建默认佣金的接口默认只能调用一次,就是系统初始化的时候
    
    })
    router.get('/list', async ctx => {
        //通用的获得列表的接口
        const model = Model(ctx.params.resources)
        if (ctx.params.resources == 'category') {
            let list = await model.find()
            list.sort((a, b) => b.selectId - a.selectId)
            ctx.body = {
                code: 0,
                msg: '获取列表成功',
                data: list
            }
            return false
        }
        
        //如果是获得商品的分类还需要带上分类的名字
        if(ctx.params.resources == 'comities'){
            // queryOptions.populate= 'parentCategory'
            console.log(ctx.query.id)
            if(ctx.query.id==1){
                let list = await model.find({
                    status:1,
                  
                }).populate({
                    path:'parentCategory',
                })
                ctx.body = {
                    code: 0,
                    msg: '获取列表成功',
                    data: list
                }
                return 
            }
            if(ctx.query.id!='undefined'){
                let list = await model.find({
                    status:1,
                    parentCategory:ctx.query.id
                }).populate({
                    path:'parentCategory',
                })
                ctx.body = {
                    code: 0,
                    msg: '获取列表成功',
                    data: list
                }
             
            }else{
                let list = await model.find({
                    status:1,
                  
                }).populate({
                    path:'parentCategory',
                })
                ctx.body = {
                    code: 0,
                    msg: '获取列表成功',
                    data: list
                }
                return 
            }
           
            
        }
    
    })
    router.get('/getInfo', async ctx => {
        const model = Model(ctx.params.resources)
        const res = await model.findById(`${ctx.query.id}`)
        ctx.body = {
            code: 0,
            msg: '获取信息成功',
            data: res
        }
    })
    router.get('/delete', async ctx => {
        console.log('调用通用删除接口')
        // console.log(ctx.query.id)
        //此处如果删除的是分类,先拿分类的id查找是否存在商品
        const model = Model(ctx.params.resources)
        console.log(model)
        // console.log(ctx.query.id)
        await model.findByIdAndRemove(ctx.query.id)
        ctx.body = {
            code: 0,
            msg: '删除成功'
        }
    })
    router.post('/edit', async ctx => {
        const model = Model(ctx.params.resources)
        await model.findByIdAndUpdate(ctx.request.body.id, {
            $set: ctx.request.body
        })
        ctx.body = {
            code: 0,
            msg: '编辑成功'
        }
    })
    app.use(router.routes()).use(router.allowedMethods())
}