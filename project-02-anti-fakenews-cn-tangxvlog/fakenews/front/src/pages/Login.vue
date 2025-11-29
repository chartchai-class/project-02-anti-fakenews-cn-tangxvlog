<template>
  <div class="container">
    <h2>{{ mode==='login' ? t('loginTitle') : t('registerTitle') }}</h2>
  <form class="form" @submit.prevent="onSubmit">
      <div class="form-row">
        <label>{{ t('email') }}</label>
        <input v-model="email" type="email" @input="validateEmail" />
        <span v-if="emailError" style="color:#ef4444">{{ emailError }}</span>
      </div>
      <div class="form-row">
        <label>{{ t('password') }}</label>
        <input v-model="password" type="password" @input="validatePassword" />
        <span v-if="passwordError" style="color:#ef4444">{{ passwordError }}</span>
      </div>
      <div v-if="mode==='register'" class="form-row">
        <label>{{ t('username') }}</label>
        <input v-model="username" type="text" />
      </div>
      <div v-if="mode==='register'" class="form-row">
        <label>{{ t('avatar') }}</label>
        <input type="text" v-model="avatarUrl" placeholder="https://..." />
        <div style="display:flex; gap:8px; align-items:center; margin-top:6px">
          <input type="file" @change="onFileChange" />
          <button class="btn" type="button" @click="uploadAvatar" :disabled="!file">{{ t('avatar') }}</button>
        </div>
        <div v-if="avatarUrl" style="margin-top:6px"><img :src="avatarUrl" alt="avatar" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:1px solid var(--border)" /></div>
      </div>
      <div style="display:flex; gap:8px">
        <button class="btn" type="submit">{{ mode==='login' ? t('login') : t('register') }}</button>
        <button class="btn" type="button" @click="toggle">{{ mode==='login' ? t('goRegister') : t('goLogin') }}</button>
        <RouterLink class="btn" to="/">{{ t('backHome') }}</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useStore } from '../store'
import { useI18n } from '../i18n'

const router = useRouter()
const { t } = useI18n()
const { login, register } = useStore()

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const username = ref('')
const avatarUrl = ref('')
const file = ref<File | null>(null)
const emailError = ref('')
const passwordError = ref('')

const validateEmail = () => {
  const v = email.value.trim()
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  emailError.value = ok ? '' : t('emailInvalid') as string
}
const validatePassword = () => {
  const v = password.value
  passwordError.value = v.length >= 6 ? '' : t('passwordInvalid') as string
}

const onSubmit = async () => {
  validateEmail(); validatePassword()
  if (emailError.value || passwordError.value) return
  try {
    if (mode.value === 'login') {
      await login(email.value.trim(), password.value)
    } else {
      await register(email.value.trim(), password.value, username.value.trim() || undefined, avatarUrl.value.trim() || undefined)
    }
    router.push('/')
  } catch (e) {
    alert('Auth failed')
  }
}

const toggle = () => { mode.value = mode.value === 'login' ? 'register' : 'login' }

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  file.value = (input.files && input.files[0]) ? input.files[0] : null
}
const uploadAvatar = async () => {
  if (!file.value) return
  const fd = new FormData()
  fd.append('file', file.value)
  try {
    const res = await fetch('/api/storage/uploadFile', { method: 'POST', body: fd })
    if (res.ok) {
      const url = await res.text()
      avatarUrl.value = url.trim()
      alert('头像已上传')
    } else {
      alert('上传失败')
    }
  } catch {
    alert('网络错误，上传失败')
  }
}
</script>

<style scoped>
.btn { border: 1px solid var(--border); padding:6px 10px; background:#fff; cursor:pointer }
.form { display:grid; gap:12px }
.form-row { display:grid; gap:6px }
.form-row input { padding:8px; border:1px solid var(--border); border-radius:4px }
</style>
