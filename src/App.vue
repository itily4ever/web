<template>
  <div class="app-shell">
    <header class="app-header">
      <div>
        <p class="eyebrow">Daily Planner</p>
        <h1>{{ routeTitle }}</h1>
      </div>
      <span class="storage-pill">本机保存</span>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()

const routeTitle = computed(() => {
  if (route.path === '/schedule') return '总日程'
  if (route.path === '/settings') return '备份设置'
  return '今日安排'
})
</script>
