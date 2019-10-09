module.exports = app => {
    const Router = require('koa-router')
    const header = require('../../models/headers')
    const order = require('../../models/order')
    const formatDate = require('../../utils/util')
    const Excel = require('exceljs')
    const fs = require('fs')
    const router = new Router({
        prefix: '/adminheader'
    })
    router.get('/noHeader', async ctx => {
        //此接口返回没有审核通过的团长
        const res = await header.find({
            status: 0
        })
        ctx.body = {
            code: 0,
            data: res
        }
    })
    router.get('/isHeader', async ctx => {
        ///此接口返回已经是团长的用户
        const res = await header.find({
            status: 1
        })
        ctx.body = {
            code: 0,
            data: res
        }
    })
    router.post('/setHeader', async ctx => {
        //此接口为废弃团长的接口,将团长的id废弃
        const {
            userId,
            status
        } = ctx.request.body
        await header.findByIdAndUpdate(userId, {
            $set: {
                status
            }
        })
        ctx.body = {
            code: 0,
            msg: "设置团长成功"
        }

    })
    router.get('/getHeaderOrder', async ctx => {
        //接收参数
        //date:时间 - 时间
        //团长id
        //如果不传则返回数据库前十条最新数据
        let res = await order.find().populate({
            path: 'headerId'
        }).limit(10)
        ctx.body = {
            list: res
        }
    })
    function delDir(path) {
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach((file, index) => {
                let curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    delDir(curPath); //递归删除文件夹
                } else {
                    fs.unlinkSync(curPath); //删除文件
                }
            });
            // fs.rmdirSync(path);
        }
    }
    router.delete('/deleteOrderXlsx', async ctx => {
        delDir('public');
    })
    router.get('/exportOrder', async ctx => {
        //导出订单接口，接三个参数 团长 起始时间和结束结束时间 测试阶段不做限制
        let res = await order.find().populate({
            path: 'headerId'
        })
        let arr = res.map(item => {
            return {
                list: item.list,
                orderNo: item.orderNo,
                time: formatDate(item.time),
                money: item.money
            }
        })
        let workbook = new Excel.Workbook()
        let ws1 = workbook.addWorksheet('我爱学习')
        ws1.addRow(["订单号", "下单时间", "订单金额", "商品"])
        ws1.mergeCells('D1:F1');
        arr.map(i => {
            let arr = []
            arr.push(i.orderNo)
            arr.push(i.time)
            arr.push(i.money)
            i.list.map(item => {
                arr.push(`${item.name} 数量：${item.num}`)
            })
            ws1.addRow(arr)
        })
        workbook.xlsx.writeFile(`public/a.xlsx`)
        ctx.body = {
            code: 0,
            data: arr
        }
    })
    app.use(router.routes()).use(router.allowedMethods())
}