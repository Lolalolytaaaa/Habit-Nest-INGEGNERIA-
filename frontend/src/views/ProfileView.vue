<template>
  <div class="profile-container">

    <div v-if="!isEditing" class="profile-view">
      
      <div class="header">
        <div class="avatar" :style="{ backgroundColor: profileColor }">
          <i :class="profileIcon"></i>
        </div>
        <h1 class="username">{{ username }}</h1>
        <p class="bio-text" v-if="bio">"{{ bio }}"</p>
        
        <div class="selected-adjectives">
          <span class="badge-tag" v-for="adj in selectedAdjectives" :key="adj" :style="{ backgroundColor: profileColor, color: 'white' }">{{ adj }}</span>
        </div>

        <div class="selected-interests" v-if="selectedInterests.length > 0">
          <span class="interest-tag" v-for="int in selectedInterests" :key="int">
            #{{ int }}
          </span>
        </div>

        <div class="status-badge">
          <i :class="isPublic ? 'fa-solid fa-earth-americas' : 'fa-solid fa-lock'"></i>
          {{ isPublic ? 'Profilo Pubblico' : 'Profilo Privato' }}
        </div>
      </div>

      <button class="btn btn-primary edit-profile-btn" @click="isEditing = true">
        <i class="fa-solid fa-pen"></i> Modifica Profilo
      </button>
      </div> 
      <div v-if="!isEditing" class="profile-view" style="margin-top: 20px;">
      <div class="badges-section" style="border-top: none; padding-top: 0; margin-top: 0;">        
        <h3 class="section-title">I Miei Traguardi</h3>
        
        <div style="margin-bottom: 15px;" v-if="regularBadges.length > 0">
          <div class="badges-grid">
            <div v-for="badge in regularBadges" :key="badge.id" class="badge-item">
              <div class="badge-icon" :style="{ background: badge.color }">
                <i :class="badge.icon"></i>
              </div>
              <span class="badge-name">{{ badge.name }}</span>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 15px;" v-if="giantBadges.length > 0">          <div class="giant-badge-container">
            <div v-for="badge in giantBadges" :key="badge.id" class="badge-item giant-badge">
              <div class="badge-icon" :style="{ background: badge.color }">
                <i :class="badge.icon"></i>
              </div>
              <span class="badge-name">{{ badge.name }}</span>
            </div>
          </div>
        </div>

        <button class="btn btn-secondary" @click="isModalOpen = true">
          <i class="fa-solid fa-medal"></i> Tutti i badge
        </button>
      </div>

    </div>

