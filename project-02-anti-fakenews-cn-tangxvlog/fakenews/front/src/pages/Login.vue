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
      await register(email.value.trim(), password.value)
    }
    router.push('/')
  } catch (e) {
    alert('Auth failed')
  }
}

const toggle = () => { mode.value = mode.value === 'login' ? 'register' : 'login' }
</script>

<style scoped>
.btn { border: 1px solid var(--border); padding:6px 10px; background:#fff; cursor:pointer }
.form { display:grid; gap:12px }
.form-row { display:grid; gap:6px }
.form-row input { padding:8px; border:1px solid var(--border); border-radius:4px }
</style>
