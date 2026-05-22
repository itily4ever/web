<template>
  <span class="tag" :class="[`priority-${priority}`]">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  priority: { type: String, required: true },
})

const label = computed(() => {
  if (props.priority === 'high') return '重要'
  if (props.priority === 'low') return '不重要'
  return '一般'
})
</script>
