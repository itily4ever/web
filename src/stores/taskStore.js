import { computed, reactive } from 'vue'
import {
  addTask as addStoredTask,
  clearTasks,
  deleteTask as deleteStoredTask,
  exportTasks,
  getTasks,
  importTasks,
  saveTasks,
  updateTask as updateStoredTask,
} from '../utils/storage'

const state = reactive({
  tasks: getTasks(),
})

function refresh() {
  state.tasks = getTasks()
}

export function useTaskStore() {
  const totalCount = computed(() => state.tasks.length)
  const completedCount = computed(() => state.tasks.filter((task) => task.status === 'done').length)
  const unfinishedCount = computed(() => state.tasks.filter((task) => task.status !== 'done').length)

  function addTask(task) {
    addStoredTask(task)
    refresh()
  }

  function updateTask(id, updates) {
    updateStoredTask(id, updates)
    refresh()
  }

  function deleteTask(id) {
    deleteStoredTask(id)
    refresh()
  }

  function toggleTask(id) {
    const task = state.tasks.find((item) => item.id === id)
    if (!task) return
    updateTask(id, { status: task.status === 'done' ? 'todo' : 'done' })
  }

  function replaceTasks(tasks) {
    saveTasks(tasks)
    refresh()
  }

  function importBackup(payload) {
    importTasks(payload)
    refresh()
  }

  function clearAll() {
    clearTasks()
    state.tasks = []
  }

  return {
    state,
    totalCount,
    completedCount,
    unfinishedCount,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    replaceTasks,
    importBackup,
    clearAll,
    exportBackup: exportTasks,
  }
}
