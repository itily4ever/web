<template>
  <form class="task-form" @submit.prevent="submit">
    <div class="form-grid">
      <label>
        标题 *
        <input v-model.trim="form.title" required placeholder="例如：高等教育学复习" />
      </label>

      <label>
        日期 *
        <input v-model="form.date" type="date" required />
      </label>

      <div class="time-row">
        <label>
          开始
          <input v-model="form.startTime" type="time" />
        </label>
        <label>
          结束
          <input v-model="form.endTime" type="time" />
        </label>
      </div>

      <label>
        类型 *
        <select v-model="form.type" required>
          <option v-for="type in taskTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
        </select>
      </label>

      <div class="time-row">
        <label>
          优先级 *
          <select v-model="form.priority" required>
            <option v-for="item in priorityOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </label>
        <label>
          紧急度 *
          <select v-model="form.urgency" required>
            <option v-for="item in urgencyOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </label>
      </div>

      <label>
        备注
        <textarea v-model.trim="form.description" rows="3" placeholder="复习范围、材料、提醒事项"></textarea>
      </label>

      <label>
        标签
        <input v-model.trim="tagText" placeholder="用逗号分隔，例如：教育学, 招聘" />
      </label>
    </div>

    <section v-if="showExamFields" class="nested-fields">
      <h3>考试 / 招聘详情</h3>
      <label>
        名称
        <input v-model.trim="form.examInfo.examName" placeholder="例如：湖南艺术职业学院招聘" />
      </label>
      <label>
        科目
        <input v-model.trim="form.examInfo.subject" placeholder="考试科目或复习方向" />
      </label>
      <div class="time-row">
        <label>
          地点
          <input v-model.trim="form.examInfo.location" />
        </label>
        <label>
          分数
          <input v-model.trim="form.examInfo.score" />
        </label>
      </div>
      <label>
        详情备注
        <textarea v-model.trim="form.examInfo.note" rows="2"></textarea>
      </label>
    </section>

    <div class="form-actions">
      <button type="button" class="ghost-button" @click="$emit('cancel')">取消</button>
      <button type="submit" class="primary-button">{{ submitLabel }}</button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { priorityOptions, taskTypes, urgencyOptions } from '../utils/storage'
import { todayString } from '../utils/date'

const props = defineProps({
  task: { type: Object, default: null },
  submitLabel: { type: String, default: '保存任务' },
})

const emit = defineEmits(['submit', 'cancel'])

const createForm = () => ({
  title: props.task?.title || '',
  description: props.task?.description || '',
  date: props.task?.date || todayString(),
  startTime: props.task?.startTime || '',
  endTime: props.task?.endTime || '',
  type: props.task?.type || 'study',
  priority: props.task?.priority || 'medium',
  urgency: props.task?.urgency || 'normal',
  status: props.task?.status || 'todo',
  examInfo: props.task?.examInfo
    ? { ...props.task.examInfo }
    : {
        examName: '',
        subject: '',
        location: '',
        score: '',
        note: '',
      },
})

const form = reactive(createForm())
const tagText = ref(props.task?.tags?.join(', ') || '')
const showExamFields = computed(() => form.type === 'exam' || form.type === 'recruitment')

watch(
  () => props.task,
  () => {
    Object.assign(form, createForm())
    tagText.value = props.task?.tags?.join(', ') || ''
  },
)

function submit() {
  const tags = tagText.value
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)

  emit('submit', {
    ...form,
    tags,
    examInfo: showExamFields.value ? { ...form.examInfo } : null,
  })
}
</script>
