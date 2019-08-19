module.exports = app => {
    const Router = require('koa-router')
    const header = require('../../models/headers')
    const router = new Router({
        prefix: '/header'
    })
    router.post('/create', async ctx => {
        //团长申请接口
        const {
            name,
            address,
            city,
            longitude,
            latitude,
            imgSrc,
            phone,
            unaddress,
        } = ctx.request.body
     let res = await header.create({
            name,
            address,
            money: 0,
            imgSr ,
            longitude,
            latitude,
            location: [longitude, latitude],
            city,
            phone,
            unaddress,
            status:0
        })
        console.log(res)
        ctx.body = {
            code: 0,
            msg: '申请成功,等待审批'
        }
    })
    router.get('/find', async ctx => {
        const {longitude,latitude} = ctx.query
     let res = await header.aggregate([
            {
                $geoNear:{
                    near:{
                        type:'Point',
                        coordinates:[
                           parseFloat(longitude),parseFloat(latitude)
                        ]
                    },
                    distanceField:'distance',
                    spherical:true,
                    maxDistance:10000
                }
            }
        ])
        // let res = await header.find({
        //     'location': {
        //         $near: {
        //             $geometry: {
        //                 type: 'Ponint',
        //                 coordinates: [113.3772, 23.28]
        //             },
        //             $maxDistance: 1000
        //         }
        //     }
        // })
        console.log(res)
        ctx.body = {
              code:0,
              data:res
        }
    })
    app.use(router.routes()).use(router.allowedMethods())
}