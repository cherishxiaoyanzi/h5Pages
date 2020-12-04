<template>
<div class="home">
  <img v-if="challengeResult == 'true'" width="100%" height="100%" src="../assets/img/bg.jpg">
  <img v-else width="100%" height="100%" src="../assets/img/bg.jpg">
  <div class="report_content" >
    <div class="report_audio">
      <div class="report_audio_head">
        <div class="audio_title"><span class="block_icon"></span>音频背诵</div>
        <div class="audio_code">本次得分<span v-if="initData">{{initData.challengeScore}}</span></div>
      </div>
      <div class="audio_btn">
        <audio id="myAudio"><source v-if="initData" :src="initData.audioUrl" type="audio/mpeg" /></audio>
        <div class="audio_play_btn" @click="playAudio" :class="{'audio_stop_btn': audioPlay}"></div>
        <div ref="playProgress" class="play_progress">
          <span ref="current_progress" :style="{width: progressWidth +'px'}" class="current_progress"></span>
        </div>
        <div class="audio_time">{{this.duration - this.currentTime | formateTime}}</div>
      </div>
    </div>
    <div class="circle_icon left_circle_icon"></div>
    <div class="circle_icon right_circle_icon"></div>
    <div  class="report_detail">
      <div class="audio_title"><span class="block_icon"></span>背诵详情</div>
      <template v-if="initData">
        <div class="report_txt" v-if="(wrongWord && wrongWord.length > 0) || (remindWord && remindWord.length > 0)">
          <dl v-if="wrongWord && wrongWord.length > 0" class="special_txt">
          <dt>背错字</dt>
          <dd ref="wrong_dom" :class="{'close_all' : wrongCloseAll}">
              <span v-for="(item,index) in wrongWord" :key="index">{{item}}</span>
              <!--<span>反</span>
              <span>钢叉</span>
              <span>项带银圈</span>
              <span>胯下</span>
              <span>反</span>
              <span>钢叉</span>
              <span>项带银圈</span>
              <span>胯下</span>
              <span>反</span>-->
          </dd>
          </dl>
          <div v-if="wrongShow" class="up_down" @click="upDown(1)">{{wrongupDownTxt}}<i :class="{'up_icon' : !wrongCloseAll}"></i></div>
          <img v-if="(wrongWord && wrongWord.length > 0) && (remindWord && remindWord.length > 0)" class="content_bg" src="../assets/img/content_bg.png" />
          <dl v-if="remindWord && remindWord.length > 0" class="special_txt">
            <dt>提示字</dt>
            <dd ref="remind_dom" :class="{'close_all' : remindCloseAll}">
            <span v-for="(item,index) in remindWord" :key="index">{{item}}</span>
              <!--<span>反从他的胯下</span>
              <span>反从他的胯下</span>
              <span>钢叉</span>
              <span>项带银圈</span>
              <span>钢叉</span>
              <span>项带银圈</span>-->
            </dd>
          </dl>
          <div v-if="remindShow" class="up_down" @click="upDown(2)">{{remindupDownTxt}}<i :class="{'up_icon' : !wrongCloseAll}"></i></div>
        </div>
        <div class="report_detail_text">
          <h2>{{initData.article.title}}</h2>
          <span class="author"><span class="dynasty" v-if="initData.article.dynasty">{{initData.article.dynasty}}</span>{{initData.article.author}}</span>
          <!--<p>深蓝的天空中挂着一轮<span class="wrong_text">金</span>黄的圆月，下面是海边的沙地，都种着一望无际的<span class="remind_text">碧绿</span>的西瓜。其间有一个十一二岁的少年，项带银圈，手捏一柄钢叉，向一匹猹用力的刺去。那猹却将身一扭，反从他的胯下逃走了。</p>-->
          <template v-if="initData.subCategory == 'poetry'">
            <div v-for="(item,index) in reportWord" :key="index" class="poetry_style" v-html="item.text"></div>
          </template>
          <template v-else>
            <div v-for="(item,index) in reportWord" :key="index" class="detaile_content" v-html="item.text"></div>
          </template>
        </div>
      </template>
    </div>
  </div>
  <div class="clock_btn_bg">
    <div class="clock_btn" @click="goShare">最后一步，朋友圈分享完成打卡</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      dataImg:'',
      initData: null,
      myAudio: null,
      totalWidth: 0, // 进度条总长度
      progressWidth: 0, // 当前进度条长度
      duration:0, // 音频总时间
      currentTime: 0, // 当前播放的时间
      audioPlay: false, // 音频播放
      wrongupDownTxt: '展开', // 背错字默认
      wrongShow: false, // 背错字是否显示展开或者收起
      remindupDownTxt: '展开', // 提示字默认
      remindShow: false, // 提示字是否显示展开或者收起
      wrongCloseAll: false, // 背错字是否显示所以文字
      remindCloseAll: false, // 提示字是否显示所以文字
      wrongWord: [], // 错别字
      remindWord: [], // 提示字
      reportWord: [], // 文章内容
      activeId: '', // 活动id
      reportId: '', // 学情报告id
      userSource: 'GPUC', // 用户来源
      challengeResultDetailId: '', //挑战结果报告id
      token: '',
      sid: '', // 埋点参数来源
      challengeResult: 'true' , // 是否闯关成功
    }
  },
   created() {
    this.token = decodeURIComponent(this.$route.query.token)
    this.activeId = this.$route.query.activityId || '' // 活动id
    this.sid = this.$route.query.sid || '' // 用户来源
    this.challengeResult = this.$route.query.challengeResult || 'true' // 是否闯关成功
    this.challengeResultDetailId = this.$route.query.challengeResultDetailId //挑战结果报告id
    localStorage.setItem('token', this.token)
  },
  async mounted() {
    // 获取页面数据
    await this.getInitData()
    this.$nextTick(()=>{
      this.totalWidth = this.$refs.playProgress ? this.$refs.playProgress.offsetWidth : 0
      console.log('this.totalWidth', this.totalWidth)
      this.myAudio = document.getElementById("myAudio")
      this.duration = this.initData.reciteTime
      this.openClose()
      this.colorReplace()
    })
    
  },
  beforeDestroy(){
    document.removeEventListener('visibilitychange',this.showHide)
  },
  methods: {
    // 获取页面数据
    async getInitData () {
      // let params = {
      //   challengeResultDetailId: this.challengeResultDetailId, // 挑战结果报告id
      //   userSource: this.userSource //⽤户来源。 
      // }
      // let res = await this.$api.getReport(params)
      let res = {
          "code" : 200,
          "message" : "操作成功",
          "data" : {
            "challengeScore" : 0,
            "challengeStar" : 3,
            "tipCount" : 24,
            "reciteTime" : 11,
            "audioUrl" : "http://kjds-web-fz.oss-cn-beijing.aliyuncs.com/moka/a31ec19dd9a340288e5b2ece45db0c46.mp3",
            "subCategory" : "poetry",
            "article" : {
              "dynasty" : "[宋]",
              "author" : "李清照",
              "title" : "夏日绝句",
              "content" : [ {
                "text" : "生当作人杰，"
              }, {
                "text" : "死亦为鬼雄。"
              }, {
                "text" : "至今思项羽，"
              }, {
                "text" : "不肯过江东。"
              } ]
            },
            "wrongWords" : "",
            "tipWords" : [ {
              "index" : "0",
              "word" : "生"
            }, {
              "index" : "1",
              "word" : "当"
            }, {
              "index" : "2",
              "word" : "作"
            }, {
              "index" : "3",
              "word" : "人"
            }, {
              "index" : "4",
              "word" : "杰"
            }, {
              "index" : "5",
              "word" : " "
            }, {
              "index" : "7",
              "word" : "死"
            }, {
              "index" : "8",
              "word" : "亦"
            }, {
              "index" : "9",
              "word" : "为"
            }, {
              "index" : "10",
              "word" : "鬼"
            }, {
              "index" : "11",
              "word" : "雄"
            }, {
              "index" : "12",
              "word" : " "
            }, {
              "index" : "14",
              "word" : "至"
            }, {
              "index" : "15",
              "word" : "今"
            }, {
              "index" : "16",
              "word" : "思"
            }, {
              "index" : "17",
              "word" : "项"
            }, {
              "index" : "18",
              "word" : "羽"
            }, {
              "index" : "19",
              "word" : " "
            }, {
              "index" : "21",
              "word" : "不"
            }, {
              "index" : "22",
              "word" : "肯"
            }, {
              "index" : "23",
              "word" : "过"
            }, {
              "index" : "24",
              "word" : "江"
            }, {
              "index" : "25",
              "word" : "东"
            }, {
              "index" : "27",
              "word" : ""
            } ]
          },
          "success" : true
        }
      if (res.code != 200) {
        this.$toast({
          message: res.message,
          duration: 3000,
          forbidClick: true
        })
      }
      this.initData = res.data
      this.wrongWord = this.initData.wrongWords ? this.initData.wrongWords.map((item) =>{
        return item.word
      }).filter((item) => {
        return item.trim()
      }) : []
      this.remindWord = this.initData.tipWords ? this.initData.tipWords.map((item) =>{
        return item.word
      }).filter((item) => {
        return item.trim()
      }) : []
    },
    // 播放音频
    playAudio () {
      this.myAudio.loop = false;
      // 避免出现音频没有加载出来获取时间为NaN
      this.myAudio.oncanplay = () => {
        this.duration = this.myAudio.duration
        console.log('this.myAudio.duration', this.myAudio.duration)
      }
      let _this=this
      if (this.audioPlay) {
        this.myAudio.pause()
        this.audioPlay = !this.audioPlay
      }else {
        this.myAudio.addEventListener("play",() => {
          var timer = setInterval(() => {
            _this.currentTime = _this.myAudio.currentTime
            _this.progressWidth = Math.round((_this.totalWidth * _this.currentTime) / _this.duration)
              if (_this.myAudio.paused) {
                  clearInterval(timer);
              }
          },1000);
        })
        document.addEventListener('visibilitychange', this.showHide);
        this.myAudio.play()
        this.audioPlay = !this.audioPlay
      }
      this.myAudio.addEventListener('ended', () => {
        this.audioPlay = false
      })
    },
    // 判断页面当前是显示还是在后台运行
    showHide(){
      // 用户离开了当前页面
      if (document.visibilityState === 'hidden') {
        this.myAudio.pause();//暂停
      }
      // 用户打开或回到页面
      if (document.visibilityState === 'visible') {
        this.myAudio.play();//播放
      }
    },
    // 判断是否显示展开或者收起
    openClose() {
      let wrongDom = this.$refs.wrong_dom
      let remindDom = this.$refs.remind_dom
      let wrongH = wrongDom ? wrongDom.offsetHeight : 0
      let remindH = remindDom ? remindDom.offsetHeight : 0
      console.log('wrongH', wrongH, remindH)
      if (wrongH > 44) {
        this.wrongShow = true // 显示展开收起文字
        this.wrongCloseAll = true // 超过两行收起
      }
      if (remindH > 44) {
        this.remindShow = true
        this.remindCloseAll = true
      }
    },
    // 判断文字是展开还是收起
    upDown (flag) {
      if (flag == 1) { // 背错字
        this.wrongupDownTxt = this.wrongupDownTxt == '展开' ? '收起' : '展开'
        //判断页面显示的文字是收起还是展开
        this.wrongupDownTxt == '收起' ? this.wrongCloseAll=false : this.wrongCloseAll=true
      } else if (flag == 2) { // 提示字
        this.remindupDownTxt = this.remindupDownTxt == '展开' ? '收起' : '展开'
        //判断页面显示的文字是收起还是展开
        this.remindupDownTxt == '收起' ? this.remindCloseAll=false : this.remindCloseAll=true
      }
    },
    // 文章中标注的文字
    colorReplace () {
      let wrongArr = this.wrongWord // 错误文字转数组
      let remindArr = this.remindWord // 提示文字转数组
      // let remindArr = ['秋天']
      console.log('arr', wrongArr)
      let newwrongArr = wrongArr ? wrongArr.map((item) => { // 错误文字对应颜色
         return {
          [item]: '#FF5000'
        }
      }) : []
      let newremindArr = remindArr ? remindArr.map((item) => { // 提示文字对应颜色
        return {
          [item]: '#007AFF'
        }
      }) : []
      let articleArr = this.initData.article ? this.initData.article.content : []
      this.reportWord = articleArr ? articleArr.map((item) => {
        let text = this.replaceWord(item.text,newremindArr,remindArr,newwrongArr, wrongArr)
        let lasteText = this.replaceWord(text, newwrongArr,wrongArr)
        return {
          text: lasteText
        }
      }) : []
    },
    // 文字替换initData.article.content
    replaceWord(reportWord,newWord, oldWord) {
      let words = reportWord
      for (let i = 0; i < newWord.length; i++){ // 替换错误文字
        let color_temp = newWord[i][oldWord[i]]
        let replaceString = `<span style="color:${color_temp}">${oldWord[i]}</span>`
        words = words.replace(RegExp(oldWord[i],'g'), replaceString)
      }
      return words
    },
    // 去生成海报分享打卡
    goShare() {
      this.$router.push({name:'Poster',
      query:{
            'activityId': this.activeId, 
            'reportId': this.challengeResultDetailId,
            'sid': this.sid
            }})
    },
  },
}
</script>

