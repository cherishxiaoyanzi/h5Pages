import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
const projectName = require('../../../../config/project')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '背诵报告' }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/poster',
    name: 'Poster',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "poster" */ '../views/Poster.vue'),
    meta: { title: '朋友圈打卡' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: projectName.router,
  routes
})

export default router
