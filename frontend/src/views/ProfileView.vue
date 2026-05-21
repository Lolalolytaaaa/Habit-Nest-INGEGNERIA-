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
          <span class="badge-tag" v-for="adj in selectedAdjectives" :key="adj">{{ adj }}</span>
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

      <div class="badges-section">
        <h3 class="section-title">I Miei Traguardi</h3>
        
        <div class="badges-grid">
          <div 
            v-for="badge in unlockedBadges" 
            :key="badge.id" 
            :class="['badge-item', { 'giant-badge': badge.isGiant }]"
          >
            <div class="badge-icon" :style="{ background: badge.color }">
              <i :class="badge.icon"></i>
            </div>
            <span class="badge-name">{{ badge.name }}</span>
          </div>
        </div>

        <button class="btn btn-secondary" @click="isModalOpen = true">
          <i class="fa-solid fa-medal"></i> Tutti i badge
        </button>
      </div>

    </div>

    <div v-else class="settings">
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
import { ref, computed } from 'vue'

const isEditing = ref(false)
const isModalOpen = ref(false)
const username = ref('Utente')
const profileColor = ref('#2d6a4f') 
const profileIcon = ref('fa-solid fa-dove')
const bio = ref('')
const isPublic = ref(false) 

const availableAdjectives = []
const selectedAdjectives = ref([])
const availableInterests = []
const selectedInterests = ref([])
const allBadges = ref([])
const unlockedBadges = computed(() => [])

const saveProfile = () => {}
const toggleAdjective = () => {}
const toggleInterest = () => {}
</script>

<style scoped>
</style>