import { directives } from '../utils/directives'
import { filters } from '../utils/filter'
import utils from '../utils/index'

export default {
  install: (Vue) => {
    // Vue.prototype.$get = get
    // Vue.prototype.$post = post
    Vue.prototype.$_ = utils._ // lodash
    Vue.prototype.$utils = utils.tool // 工具类方法
    Vue.prototype.$md5 = utils.MD5 // md5

    /**
     * 全局指令注册
     * */
    console.log('directives', directives)
    Object.keys(directives).map(key => {
      Vue.directive(key, directives[key])
    })
     /**
     * 全局注册过滤器
     * */
    console.log('filters', filters)
    Object.keys(filters).map(key => {
      Vue.filter(key, filters[key])
    })
  }
}