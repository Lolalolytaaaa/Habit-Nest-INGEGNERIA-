<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon" :style="{ backgroundColor: isLogin ? 'var(--matcha-bg)' : formData.color }">
          <i :class="isLogin ? 'fa-solid fa-nest-feather' : formData.icon"></i>
        </div>
        
        <h1>{{ isLogin ? 'Bentornato nel Nido' : 'Crea il tuo Nido' }}</h1>
        <p class="subtitle">
          {{ isLogin 
            ? 'Inserisci le tue credenziali per continuare il tuo percorso.' 
            : 'Scegli il tuo simbolo e inizia a coltivare le tue abitudini.' 
          }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        
        <div v-if="!isLogin" class="form-group">
          <label>Scegli il tuo simbolo:</label>
          <div class="icon-selector">
            <button 
              type="button"
              v-for="icon in availableIcons" 
              :key="icon"
              :class="['icon-chip', { active: formData.icon === icon }]"
              @click="formData.icon = icon"
            >
              <i :class="icon"></i>
            </button>
          </div>
        </div>

        <div v-if="!isLogin" class="form-group">
          <label for="reg-user">Username</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-user"></i>
            <input type="text" id="reg-user" v-model="formData.username" placeholder="Scegli un nickname" required />
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-envelope"></i>
            <input type="email" id="email" v-model="formData.email" placeholder="latua@email.it" required />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-lock"></i>
            <input type="password" id="password" v-model="formData.password" placeholder="••••••••" required />
          </div>
        </div>

        <div v-if="!isLogin" class="form-group">
          <label for="confirm-password">Conferma Password</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-shield-check"></i>
            <input type="password" id="confirm-password" v-model="formData.confirmPassword" placeholder="••••••••" required />
          </div>
        </div>

        <button type="submit" class="login-btn">
          {{ isLogin ? 'Entra nel Nido' : 'Inizia il Percorso' }}
        </button>
      </form>

      <div class="login-footer">
        <p v-if="isLogin">
          Non hai ancora un account? 
          <a href="#" @click.prevent="toggleMode">Registrati ora</a>
        </p>
        <p v-else>
          Hai già un account? 
          <a href="#" @click.prevent="toggleMode">Accedi qui</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const isLogin = ref(true)
const availableIcons = []
const formData = reactive({
  username: '', email: '', password: '', confirmPassword: '', icon: '', color: '' 
})
const toggleMode = () => {}
const handleSubmit = () => {}
</script>

<style scoped>
</style>