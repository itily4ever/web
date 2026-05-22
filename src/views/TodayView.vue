<template>
  <div class="page-stack">
    <section class="summary-card today-hero">
      <div>
        <p>今天</p>
        <h2>{{ formattedToday }}</h2>
      </div>
      <button class="primary-button compact" @click="openCreate">添加</button>
    </section>

    <section v-if="showForm" class="panel">
      <div class="section-title">
        <h2>{{ editingTask ? '编辑任务' : '快速添加任务' }}</h2>
      </div>
      <TaskForm :task="editingTask" :submit-label="editingTask ? '保存修改' : '添加任务'" @submit="saveTask" @cancel="closeForm" />
    </section>

    <section class="panel">
      <div class="section-title">
        <h2>搜索筛选</h2>
      </div>
      <input v-model.trim="keyword" class="search-input" placeholder="搜索标题、备注、标签、考试名、科目" />
    </section>

    <section class="content-section">
      <h2>重要事件</h2>
      <TaskList :tasks="importantEvents" empty-title="今天没有考试或招聘节点" empty-description="考试、招聘、确认、缴费等事项会在这里突出显示。" @toggle="toggleTask" @edit="editTask" @delete="removeTask" />
    </section>

    <section class="content-section">
      <h2>重要 & 紧急</h2>
      <TaskList :tasks="importantUrgent" empty-title="没有重要紧急任务" empty-description="今天暂时没有需要立刻处理的高优先级任务。" @toggle="toggleTask" @edit="editTask" @delete="removeTask" />
    </section>

    <section class="content-section">
      <h2>学习任务</h2>
      <TaskList :tasks="studyTasks" empty-title="今天暂无学习任务" empty-description="可以添加复习、刷题、整理资料等计划。" @toggle="toggleTask" @edit="editTask" @delete="removeTask" />
    </section>

    <section class="content-section">
      <h2>其他任务</h2>
      <TaskList :tasks="otherTasks" empty-title="今天暂无其他任务" empty-description="生活事项和普通提醒会显示在这里。" @toggle="toggleTask" @edit="editTask" @delete="removeTask" />
    </section>

    <section class="content-section">
      <h2>已完成</h2>
      <TaskList :tasks="completedTasks" empty-title="还没有完成项" empty-description="完成任务后会自动移动到这里。" @toggle="toggleTask" @edit="editTask" @delete="removeTask" />
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import TaskForm from '../components/TaskForm.vue'
import TaskList from '../components/TaskList.vue'
import { useTaskStore } from '../stores/taskStore'
import { formatDate, todayString } from '../utils/date'

const { state, addTask, updateTask, deleteTask, toggleTask } = useTaskStore()

const today = todayString()
const formattedToday = formatDate(today)
const showForm = ref(false)
const editingTask = ref(null)
const keyword = ref('')

const todayTasks = computed(() => {
  return state.tasks
    .filter((task) => task.date === today)
    .filter(matchesKeyword)
    .sort(sortTasks)
})

const importantEvents = computed(() => todayTasks.value.filter((task) => task.status !== 'done' && ['exam', 'recruitment'].includes(task.type)))
const importantUrgent = computed(() => todayTasks.value.filter((task) => task.status !== 'done' && task.priority === 'high' && task.urgency === 'urgent' && !['exam', 'recruitment'].includes(task.type)))
const studyTasks = computed(() => todayTasks.value.filter((task) => task.status !== 'done' && task.type === 'study' && !(task.priority === 'high' && task.urgency === 'urgent')))
const otherTasks = computed(() => todayTasks.value.filter((task) => task.status !== 'done' && ['life', 'other'].includes(task.type)))
const completedTasks = computed(() => todayTasks.value.filter((task) => task.status === 'done'))

function matchesKeyword(task) {
  if (!keyword.value) return true
  const value = keyword.value.toLowerCase()
  return [task.title, task.description, task.examInfo?.examName, task.examInfo?.subject, ...(task.tags || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(value)
}

function sortTasks(a, b) {
  if (a.status !== b.status) return a.status === 'todo' ? -1 : 1
  if (a.priority !== b.priority) return priorityWeight(a.priority) - priorityWeight(b.priority)
  if (a.urgency !== b.urgency) return urgencyWeight(a.urgency) - urgencyWeight(b.urgency)
  return (a.startTime || '99:99').localeCompare(b.startTime || '99:99')
}

function priorityWeight(priority) {
  return { high: 0, medium: 1, low: 2 }[priority] ?? 3
}

function urgencyWeight(urgency) {
  return { urgent: 0, normal: 1, notUrgent: 2 }[urgency] ?? 3
}

function openCreate() {
  editingTask.value = null
  showForm.value = true
}

function editTask(task) {
  editingTask.value = task
  showForm.value = true
}

function closeForm() {
  editingTask.value = null
  showForm.value = false
}

function saveTask(payload) {
  if (editingTask.value) updateTask(editingTask.value.id, payload)
  else addTask(payload)
  closeForm()
}

function removeTask(id) {
  if (confirm('确定删除这条任务吗？')) deleteTask(id)
}
</script>
