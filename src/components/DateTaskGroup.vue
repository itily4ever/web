<template>
  <section class="date-group" :class="{ 'has-event': hasEvent }">
    <button class="date-group-header" @click="open = !open">
      <div>
        <h2>{{ formatDate(date) }}</h2>
        <p>{{ tasks.length }} 项任务<span v-if="hasEvent"> · 有考试/招聘节点</span></p>
      </div>
      <span>{{ open ? '收起' : '展开' }}</span>
    </button>
    <TaskList v-if="open" :tasks="tasks" @toggle="$emit('toggle', $event)" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import TaskList from './TaskList.vue'
import { formatDate } from '../utils/date'

const props = defineProps({
  date: { type: String, required: true },
  tasks: { type: Array, required: true },
})

defineEmits(['toggle', 'edit', 'delete'])

const open = ref(true)
const hasEvent = computed(() => props.tasks.some((task) => task.type === 'exam' || task.type === 'recruitment'))
</script>
