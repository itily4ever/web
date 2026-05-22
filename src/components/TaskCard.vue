<template>
  <article class="task-card" :class="[task.status === 'done' && 'is-done', `type-${task.type}`]">
    <div class="task-topline">
      <button class="check-button" :aria-label="task.status === 'done' ? '标记为未完成' : '标记为完成'" @click="$emit('toggle', task.id)">
        {{ task.status === 'done' ? '✓' : '' }}
      </button>
      <div class="task-main">
        <div class="task-title-row">
          <h3>{{ task.title }}</h3>
          <span v-if="task.urgency === 'urgent'" class="tag urgent-tag">紧急</span>
        </div>
        <p v-if="task.description" class="task-desc">{{ task.description }}</p>
      </div>
    </div>

    <div class="task-meta">
      <span class="type-tag" :class="`type-tag-${task.type}`">{{ typeLabel }}</span>
      <PriorityTag :priority="task.priority" />
      <span class="tag">{{ task.date }}</span>
      <span v-if="timeText" class="tag">{{ timeText }}</span>
    </div>

    <div v-if="task.tags.length" class="task-tags">
      <span v-for="tag in task.tags" :key="tag" class="soft-tag">#{{ tag }}</span>
    </div>

    <div v-if="task.examInfo" class="exam-box">
      <strong>{{ task.examInfo.examName || '考试 / 招聘信息' }}</strong>
      <p v-if="task.examInfo.subject">{{ task.examInfo.subject }}</p>
      <p v-if="task.examInfo.location">地点：{{ task.examInfo.location }}</p>
      <p v-if="task.examInfo.score">分数：{{ task.examInfo.score }}</p>
      <p v-if="task.examInfo.note">备注：{{ task.examInfo.note }}</p>
    </div>

    <div class="task-actions">
      <button class="text-button" @click="$emit('edit', task)">编辑</button>
      <button class="text-button danger" @click="$emit('delete', task.id)">删除</button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import PriorityTag from './PriorityTag.vue'
import { taskTypes } from '../utils/storage'

const props = defineProps({
  task: { type: Object, required: true },
})

defineEmits(['toggle', 'edit', 'delete'])

const typeLabel = computed(() => taskTypes.find((type) => type.value === props.task.type)?.label || '其他')
const timeText = computed(() => {
  if (props.task.startTime && props.task.endTime) return `${props.task.startTime}-${props.task.endTime}`
  return props.task.startTime || props.task.endTime || ''
})
</script>