<div v-if="isEditing" class="settings">      
  <div class="edit-header">
        <h3>Modifica Profilo</h3>
        <div class="mini-avatar" :style="{ backgroundColor: profileColor }">
          <i :class="profileIcon"></i>
        </div>
      </div>
      
      <div class="form-group">
        <label>Nickname:</label>
        <input type="text" v-model="username">
      </div>

      <div class="form-group">
        <label>Biografia:</label>
        <textarea v-model="bio" rows="3" placeholder="Scrivi qualcosa su di te..."></textarea>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label>Colore:</label>
          <input type="color" v-model="profileColor">
        </div>
        <div class="form-group half">
          <label>Icona:</label>
          <select v-model="profileIcon">
            <option value="fa-solid fa-dove">Colomba</option>
            <option value="fa-solid fa-clover">Trifoglio</option>
            <option value="fa-solid fa-sun">Sole</option>
            <option value="fa-solid fa-moon">Luna</option>
            <option value="fa-solid fa-cloud">Nuvola</option>
            <option value="fa-solid fa-mountain">Montagna</option>
            <option value="fa-solid fa-droplet">Goccia</option>
          </select>
        </div>
      </div>

      <div class="form-group toggle-group">
        <label>Profilo Pubblico:</label>
        <label class="switch">
          <input type="checkbox" v-model="isPublic">
          <span class="slider"></span>
        </label>
        <span class="status-text">{{ isPublic ? 'Visibile' : 'Nascosto' }}</span>
      </div>

      <div class="form-group">
        <label>Aggettivi che ti descrivono:</label>
        <div class="chips-container">
          <button 
            v-for="adj in availableAdjectives" 
            :key="adj"
            :class="['chip', { active: selectedAdjectives.includes(adj) }]"
            @click="toggleAdjective(adj)"
          >
            {{ adj }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>I tuoi Interessi:</label>
        <div class="chips-container">
          <button 
            v-for="int in availableInterests" 
            :key="int"
            :class="['chip interest-chip', { active: selectedInterests.includes(int) }]"
            @click="toggleInterest(int)"
          >
            {{ int }}
          </button>
        </div>
      </div>

    
      <button class="btn btn-success" @click="saveProfile">
        <i class="fa-solid fa-check"></i> Salva Modifiche
      </button>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
      <div class="modal-box">
        <div class="modal-header">
          <h3>Collezione Badge</h3>
          <button class="close-btn" @click="isModalOpen = false">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-badges-grid">
          <div v-for="badge in allBadges" :key="badge.id" class="modal-badge-item">
            <div class="badge-icon-wrapper">
              <div 
                class="badge-icon" 
                :style="{ background: badge.isLocked ? 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' : badge.color }"
              >
                <i :class="badge.icon" :style="{ color: badge.isLocked ? '#94a3b8' : 'white' }"></i>
              </div>
              <div v-if="badge.isLocked" class="lock-overlay">
                <i class="fa-solid fa-lock"></i>
              </div>
            </div>
            <span class="badge-name" :class="{ 'locked-text': badge.isLocked }">{{ badge.name }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isEditing = ref(false)
const isModalOpen = ref(false)
const username = ref('Lola')
const profileColor = ref('#2d6a4f') 
const profileIcon = ref('fa-solid fa-dove')
const bio = ref('Studentessa di Informatica creativa e determinata.')
const isPublic = ref(false) 

const availableAdjectives = ['Mattiniero', 'Notturno', 'Equilibrato', 'Costante', 'Creativo', 'Pigro', 'Iperattivo', 'Minimalista', 'Organizzato', 'Ambizioso', 'Determinato']
const selectedAdjectives = ref(['Creativo', 'Costante'])

const availableInterests = ['Natura', 'Sport', 'Campeggio', 'Cucina', 'Lettura', 'Tecnologia', 'Arte', 'Viaggi', 'Musica', 'Fitness', 'Fotografia']
const selectedInterests = ref(['Natura', 'Lettura'])

const allBadges = ref([
  { id: 1, name: 'Piccolo Seme', icon: 'fa-solid fa-seedling', color: 'linear-gradient(135deg, #d9f99d, #84cc16)', isLocked: false },
  { id: 2, name: 'Primo Germoglio', icon: 'fa-solid fa-leaf', color: 'linear-gradient(135deg, #bbf7d0, #22c55e)', isLocked: false },
  { id: 3, name: 'Radici Forti', icon: 'fa-solid fa-tree', color: 'linear-gradient(135deg, #4ade80, #15803d)', isLocked: false },
  { id: 4, name: 'Dolce Frutto', icon: 'fa-solid fa-apple-whole', color: 'linear-gradient(135deg, #22c55e, #166534)', isLocked: false },
  { id: 5, name: 'Nuovo Nido', icon: 'fa-solid fa-egg', color: 'linear-gradient(135deg, #16a34a, #14532d)', isLocked: false },
  { id: 6, name: 'Primo Volo', icon: 'fa-solid fa-feather-pointed', color: 'linear-gradient(135deg, #15803d, #064e3b)', isLocked: false },
  { id: 7, name: 'Guardiano del Nido', icon: 'fa-solid fa-shield-halved', color: 'linear-gradient(135deg, #166534, #022c22)', isLocked: false, isGiant: true }
])

const unlockedBadges = computed(() => allBadges.value.filter(badge => !badge.isLocked))
const regularBadges = computed(() => unlockedBadges.value.filter(badge => !badge.isGiant))
const giantBadges = computed(() => unlockedBadges.value.filter(badge => badge.isGiant))

onMounted(() => {
  const savedProfile = localStorage.getItem('habitNest_profile_data')
  if (savedProfile) {
    try {
      const parsedData = JSON.parse(savedProfile)
      username.value = parsedData.username || 'Lola'
      profileColor.value = parsedData.profileColor || '#2d6a4f'
      profileIcon.value = parsedData.profileIcon || 'fa-solid fa-dove'
      bio.value = parsedData.bio || ''
      isPublic.value = parsedData.isPublic || false
      selectedAdjectives.value = parsedData.selectedAdjectives || []
      selectedInterests.value = parsedData.selectedInterests || []
    } catch (error) {
      console.error("Errore nel caricamento del profilo:", error)
    }
  }
})

const saveProfile = () => {
  const dataToSave = {
    username: username.value,
    profileColor: profileColor.value,
    profileIcon: profileIcon.value,
    bio: bio.value,
    isPublic: isPublic.value,
    selectedAdjectives: selectedAdjectives.value,
    selectedInterests: selectedInterests.value
  }
  localStorage.setItem('habitNest_profile_data', JSON.stringify(dataToSave))
  isEditing.value = false
}

const toggleAdjective = (adj) => {
  if (selectedAdjectives.value.includes(adj)) {
    selectedAdjectives.value = selectedAdjectives.value.filter(item => item !== adj)
  } else {
    selectedAdjectives.value.push(adj)
  }
}

const toggleInterest = (int) => {
  if (selectedInterests.value.includes(int)) {
    selectedInterests.value = selectedInterests.value.filter(item => item !== int)
  } else {
    selectedInterests.value.push(int)
  }
}
</script>

<style scoped>
.profile-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.profile-view {
  background: white;
  padding: 30px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  text-align: center;
}

.avatar {
  width: 110px; height: 110px; border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  margin: 0 auto 15px auto; color: white; font-size: 45px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.username { color: #1b4332; font-size: 26px; margin: 10px 0; font-weight: 700; }
.bio-text { color: #52865a; margin-bottom: 15px; font-size: 15px; }

.badge-tag {
  font-size: 12px; padding: 5px 12px; border-radius: 15px; font-weight: bold;
  margin: 3px; display: inline-block;
}

.interest-tag { color: #64748b; font-size: 13px; font-weight: 600; margin: 0 5px; }

.status-badge { 
  margin-top: 15px; color: #64748b; font-size: 12px; font-weight: bold;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}

.badges-section {
  border-top: 1px solid #f1f5f9;
  padding-top: 25px;
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.section-title { font-size: 14px; color: #1b4332; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
.badges-grid {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-bottom: 20px;
  max-width: 300px;
}
.badge-item { width: 65px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 5px;}
.badge-icon {
  width: 50px; height: 50px; border-radius: 50%; display: flex;
  justify-content: center; align-items: center; color: white; box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}
.badge-name { font-size: 10px; color: #64748b; font-weight: bold; }

.giant-badge { width: 100%; margin-top: 5px; }
.giant-badge .badge-icon { width: 80px; height: 80px; font-size: 35px; box-shadow: 0 0 15px rgba(234, 179, 8, 0.4); }
.giant-badge-container { display: flex; justify-content: center;}

.settings { background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.edit-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 20px; }
.mini-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; }

.form-group { margin-bottom: 20px; text-align: left; }
.form-row { display: flex; gap: 15px; }
.half { flex: 1; }
label { font-size: 12px; font-weight: bold; color: #475569; display: block; margin-bottom: 5px; }
input[type="text"], textarea, select { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-family: inherit; font-size: 14px; }
input[type="color"] { border: none; height: 40px; cursor: pointer; padding: 0; background: none; }

.chips-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px; }
.chip { padding: 6px 14px; border-radius: 20px; border: 1px solid #cbd5e1; background: #f8fafc; cursor: pointer; font-size: 13px; color: #64748b; transition: all 0.2s; }
.chip.active { background: #2d6a4f; color: white; border-color: #2d6a4f; }

.toggle-group { display: flex; align-items: center; gap: 15px; }
.switch { position: relative; display: inline-block; width: 46px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 24px; }
.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #2d6a4f; }
input:checked + .slider:before { transform: translateX(22px); }
.btn { width: 100%; padding: 12px; border-radius: 10px; border: none; font-weight: bold; cursor: pointer; transition: opacity 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; }
.btn-primary { background: #f1f5f9; color: #1e293b; }
.btn-secondary { background: none; border: 1px solid #2d6a4f; color: #2d6a4f; width: auto; padding: 8px 18px; font-size: 13px; border-radius: 20px;}
.btn-success { background: #2d6a4f; color: white; margin-top: 10px; }
.edit-profile-btn { width: fit-content; margin-left: auto; margin-right: auto; padding-left: 24px;padding-right: 24px;}
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.7); display: flex; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(4px); }
.modal-box { background: white; padding: 25px; border-radius: 24px; width: 90%; max-width: 400px; max-height: 80vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
.close-btn { background: none; border: none; font-size: 24px; color: #94a3b8; cursor: pointer; }
.modal-badges-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px 15px; }
.badge-icon-wrapper { position: relative; }
.lock-overlay { position: absolute; top: -5px; right: -5px; background: white; border-radius: 50%; width: 20px; height: 20px; display: flex; justify-content: center; align-items: center; font-size: 10px; color: #475569; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.locked-text { color: #cbd5e1; }
</style>