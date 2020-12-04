let projectName = process.argv[2]//是通过拿到环境参数来控制向project.js文件写入一个运行的名称
let fs = require('fs')
let envir = require(`../environment/${projectName}/dev.env`)
console.log('process.argv', process.argv)
console.log('process.env.VUE_APP_BASEURL', envir, envir.VUE_APP_BASE_URL)
//写入
fs.writeFileSync('./config/project.js', 
`module.exports={name: '${projectName}',
api: '${envir.VUE_APP_BASE_URL}',
speApi: '${envir.VUE_APP_SPECILA_API}' ,
router: '${envir.VUE_APP_ROUTER_BASE_URL}',
appid: '${envir.VUE_APP_APPID}',
appkey: '${envir.VUE_APP_APPKEY}'}`)
let exec = require('child_process').execSync;
exec('npm run serve', {stdio: 'inherit'});