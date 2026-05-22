<template>
  <div class="page-stack">
    <section class="stats-grid">
      <div class="stat-card">
        <span>总任务</span>
        <strong>{{ totalCount }}</strong>
      </div>
      <div class="stat-card">
        <span>已完成</span>
        <strong>{{ completedCount }}</strong>
      </div>
      <div class="stat-card">
        <span>未完成</span>
        <strong>{{ unfinishedCount }}</strong>
      </div>
    </section>

    <section class="panel warning-panel">
      <h2>本地数据提醒</h2>
      <p>当前版本使用浏览器 localStorage 保存数据，只保存在这台设备和当前浏览器中。清理浏览器缓存、换手机、换浏览器或无痕模式退出，都可能导致本地数据丢失。</p>
    </section>

    <section class="panel">
      <div class="section-title">
        <h2>JSON 备份</h2>
      </div>
      <div class="button-stack">
        <button class="primary-button" @click="downloadBackup">导出 JSON 备份</button>
        <label class="upload-button">
          导入 JSON 备份
          <input type="file" accept="application/json,.json" @change="uploadBackup" />
        </label>
        <button class="danger-button" @click="clearData">清空全部数据</button>
      </div>
    </section>

    <section class="panel">
      <h2>应用信息</h2>
      <p>这是一个无后端的轻量个人计划工具，适合记录每日学习、考试节点、招聘流程、缴费提交材料和面试笔试安排。第一版数据只保存在手机浏览器里，建议定期导出 JSON 备份。</p>
    </section>
  </div>
</template>

<script setup>
import { useTaskStore } from '../stores/taskStore'

const { totalCount, completedCount, unfinishedCount, exportBackup, importBackup, clearAll } = useTaskStore()

function downloadBackup() {
  const blob = new Blob([exportBackup()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `daily-schedule-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

async function uploadBackup(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  try {
    const text = await file.text()
    importBackup(text)
    alert('导入成功')
  } catch (error) {
    alert(error.message || '导入失败，请检查 JSON 文件')
  }
}

function clearData() {
  const first = confirm('清空后无法从本机恢复，除非你已经导出 JSON 备份。确定继续吗？')
  if (!first) return
  const second = confirm('再次确认：确定清空全部任务数据吗？')
  if (second) clearAll()
}
</script>