<style lang="less" scoped>
.text {
  font-size: 18px;
}
.qrcodeposter_wrap{
  background-image: url('../assets/img/bg.jpg');
}
.home{
  background-color: #FEDB56;
}
.report_content{
  position: relative;
  margin-top: -38px;
  padding: 0 18px 98px;
  // margin-bottom: 80px;
}
.block_icon{
  display: inline-block;
  width: 8px;
  height: 16px;
  border-radius: 0px 2px 2px 0px;
  background-color: #FF8810;
  vertical-align: middle;
  margin-right: 8px;
}
.audio_title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  font-family:PingFangSC-Medium,PingFang SC;
}
.report_audio{
  background-color: #fff;
  border-radius: 16px;
  padding: 16px 0 24px 0;
  .report_audio_head{
    line-height: 21px;
    display: flex;
    justify-content: space-between;
    .audio_code{
      margin-right: 16px;
      font-size: 11px;
      color: #3C3C5C;
      span{
        font-size: 24px;
        color: #333;
        font-weight: 600;
        vertical-align: middle;
        margin-left: 3px;
      }
    }
  }
  .audio_btn{
    margin-top: 20px;
    >div{
      display: inline-block;
      vertical-align: middle;
    }
  }
  .audio_play_btn{
    width: 16px;
    height: 16px;
    background: url('../assets/img/play_audio.png') no-repeat;
    background-size: 100%;
  }
  .audio_stop_btn{
    background: url('../assets/img/stop_audio.png') no-repeat;
    background-size: 100%;
  }
  .play_progress{
    width: 180px;
    height: 4px;
    margin:0 20px 0 16px;
    background-color:#ECECEC ;
    position: relative;
    border-radius: 8px;
    .current_progress{
      display: inline-block;
      background-color:#FF8810 ;
      height: 4px;
      width: 20%;
      position: absolute;
      left: 0;
      border-radius: 8px;
    }
  }
  .audio_time{
    font-size: 11px;
    color: #3C3C5C;
    line-height: 16px;
    font-family: 'PingFangSC-Regular'
  }
}
.circle_icon{
  position: absolute;
  top: 79px;
  width: 24px;
  height: 60px;
  background: url('../assets/img/icon_circle.png') no-repeat;
  background-size: 100%;
}
.left_circle_icon{
  left:38px ;
}
.right_circle_icon{
  right:38px ;
}
.report_detail{
  background-color: #fff;
  border-radius: 16px;
  margin-top: 17px;
  padding: 28px 0;
  .audio_title{
    text-align: left;
    line-height: 21px;
  }
}
.report_detail_text{
  padding: 0 16px;
  h2{
    font-size: 24px;
    font-weight: 500;
    line-height: 28px;
    color: #333333;
    margin-bottom: 4px;
    font-family:'STKaitiSC-Regular,STKaitiSC';
  }
  .author{
    font-size: 17px;
    color: #999999;
    display: inline-block;
    margin-bottom: 12px;
    font-family:'STKaitiSC-Regular,STKaitiSC';
  }
  .detaile_content{
    text-indent: 1cm;
    text-align: left;
    font-size: 20px;
    line-height: 28px;
    color: #333333;
    font-family: 'STKaitiSC-Regular, STKaitiSC';
    .wrong_text{
      color:#FF5000 ;
    }
    .remind_text{
      color: #007AFF;
    }
  }
}
.clock_btn_bg{
    background-color: #fff;
    height:80px;
    width: 375px;
    position: fixed;
    bottom: 0;
  }
