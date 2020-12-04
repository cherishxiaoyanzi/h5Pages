# h5

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
### npm run build-pro 项目目录名称（可以打包线上当前的项目）
```
npm run build-pro projectA
```
### npm run build-test 项目目录名称（可以打包测试当前的项目）
```
npm run build-test projectA
```
### npm run dev 项目目录名称（可以启动当前的项目）
```
npm run dev projectA
```
#### config目录是不同命令对应的执行js
#### projectConfig每个项目的配置 
##### 每个项目的配置入口，输出,代理，别名，插件等都是在projectConfig文件下单独建一个项目目录对应的名称文件，按照已有的如projectA去配置，然后在config目录下projectsConfig.js中按照已有的方式引入即可
#### environment是对应不同环境变量配置，每个项目都新建一个以项目目录名称为名称的目录，里面放置项目的dev，test，production环境变量配置
#### npm run analyz-test 项目目录名称（可以启动测试环境当前项目性能分析）
#### npm run analyz-pro 项目目录名称（可以启动线上环境当前项目性能分析）
### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```
