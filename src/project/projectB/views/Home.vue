<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div>{{title | trim}}B</div>
    <div>{{phone|formatPhone}}</div>
    <div>ceshi{{token}}</div>
    <input v-focus />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import Api from '../api'
export default {
  name: 'Home',
  // components: {
  //   HelloWorld
  // },
  data () {
    return {
      data: '',
      title: ' ce shi  ',
      phone: '15900686720',
      token: ''
    }
  },
  mounted() {
    this.initData()
    let name = this.$utils.isIOS()
    this.token = this.$store.state.token
    console.log('name', name)
  },
  methods: {
    initData () {
      let res = this.$api.getData()
      this.data = res
    }
  },
}
</script>
<style>
  html {
    margin: 10px;
  }
</style>
