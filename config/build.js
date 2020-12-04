let projectName = process.argv[2]
let fs = require('fs')
let envir = require(`../environment/${projectName}/pro.env`)
console.log('process.argv', process.argv)
console.log('process.env.VUE_APP_BASEURL',envir, envir.VUE_APP_BASE_URL)
fs.writeFileSync('./config/project.js', 
`module.exports={name: '${projectName}',
api: '${envir.VUE_APP_BASE_URL}',
speApi: '${envir.VUE_APP_SPECILA_API}' ,
router: '${envir.VUE_APP_ROUTER_BASE_URL}',
appid: '${envir.VUE_APP_APPID}',
appkey: '${envir.VUE_APP_APPKEY}'}`)

let exec = require('child_process').execSync;
exec('npm run build', {stdio: 'inherit'});


