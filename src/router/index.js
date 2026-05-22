import { createRouter, createWebHistory } from 'vue-router'
import TodayView from '../views/TodayView.vue'
import ScheduleView from '../views/ScheduleView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/today' },
    { path: '/today', component: TodayView },
    { path: '/schedule', component: ScheduleView },
    { path: '/settings', component: SettingsView },
  ],
})

export default router
