<template>
  <div class="page-stack">
    <section class="panel filter-panel">
      <input v-model.trim="keyword" class="search-input" placeholder="搜索标题、备注、标签、考试名、科目" />
      <div class="filter-grid">
        <select v-model="typeFilter">
          <option value="">全部类型</option>
          <option v-for="type in taskTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
        </select>
        <select v-model="priorityFilter">
          <option value="">全部优先级</option>
          <option v-for="item in priorityOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
        <select v-model="statusFilter">
          <option value="">全部状态</option>
          <option v-for="item in statusOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </div>
    </section>

    <section class="content-section">
      <h2>未来考试 / 招聘节点</h2>
      <TaskList :tasks="futureEvents" empty-title="暂无未来节点" empty-description="添加考试或招聘类型任务后，会在这里集中显示。" @toggle="toggleTask" @edit="editTask" @delete="removeTask" />
    </section>

    <section v-if="showForm" class="panel">
      <div class="section-title">
        <h2>编辑任务</h2>
      </div>
      <TaskForm :task="editingTask" submit-label="保存修改" @submit="saveTask" @cancel="closeForm" />
    </section>

    <section class="content-section">
      <h2>按日期查看</h2>
      <DateTaskGroup
        v-for="group in groupedTasks"
        :key="group.date"
        :date="group.date"
        :tasks="group.tasks"
        @toggle="toggleTask"
        @edit="editTask"
        @delete="removeTask"
      />
      <EmptyState v-if="!groupedTasks.length" title="没有符合条件的任务" description="调整搜索或筛选条件后再看看。" />
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import DateTaskGroup from '../components/DateTaskGroup.vue'
import EmptyState from '../components/EmptyState.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskList from '../components/TaskList.vue'
import { useTaskStore } from '../stores/taskStore'
import { compareDateAsc, todayString } from '../utils/date'
import { priorityOptions, statusOptions, taskTypes } from '../utils/storage'

const { state, updateTask, deleteTask, toggleTask } = useTaskStore()

const keyword = ref('')
const typeFilter = ref('')
const priorityFilter = ref('')
const statusFilter = ref('')
const showForm = ref(false)
const editingTask = ref(null)

const filteredTasks = computed(() => {
  return [...state.tasks]
    .filter(matchesKeyword)
    .filter((task) => !typeFilter.value || task.type === typeFilter.value)
    .filter((task) => !priorityFilter.value || task.priority === priorityFilter.value)
    .filter((task) => !statusFilter.value || task.status === statusFilter.value)
    .sort(compareDateAsc)
})

const futureEvents = computed(() => {
  return filteredTasks.value.filter((task) => task.date >= todayString() && ['exam', 'recruitment'].includes(task.type) && task.status !== 'done')
})

const groupedTasks = computed(() => {
  const map = new Map()
  filteredTasks.value.forEach((task) => {
    if (!map.has(task.date)) map.set(task.date, [])
    map.get(task.date).push(task)
  })
  return Array.from(map, ([date, tasks]) => ({ date, tasks }))
})

function matchesKeyword(task) {
  if (!keyword.value) return true
  const value = keyword.value.toLowerCase()
  return [task.title, task.description, task.examInfo?.examName, task.examInfo?.subject, ...(task.tags || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(value)
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
  updateTask(editingTask.value.id, payload)
  closeForm()
}

function removeTask(id) {
  if (confirm('确定删除这条任务吗？')) deleteTask(id)
}
</script>
