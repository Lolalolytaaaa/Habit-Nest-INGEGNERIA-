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

const router = useRouter()
const isLogin = ref(true)

const availableIcons = [
  'fa-solid fa-dove', 
  'fa-solid fa-clover', 
  'fa-solid fa-sun',
  'fa-solid fa-moon', 
  'fa-solid fa-cloud', 
  'fa-solid fa-mountain',
  'fa-solid fa-droplet'
]

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  icon: 'fa-solid fa-dove', 
  color: '#DDE3BA' 
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
}

const handleSubmit = () => {
  if (isLogin.value) {
    router.push('/calendar')
  } else {
    if (formData.password !== formData.confirmPassword) {
      alert("Le password non coincidono!")
      return
    }
    const profileData = {
      username: formData.username,
      profileIcon: formData.icon,
      profileColor: '#2d6a4f'
    }
    localStorage.setItem('habitNest_profile_data', JSON.stringify(profileData))
    router.push('/calendar')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  padding: 20px;
}

.login-card {
  background: white;
  width: 100%;
  max-width: 480px;
  padding: 40px;
  border-radius: 32px;
  box-shadow: 0 15px 40px rgba(69, 88, 38, 0.1);
  text-align: center;
}

.logo-icon {
  width: 70px; height: 70px;
  color: var(--matcha-dark);
  font-size: 30px;
  border-radius: 22px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.login-header h1 { font-size: 28px; color: var(--matcha-dark); margin-bottom: 10px; }
.subtitle { color: var(--matcha-mid); font-size: 14px; margin-bottom: 20px; }

.icon-selector {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 5px;
  flex-wrap: wrap;
}

.icon-chip {
  background: var(--matcha-bg);
  border: 2px solid transparent;
  width: 45px; height: 45px;
  border-radius: 12px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: var(--matcha-mid);
  transition: all 0.2s;
}

.icon-chip.active {
  background: var(--matcha-dark);
  color: white;
  transform: scale(1.1);
}

.login-form { text-align: left; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 13px; font-weight: 700; color: var(--matcha-dark); margin-bottom: 8px; }

.input-wrapper { position: relative; display: flex; align-items: center; }
.input-wrapper i { position: absolute; left: 15px; color: var(--matcha-mid); }
.input-wrapper input {
  width: 100%; padding: 12px 12px 12px 45px;
  border: 2px solid var(--matcha-soft);
  border-radius: 16px; outline: none; transition: 0.3s;
}

.login-btn {
  width: 100%; padding: 16px;
  background-color: var(--matcha-dark); color: white;
  border: none; border-radius: 16px;
  font-size: 16px; font-weight: 700; cursor: pointer;
  margin-top: 10px;
}

.login-footer { margin-top: 25px; font-size: 14px; color: var(--matcha-mid); }
.login-footer a { color: var(--matcha-green); font-weight: 700; text-decoration: none; }
</style>