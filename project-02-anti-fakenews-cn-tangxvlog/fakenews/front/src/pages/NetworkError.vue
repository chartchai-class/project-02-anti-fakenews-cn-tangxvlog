<template>
  <div class="container" style="max-width:800px; margin:24px auto; padding:24px; border:1px solid var(--border); border-radius:12px; background:#fff">
    <h2 style="margin:0 0 12px">Network Error</h2>
    <p style="margin:8px 0; color:var(--muted)">The backend service is not running or returned an error.</p>
    <p style="margin:8px 0; color:var(--muted)">Please start the backend on <code>http://localhost:8080</code> and try again.</p>
    <div style="margin-top:16px; display:flex; gap:8px">
      <button class="btn" @click="onRetry">Retry</button>
      <button class="btn" @click="onStart">Start Backend</button>
    </div>
    <p v-if="started" style="margin-top:12px; color:var(--muted)">Backend starting... wait about 10s, then click Retry.</p>
  </div>
  </template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'retry'): void }>()
defineProps<{ message?: string }>()
const started = $ref(false)
const onRetry = () => emit('retry')
const onStart = async () => { started = true; try { await fetch('/__dev/restart-backend', { method: 'POST' }) } catch {} }
</script>

<style scoped>
.btn { padding: 6px 10px; border: 1px solid var(--border); border-radius: 6px; background: #f9fafb; }
.btn:hover { background: #eef2f7 }
</style>
