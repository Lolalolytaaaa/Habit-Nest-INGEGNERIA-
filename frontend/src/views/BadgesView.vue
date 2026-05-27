<template>
  <div class="leaderboard-container">
    <header class="welcome-section">
      <h1>Bentornata, {{ username }}! 🌱</h1>
      <p class="quote">"Le radici più forti crescono nel silenzio della pratica quotidiana"</p>
      
      <div class="filter-tabs">
        <button 
          v-for="filter in ['Settimanale', 'Mensile', 'Globale']" 
          :key="filter"
          :class="['filter-btn', { active: selectedFilter === filter }]"
          @click="selectedFilter = filter"
        >
          {{ filter }}
        </button>
      </div>
    </header>

    <section class="leaderboard-card">
      <div class="leaderboard-header">
        <h2 class="section-title">Classifica {{ selectedFilter }}</h2>
        <div class="grid-layout table-labels">
          <span class="col-pos">POS.</span>
          <span class="col-user">UTENTE</span>
          <span class="col-streak">STREAK</span>
          <span class="col-badge">MIGLIOR BADGE</span>
        </div>
      </div>

      <div class="leaderboard-list">
        <div 
          v-for="(user, index) in filteredUsers" 
          :key="user.name" 
          :class="['grid-layout', 'user-row', { 'is-me': user.name === username }]"
        >
          <div class="col-pos rank-number">#{{ index + 1 }}</div>

          <div class="col-user user-cell">
            <div class="avatar-circle" :style="{ backgroundColor: user.color }">
              <i :class="user.icon"></i>
            </div>
            <span class="user-name">{{ user.name }}</span>
          </div>

          <div class="col-streak streak-cell">
            <span class="streak-fire">🔥 {{ user.streak }}</span>
            <span class="streak-text">giorni</span>
          </div>

          <div class="col-badge badge-cell">
            <div class="mini-badge-icon" :style="{ background: getBadge(user.streak).color }">
              <i :class="getBadge(user.streak).icon"></i>
            </div>
            <span class="badge-name">{{ getBadge(user.streak).name }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const username = ref('Lola')
const selectedFilter = ref('Globale')

const getBadge = (streak) => {
  return { name: '...', icon: '', color: '#e2e8f0' }
}

const filteredUsers = computed(() => [])
</script>

<style scoped>
</style>