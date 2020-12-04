<template>
  <div class="toast" v-if="show">
    复制成功
  </div>
</template>
<script>
export default {
  data () {
    return {
      show: false
    }
  },
  props:{
    showtoast:{
      type: Boolean,
      default: false
    }
  },
  watch:{
    showtoast(v,old){
      let _this=this
      // debugger
      console.log('v',v ,old)
      if (v == true) {
        this.show = v
        this.$emit('closetoast', !this.show)
      } else {
        setTimeout(()=>{
          _this.show = false
          _this.$emit('closetoast', false)
          },3000)
      }    
    }
  },
  mounted() {
    this.show = this.showtoast
  }
}
</script>
<style lang="less" scoped>
  .toast{
    font-size: 16px;
    color: #fff;
    width:200px;
    height:56px;
    line-height: 56px;
    background:rgba(0,0,0,0.8);
    border-radius:8px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    animation: showtoast .5s;
  }
  @keyframes showtoast {
    from {
      background:rgba(0,0,0,0);
    }
    to {
      background:rgba(0,0,0,0.8);
    }
  }
</style>