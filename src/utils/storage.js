export const STORAGE_KEY = 'daily_schedule_tasks'

export const taskTypes = [
  { value: 'study', label: '学习复习' },
  { value: 'exam', label: '考试节点' },
  { value: 'recruitment', label: '招聘事项' },
  { value: 'life', label: '生活事项' },
  { value: 'other', label: '其他' },
]

export const priorityOptions = [
  { value: 'high', label: '重要' },
  { value: 'medium', label: '一般' },
  { value: 'low', label: '不重要' },
]

export const urgencyOptions = [
  { value: 'urgent', label: '紧急' },
  { value: 'normal', label: '正常' },
  { value: 'notUrgent', label: '不急' },
]

export const statusOptions = [
  { value: 'todo', label: '未完成' },
  { value: 'done', label: '已完成' },
]

export const demoTasks = [
  {
    id: '1',
    title: '高等教育学 3.8 高等教育的基本规律',
    description: '高等教育社会职能、高等教育的社会发展、高等教育与个体发展',
    date: '2026-05-22',
    startTime: '',
    endTime: '',
    type: 'study',
    priority: 'high',
    urgency: 'urgent',
    status: 'todo',
    tags: ['教育学', '招聘'],
    examInfo: null,
    createdAt: '2026-05-22T16:19:00',
    updatedAt: '2026-05-22T16:19:00',
  },
  {
    id: '2',
    title: '言语理解：因为、必要、对策',
    description: '整理常见关联词和对策类题型',
    date: '2026-05-22',
    startTime: '',
    endTime: '',
    type: 'study',
    priority: 'medium',
    urgency: 'normal',
    status: 'done',
    tags: ['言语理解', '职测'],
    examInfo: null,
    createdAt: '2026-05-22T16:19:00',
    updatedAt: '2026-05-22T16:19:00',
  },
  {
    id: '3',
    title: '湖南艺术职业学院补交材料',
    description: '2.28-3.2 补交材料，3.18-20 现场确认',
    date: '2026-02-28',
    startTime: '',
    endTime: '',
    type: 'recruitment',
    priority: 'high',
    urgency: 'urgent',
    status: 'todo',
    tags: ['高校', '招聘'],
    examInfo: {
      examName: '湖南艺术职业学院招聘',
      subject: '人工智能时政 / 高校教育学 / 职业教育',
      location: '',
      score: '',
      note: '注意现场确认时间',
    },
    createdAt: '2026-02-28T09:00:00',
    updatedAt: '2026-02-28T09:00:00',
  },
]

function normalizeTask(task) {
  const now = new Date().toISOString()
  return {
    id: task.id || crypto.randomUUID(),
    title: task.title || '',
    description: task.description || '',
    date: task.date || new Date().toISOString().slice(0, 10),
    startTime: task.startTime || '',
    endTime: task.endTime || '',
    type: task.type || 'study',
    priority: task.priority || 'medium',
    urgency: task.urgency || 'normal',
    status: task.status || 'todo',
    tags: Array.isArray(task.tags) ? task.tags : [],
    examInfo: task.examInfo || null,
    createdAt: task.createdAt || now,
    updatedAt: task.updatedAt || now,
  }
}

export function getTasks() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    saveTasks(demoTasks)
    return demoTasks
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeTask)
  } catch {
    return []
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.map(normalizeTask)))
}

export function addTask(task) {
  const now = new Date().toISOString()
  const nextTask = normalizeTask({
    ...task,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  })
  const tasks = [nextTask, ...getTasks()]
  saveTasks(tasks)
  return nextTask
}

export function updateTask(id, updates) {
  const tasks = getTasks().map((task) =>
    task.id === id ? normalizeTask({ ...task, ...updates, updatedAt: new Date().toISOString() }) : task,
  )
  saveTasks(tasks)
  return tasks.find((task) => task.id === id)
}

export function deleteTask(id) {
  const tasks = getTasks().filter((task) => task.id !== id)
  saveTasks(tasks)
}

export function exportTasks() {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      storageKey: STORAGE_KEY,
      tasks: getTasks(),
    },
    null,
    2,
  )
}

export function importTasks(payload) {
  const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload
  const tasks = Array.isArray(parsed) ? parsed : parsed.tasks
  if (!Array.isArray(tasks)) throw new Error('备份文件中没有有效任务列表')
  saveTasks(tasks.map(normalizeTask))
  return getTasks()
}

export function clearTasks() {
  localStorage.setItem(STORAGE_KEY, '[]')
}
