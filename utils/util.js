//如果记得时间戳是毫秒级的就需要*1000 不然就错了记得转换成整型
 function formatDate(now){ 
   now = parseInt(now)
  let ow = new Date(now)
   console.log(ow)
   var year=ow.getFullYear(); 
   var month=ow.getMonth()+1; 
   var date=ow.getDate(); 
   var hour=ow.getHours(); 
   var minute=ow.getMinutes(); 
   var second=ow.getSeconds(); 
   return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
} 
module.exports = formatDate