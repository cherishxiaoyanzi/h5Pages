<template>
  <div class="poster">
    <div style="position:fixed;top:-2000px">
      <!--style="position:fixed;top:-2000px" <div class="qrcodeposter_wrap" :style="{backgroundImage: 'url(' + posterUrla + ')', backgroundSize:'100% 100%', backgroundRepeat: 'no-repeat'}" id="canvasPoster">-->
      <div class="qrcodeposter_wrap" id="canvasPoster">
        <img class="poster_pic" crossOrigin="anonymous" :src="posterUrl+'?v='+ts" />
        <div class="study">我已累计学习第 <span>{{day}}</span> 天，邀您参加</div>
        <div class="poster_footer">
          <div class="poster_footer_txt">
            <div class="poster_footer_txt1">
              <span>0</span>元限时免费学习古诗词
            </div>
            <div  class="poster_footer_txt2">
              <img class="arrow_bg" src="../assets/img/changan_bg.png" />
              <p>长按扫码立即参与，你也能领奖品</p>
            </div>
          </div>
          <div class="poster_qrcode"><img crossOrigin="anonymous" :src="qrcode_url+'?v='+ts" /></div>
        </div>
      </div>
    </div>
  
    <div class="save_remind"><van-icon name="warning" /><span>记得保存学习海报，分享朋友圈完成打卡呦！</span></div>
    <div class="poster_bg">
      <img class="poster_img" ref="poster" :src="dataImg" v-if="dataImg" alt>
      <p class="save_pic">长按保存图片</p>
    </div>
    <div class="share_text">
      <p class="copy_remind">朋友圈分享参考文字</p>
      <p class="share_content" id="share_content">{{shareText}}</p>
      <textarea readonly id="input" style="z-index:-100;opacity:0;height:0"></textarea>
    </div>
    <div class="copy_btn_wrap">
      <div class="copy_btn" @click="copy">复制文字</div>
    </div>
    <toast :showtoast="showToast" @closetoast="closeToast"></toast>
  </div>
