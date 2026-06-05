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
import { ref, onMounted, computed } from 'vue'

const username = ref('Lola')
const selectedFilter = ref('Globale')

const badgeTiers = [
  { min: 365, name: 'Guardiano del Nido', icon: 'fa-solid fa-shield-halved', color: 'linear-gradient(135deg, #166534, #022c22)' },
  { min: 300, name: 'Primo Volo', icon: 'fa-solid fa-feather-pointed', color: 'linear-gradient(135deg, #15803d, #064e3b)' },
  { min: 200, name: 'Nuovo Nido', icon: 'fa-solid fa-egg', color: 'linear-gradient(135deg, #16a34a, #14532d)' },
  { min: 100, name: 'Dolce Frutto', icon: 'fa-solid fa-apple-whole', color: 'linear-gradient(135deg, #22c55e, #166534)' },
  { min: 60, name: 'Radici Forti', icon: 'fa-solid fa-tree', color: 'linear-gradient(135deg, #4ade80, #15803d)' },
  { min: 30, name: 'Primo Germoglio', icon: 'fa-solid fa-leaf', color: 'linear-gradient(135deg, #bbf7d0, #22c55e)' },
  { min: 0,  name: 'Piccolo Seme', icon: 'fa-solid fa-seedling', color: 'linear-gradient(135deg, #d9f99d, #84cc16)' }
]

const getBadge = (streak) => {
  return badgeTiers.find(tier => streak >= tier.min)
}

const allLeaderboards = ref({
  'Globale': [
    { name: 'Elena', streak: 380, icon: 'fa-solid fa-sun', color: '#f59e0b' },
    { name: 'Marco', streak: 310, icon: 'fa-solid fa-mountain', color: '#EAB308' },
    { name: 'Sofia', streak: 215, icon: 'fa-solid fa-moon', color: '#4338ca' },
    { name: 'Davide', streak: 120, icon: 'fa-solid fa-cloud', color: '#ec4899' },
    { name: 'Lola',  streak: 65,  icon: 'fa-solid fa-dove', color: '#2d6a4f' },
    { name: 'Giulia', streak: 35,  icon: 'fa-solid fa-clover', color: '#92AA58' },
    { name: 'Luca',  streak: 18,  icon: 'fa-solid fa-droplet', color: '#10b981' },
    { name: 'Pietro', streak: 0,   icon: 'fa-solid fa-cloud', color: '#64748b' }
  ],
  'Mensile': [
    { name: 'Sofia', streak: 28, icon: 'fa-solid fa-moon', color: '#4338ca' },
    { name: 'Elena', streak: 25, icon: 'fa-solid fa-sun', color: '#f59e0b' },
    { name: 'Giulia', streak: 19, icon: 'fa-solid fa-clover', color: '#92AA58' },
    { name: 'Lola',  streak: 15,  icon: 'fa-solid fa-dove', color: '#2d6a4f' },
    { name: 'Marco', streak: 12, icon: 'fa-solid fa-mountain', color: '#EAB308' },
    { name: 'Luca',  streak: 5,  icon: 'fa-solid fa-droplet', color: '#10b981' },
    { name: 'Davide', streak: 3, icon: 'fa-solid fa-cloud', color: '#ec4899' },
    { name: 'Pietro', streak: 0, icon: 'fa-solid fa-cloud', color: '#64748b' }
  ],
  'Settimanale': [
    { name: 'Lola',  streak: 7,  icon: 'fa-solid fa-dove', color: '#2d6a4f' },
    { name: 'Marco', streak: 5,  icon: 'fa-solid fa-mountain', color: '#EAB308' },
    { name: 'Elena', streak: 4,  icon: 'fa-solid fa-sun', color: '#f59e0b' },
    { name: 'Luca',  streak: 3,  icon: 'fa-solid fa-droplet', color: '#10b981' },
    { name: 'Sofia', streak: 2,  icon: 'fa-solid fa-moon', color: '#4338ca' },
    { name: 'Giulia', streak: 2, icon: 'fa-solid fa-clover', color: '#92AA58' },
    { name: 'Davide', streak: 1, icon: 'fa-solid fa-cloud', color: '#ec4899' },
    { name: 'Pietro', streak: 0, icon: 'fa-solid fa-cloud', color: '#64748b' }
  ]
})

const filteredUsers = computed(() => {
  const currentList = allLeaderboards.value[selectedFilter.value] || []
  return [...currentList].sort((a, b) => b.streak - a.streak)
})

onMounted(() => {
  const savedProfile = localStorage.getItem('habitNest_profile_data')
  if (savedProfile) {
    try {
      const data = JSON.parse(savedProfile)
      username.value = data.username || 'Lola'
      
      Object.values(allLeaderboards.value).forEach(list => {
        const userIndex = list.findIndex(u => u.name === 'Lola' || u.name === data.username)
        if (userIndex !== -1) {
          list[userIndex].name = data.username || 'Lola'
          list[userIndex].icon = data.profileIcon || 'fa-solid fa-dove'
          list[userIndex].color = data.profileColor || '#2d6a4f'
        }
      })
    } catch (e) {
      console.error("Errore lettura dati profilo in classifica", e)
    }
  }
})
</script>

<style scoped>
.leaderboard-container { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }
.welcome-section { text-align: center; margin-bottom: 40px; }
.welcome-section h1 { color: var(--matcha-dark); font-size: 32px; margin-bottom: 8px; }
.quote { font-style: italic; color: var(--matcha-mid); margin-bottom: 25px; font-size: 18px; }

.filter-tabs { display: flex; justify-content: center; gap: 12px; margin-bottom: 30px; }
.filter-btn { 
  background: var(--matcha-soft); border: 1.5px solid var(--matcha-dark); 
  padding: 8px 20px; border-radius: 20px; font-weight: 700; cursor: pointer; 
}
.filter-btn.active { background: var(--matcha-dark); color: white; }

.leaderboard-card {
  background: white; border-radius: 32px; padding: 30px;
  box-shadow: 0 10px 40px rgba(69, 88, 38, 0.08);
}

.grid-layout {
  display: grid;
  grid-template-columns: 80px 1.5fr 1fr 1.5fr;
  align-items: center;
  gap: 15px;
}

.table-labels {
  padding: 0 20px 15px; border-bottom: 2px solid var(--matcha-bg);
  color: var(--matcha-mid); font-weight: 700; font-size: 12px;
}

.user-row { padding: 15px 20px; border-bottom: 1px solid var(--matcha-soft); }
.user-row.is-me { background: var(--matcha-bg); border-radius: 16px; border: 1.5px solid var(--matcha-green); margin: 4px 0; }

.avatar-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; }
.user-name { font-weight: 700; color: var(--matcha-dark); }
.streak-cell { display: flex; align-items: center; font-weight: 800; color: #f59e0b; }
.streak-text { color: var(--matcha-mid); font-size: 13px; margin-left: 8px; }
.badge-cell { display: flex; align-items: center; gap: 10px; font-weight: 700; color: var(--matcha-dark); }
.mini-badge-icon { width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; }

@media (max-width: 768px) {
  .grid-layout { grid-template-columns: 50px 1fr 100px; }
  .col-badge, .table-labels { display: none; }
}
</style>