<template>
  <div class="empty-state">
    <div class="empty-icon">✓</div>
    <p>{{ title }}</p>
    <span>{{ description }}</span>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '暂无内容' },
  description: { type: String, default: '可以先添加一条任务。' },
})
</script>