.clock_btn{
  width:294px;
  height:48px;
  margin: 16px auto 0;
  background:#FEDB56;
  border-radius:24px;
  font-size: 16px;
  font-weight: 500;
  color: #744704;
  line-height: 48px;
}
.report_txt{
  padding-top: 12px;
  padding-bottom: 9px;
  background-color: #F9F8EE;
  border-radius: 12px;
  margin: 17px 16px 16px;
  .content_bg{
    width: 307px;
    height: 16px;
  }
}
.special_txt{
  text-align: left;
  display: flex;
  padding: 0 16px;
  &:last-child{
    padding-bottom: 16px;
  }
  dt{
    font-size: 15px;
    color: #333;
    font-weight: 500;
    line-height: 21px;
    width: 48px;
    margin-right: 12px;
    font-family:PingFangSC-Medium,PingFang SC;
  }
  dd{
    font-size: 16px;
    color: #666;
    font-weight: 400;
    line-height: 22px;
    flex: 1;
    // height: 44px;
    overflow: hidden;
    font-family:PingFangSC-Regular,PingFang SC;
    span{
      display: inline-block;
      margin-right: 12px;
    }
  }
  .close_all{
    height: 44px;
  }
}
.up_down{
  font-size: 10px;
  color: #999999;
  line-height: 10px;
  margin-top: 15px;
  i{
    width: 6px;
    height: 7px;
    display: inline-block;
    margin-left: 6px;
    background: url("../assets/img/down.png") no-repeat;
    background-size: 100%;
  }
  .up_icon{
    background: url("../assets/img/up.png") no-repeat;
    background-size: 100%;
  }
}
.poetry_style{
  font-size:20px;
  line-height:28px;
  letter-spacing:7px;
  color: #333;
  font-family:'STKaitiSC-Regular,STKaitiSC';
}
.dynasty{
  display: inline-block;
  margin-right: 7px;
}
</style>
