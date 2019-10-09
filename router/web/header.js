module.exports = app => {
    const Router = require('koa-router')
    const header = require('../../models/headers')
    const router = new Router({
        prefix: '/header'
    })
    router.get('/info',async ctx=>{
        //返回自己是团长的信息
        const {id} = ctx.query
        const res = await header.findOne({
            userId:id
        }) 
        if(res){
            ctx.body = {
                code:0,
                msg:'用户是团长',
                data:{
                    nmae:res.name,
                    address:res.address,
                    imgSrc:res.imgSrc,
                    userId:res.userId,
                    unaddress:res.unaddress
                }
            }
        }else{
            ctx.body = {
                code:-1,
                msg:"用户不是团长请申请"
            }
        }
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
            userId
        } = ctx.request.body
     let res = await header.create({
            name,
            address,
            money: 0,
            imgSrc,
            longitude,
            latitude,
            location: [longitude, latitude],
            city,
            phone,
            unaddress,
            userId,
            status:0
        })
  
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
        let arr=res.map(item=>{
              return {
                  name:item.name,
                  address:item.address,
                  imgSrc:item.imgSrc,
                  city:item.city,
                  phone:item.phone,
                  unaddress:item.unaddress,
                  userId:item._id,
                  distance:item.distance>1000?(Math.round(item.distance/100)/10).toFixed(1)+'公里':item.distance+'米'
                  
              }
        })
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
        ctx.body = {
              code:0,
              data:arr
        }
    })
    router.get('')
    app.use(router.routes()).use(router.allowedMethods())
}