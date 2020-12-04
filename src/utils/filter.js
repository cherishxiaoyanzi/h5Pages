/**
 * 过滤器
 */
const filters = {
  /**
   * 格式化手机号码 334
   */
  formatPhone: (phone) => {
    const tel = filters.trim(phone, 'g')
    return tel.substring(0, 3) + ' ' + tel.substring(3, 7) + ' ' + tel.substring(7, 11)
  },
  /**
  * 去掉字符串中所有的空格
  * @param {String} str 需要格式化的字符串
  * @param {String} isGlobal [g] 是否去掉所有的空格
  */
 trim: (str, isGlobal) => {
   let result = str.replace(/(^\s+)|(\s+$)g/, '')
   if (isGlobal && isGlobal.toLowerCase() === 'g') return result.replace(/\s/g, '')
   return result
 },
 /**
  * 格式化秒为时分秒
  */
 formateTime: (times) => {
  //小时
  var hour = times / (60*60)
  var hours = parseInt(hour);
  if (hours < 10) {
   hours = "0" + hours;
  }
  //分钟
  var minute = times / 60;
  var minutes = parseInt(minute);
  if (minutes < 10) {
      minutes = "0" + minutes;
  }
  //秒
  var second = times % 60;
  var seconds = Math.round(second);
  if (seconds < 10) {
      seconds = "0" + seconds;
  }
  return hours+":"+minutes+":"+seconds
}

}
export { filters } 