</template>
<script>
import Toast from '../../../components/toast'
import html2canvas from "html2canvas";
export default {
  name: 'Poster',
  components: {
    'toast': Toast
  },
  data() {
    return {
      dataImg: '', //生成海报图
      day: 1, // 学习第几天
      activeId: '', // 活动id
      challengeResultDetailId: '',
      sid: '', // 埋点参数来源
      posterBg: [], // 生成海报的背景图
      textList: [], // 分享文案
      qrcode_url: '', // 二维码地址
      ts:0, // 时间戳
      showToast: false, // 是否显示提示框
      posterUrl: require('../assets/img/bg.jpg'), // 海报路径
      shareText: '测试文案1', // 分享文案
    }
  },
  async created() {
    this.ts = new Date().getTime()
    this.activeId = this.$route.query.activityId || 1
    this.challengeResultDetailId = this.$route.query.challengeResultDetailId || 2
    this.sid = this.$route.query.sid || ''
    this.textList = [
        '测试文案1',
        '测试文案2',
        '测试文案3',
        '测试文案4',
        '测试文案5',
        '测试文案6',
        '测试文案7'
        ]
  },
  async mounted() {
    // let params = {
    //   activity_id: this.activeId, // 活动id
    //   report_id: this.challengeResultDetailId, //学情报告id
    // }
    await this.getPosterBg()
  //  let data = await this.$api.finishPunch(params)
  let data = {
    data:{
      punch_card:'1',
      code_url: require('../assets/img/bg.jpg')
    }
  }
   this.day = data.data.punch_card
   this.qrcode_url = data.data.code_url
   let week = new Date().getDay()
   console.log('week', week)
   this.showPoster(week)
    // 保证生成海报前所有图片都加载出来了
    let imgs = [this.qrcode_url,this.posterUrl]
    let promiseAll = []
    let img = []
    imgs.map((item, index) => {
      debugger
      promiseAll[index] = new Promise((resolve) => {
        img[index] = new Image();
        // img[index].crossOrigin = 'anonymous'
        img[index].src = item;
        img[index].onload=()=>{
          console.log('img[index].src', img[index].src)
          resolve(img[index])
        }
      })
    })
   this.$nextTick(()=>{
      Promise.all(promiseAll).then(()=>{
          //全部加载完成
          //设置延迟去调用绘制海报方法，避免dom元素还没加载完就绘制海报导致图片空白问题
          this.$toast({
            message: '图片加载中...',
            duration: 1700,
            forbidClick: true
          })
          setTimeout(()=> {
            this.createPoster()
          },1500)
      })
   })
  },
  methods: {
    // 获取海报背景图
    async getPosterBg() {
      // let params = {
      //   'activity_id': this.activeId, // 活动id
      // }
      // let data = await this.$api.getSharePicList(params)
      let data = {data:[
        {'PicUrl':require('../assets/img/bg.jpg')},
        {'PicUrl':require('../assets/img/bg.jpg')},
        {'PicUrl':require('../assets/img/bg.jpg')},
        {'PicUrl':require('../assets/img/bg.jpg')}
        ]}
      this.posterBg = data.data && data.data.length > 0 ? data.data.map((item) => {
        return item.PicUrl
      }) : []
      // 获取一周要显示的海报图
      this.getAllBg(0,1)
    },
    // 将接口给到的海报拼接成7天显示的海报数组
    getAllBg(i, j){
        let n = 7
        if (this.posterBg.length < n) {
          this.posterBg[n-this.posterBg.length+j] = this.posterBg[i]
          i++
          j=j+2
          this.getAllBg(i, j)
        }
      },
    // 创建海报
    createPoster() {
      debugger
      // 避免生成的海报被截取一半
      window.scrollTo(0, 0)
      const poster = document.getElementById("canvasPoster");
      console.log('poster', poster)
      html2canvas(poster, {
        backgroundColor: "#fff",
        useCORS: true,
        // timeout: 500, // 加载延时
        allowTaint: true,
      }).then((canvas) => {
        console.log('canvas', canvas)
        this.dataImg = canvas.toDataURL("image/jpeg");
      });
    },
    // 海报展示顺序
    showPoster(week) {
      // 如果是星期天则week值改为7
      week = week == 0 ? week = 7 : week
      // 将星期以及海报背景图和分享文案合成二维数组
      let arr = this.posterBg && this.posterBg.map((item,index)=>{
        return [index+1, [item,this.textList[index]]]
      })
      console.log('arr', arr)
      const actions = new Map(arr)
      console.log('actions', actions, week)
      let action = actions.get(week) || actions.get('default')
      this.posterUrl = action && action[0]
      this.shareText = action && action[1]
    },
    copy() {
      var text = document.getElementById("share_content").innerText;
      var input = document.getElementById("input");
      input.value = text; // 修改文本框的内容
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
       this.showToast = true
    },
    closeToast(value){
      this.showToast = value
    }
  }
}
</script>
<style lang="less" scoped>
.save_remind{
  width:375px;
  height:48px;
  line-height: 48px;
  background:rgba(241,50,50,.1);
  font-size: 14px;
  color: #F13232;
  text-align: left;
  padding-left: 16px;
  span{
    display: inline-block;
    margin-left: 6px;
    vertical-align: middle;
  }
}
.poster_bg{
  width: 375px;
  height: 558px;
  background: url('../assets/img/poster_bg.png') no-repeat;
  background-size:100%;
  padding: 24px 58px 16px;
}
.poster_img{
  width:270px;
  height: 480px;
  box-shadow:0px 2px 8px 0px rgba(55,118,243,0.2);
}
.save_pic{
  font-size: 16px;
  color: #333;
  font-weight: 500;
  line-height: 22px;
  margin-top: 16px;
}
.share_text{
  width: 343px;
  height: 150px;
  margin: 24px 0 0 16px;
  padding: 16px;
  text-align: left;
  background-color: rgba(255,255,255,1);
  background: url('../assets/img/yinhao_left.png') 17px 46px no-repeat,
              url('../assets/img/yinhao_right.png') 312px 122px no-repeat;
  background-size: 15px 12px;
  box-shadow:0px 2px 8px 0px rgba(0,0,0,0.1);
  border-radius: 4px;
}
.copy_remind{
  font-family:PingFangSC-Medium,PingFang SC;
  font-size: 14px;
  color: #666;
  font-weight: 500;
  line-height: 22px;
}
.share_content{
  font-size: 16px;
  color: #333;
  line-height: 24px;
  margin-top: 28px;
}
.copy_btn_wrap{
  padding-bottom: 24px;
}
.copy_btn{
  width:176px;
  height:40px;
  line-height: 40px;
  border-radius:24px;
  border:1px solid rgba(55,118,243,1);
  font-size:14px;
  font-weight:500;
  color: #3776F3;
  margin: 24px 0 0 100px;
}
.qrcodeposter_wrap{
  width: 375px;
  height: 667px;
  // background-image: url('../assets/img/poster_1.png');
  // background-size: 100%;
  padding-top: 12px;
  position: relative;
}
.poster_pic{
  width: 375px;
  height: 667px;
  position: absolute;
  top:0;
  left: 0;
}
.poster_qrcode{
  width: 80px;
  height: 80px;
  border: 2px solid #666;
  margin-top: -3px;
  margin-left: 33px;
  vertical-align: bottom;
  img{
    width: 100%;
  }
}
.study{
  width:236px;
  height:40px;
  line-height: 40px;
  background:rgba(255,255,255,0.8);
  box-shadow:0px 0px 8px 0px rgba(0,0,0,0.1);
  border-radius:0px 100px 100px 0px;
  font-size: 14px;
  color: #333;
  position:relative;
  span{
    color: #F13232;
    font-weight: 500;
  }
}
.poster_footer{
  position: absolute;
  bottom: 0;
  width:375px;
  height:124px;
  background-color: #fff;
  text-align: left;
  padding: 25px 18px 25px 16px;
  display: flex;
}
.poster_footer_txt1{
  font-size: 18px;
  color: #333;
  line-height: 25px;
  font-weight: 500;
  margin-bottom: 8px;
  vertical-align: baseline;
  span{
    font-size: 35px;
    height: 29px;
    display: inline-block;
    line-height: 29px;
    color: #F13232;
    margin-right: 4px;
    vertical-align: baseline;
    font-family:PingFangSC-Medium,PingFang SC;
  }
}
.poster_footer_txt2{
  width:228px;
  height:26px;
  line-height: 26px;
  vertical-align: middle;
  font-size:14px;
  padding-left: 5px;
  position: relative;
  // background: url('../assets/img/changan_bg.png') no-repeat;
  // background-size: 100%;
  color: #fff;
  border-right: 0;
  p{
    position: relative;
    z-index: 2;
  }
  .arrow_bg{
    width:228px;
    height:26px;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>