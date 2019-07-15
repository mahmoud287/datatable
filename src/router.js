import Vue from 'vue'
import Router from 'vue-router'
import Eligibility from './components/Eligibility.vue'
import Patient from './components/Patient.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/Patients',
      name: Patient,
      component: Patient
    },
    {
      path: '/Eligibility',
      name: Eligibility,
      component: Eligibility
    }
  ]
})
