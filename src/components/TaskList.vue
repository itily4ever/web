<template>
  <div class="task-list">
    <TaskCard
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @toggle="$emit('toggle', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
    <EmptyState v-if="!tasks.length" :title="emptyTitle" :description="emptyDescription" />
  </div>
</template>

<script setup>
import EmptyState from './EmptyState.vue'
import TaskCard from './TaskCard.vue'

defineProps({
  tasks: { type: Array, required: true },
  emptyTitle: { type: String, default: '这里还没有任务' },
  emptyDescription: { type: String, default: '添加任务后会显示在这里。' },
})

defineEmits(['toggle', 'edit', 'delete'])
</script>
