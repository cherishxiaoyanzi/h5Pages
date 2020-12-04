import { post } from '../../../request/request'
export default {
  getData () {
    console.log(1)
    let params = {
      username: 'guoyuxin4',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      type: 1,
    }
    console.log('this111', this)
    // return post ('http://assist.xueersi.com/api/oas/login/login', params)
    return post ('/login/login', params)
  }
}
  
  // getData () {
  //   return get ('https://assist.xueersi.com/api/wx1matrix/getchatrooms?timestamp=1600673987',{ wx_id: 'wxid_vhbg4pqi0jum22' })
  // }

