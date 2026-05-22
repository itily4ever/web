export function todayString() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(`${dateString}T00:00:00`)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date)
}

export function compareDateAsc(a, b) {
  return (a.date || '').localeCompare(b.date || '')
}

export function isPastDate(dateString) {
  return dateString < todayString()
}
