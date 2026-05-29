<template>
  <div class="matcha-day-view">
    <transition name="pop">
      <div v-if="showSuccessModal" class="success-overlay" @click.self="showSuccessModal = false">
        <div class="success-card">
          <div class="success-icon">🌿</div>
          <h2 class="success-title">Ottimo lavoro!</h2>
          <p class="success-message">Hai completato tutte le tue abitudini per oggi. Continua così per mantenere alta la tua costanza!</p>
          <button class="close-modal-btn" @click="showSuccessModal = false">Fantastico!</button>
        </div>
      </div>
    </transition>

    <header class="day-header">
      <button class="back-btn" @click="$emit('zoom-out-to-month')">
        <span class="arrow">←</span> {{ monthNames[selectedDay.month] }}
      </button>
      <h2 class="day-title">{{ selectedDay.number }} {{ monthNames[selectedDay.month] }}</h2>
      <p class="day-year-label">{{ selectedDay.year }}</p>
    </header>

    <div class="day-content-container">
      <section class="progress-summary">
        <div class="progress-info">
          <span class="progress-text">Progressi di oggi</span>
          <span class="progress-percentage">{{ completionPercentage }}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: completionPercentage + '%' }"></div>
        </div>
      </section>

      <h3 class="section-label">Le tue attività</h3>
      
      <div class="habits-day-list">
        <HabitCard 
          v-for="habit in habits" 
          :key="habit.id"
          :title="habit.title"
          :emoji="habit.emoji"
          :time="habit.time"
          :isDone="habit.completed"
          @toggle="$emit('update-habits', habit.id)"
        />
        
        <div v-if="habits.length === 0" class="empty-state">
          <p>Non hai ancora aggiunto abitudini. Torna alla dashboard per iniziare!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HabitCard from './HabitCard.vue'

export default {
  name: 'CalendarDay',
  components: { HabitCard },
  props: ['selectedDay', 'habits'],
  data() {
    return {
      showSuccessModal: false,
      monthNames: [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
      ]
    }
  },
  computed: {
    completionPercentage() {
      return 0; 
    }
  },
  watch: {
    completionPercentage(newVal) {}
  }
}
</script>

<style scoped>
</style>