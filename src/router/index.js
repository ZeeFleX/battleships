import Vue from 'vue'
import Router from 'vue-router'
import Field from '@/components/Field'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Field',
      component: Field,
      props: true
    }
  ]
})
