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
      if (!this.habits || this.habits.length === 0) {
        return 0;
      }
      
      let completedCount = 0;
      for (let i = 0; i < this.habits.length; i++) {
        if (this.habits[i].completed) {
          completedCount++;
        }
      }
      
      return Math.round((completedCount / this.habits.length) * 100);
    }
  },
  watch: {
    completionPercentage(newVal) {
      if (newVal === 100) {
        this.showSuccessModal = true;
      }
    }
  }
}
</script>

<style scoped>
.matcha-day-view {
  min-height: 100vh;
  background-color: var(--matcha-bg);
  display: flex;
  flex-direction: column;
  font-family: 'Quicksand', sans-serif;
}

.success-overlay {
  position: fixed;
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  background-color: rgba(69, 88, 38, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.success-card {
  background: white;
  padding: 40px;
  border-radius: 32px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 1px solid var(--matcha-soft);
}

.success-icon { 
  font-size: 64px; 
  margin-bottom: 20px; 
}
.success-title { 
  color: var(--matcha-dark); 
  margin-bottom: 10px; 
  font-size: 28px; 
  font-weight: 700; 
}
.success-message { 
  color: var(--matcha-mid); 
  margin-bottom: 30px; 
  line-height: 1.5; 
  font-weight: 500; 
}

.close-modal-btn {
  background-color: var(--matcha-dark);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 16px;
  font-weight: 700;
  font-family: 'Quicksand', sans-serif;
  cursor: pointer;
  transition: transform 0.2s;
}

.close-modal-btn:hover { 
  transform: scale(1.05); 
}

.pop-enter-active { 
  animation: pop-in 0.3s ease-out; 
}
.pop-leave-active { 
  animation: pop-in 0.2s reverse ease-in; 
}

@keyframes pop-in {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.day-header { 
  padding: 30px 20px 10px; 
}
@media (min-width: 1024px) { 
  .day-header { padding: 40px 60px 20px; } 
}

.back-btn { 
  background: none; 
  border: none; 
  color: var(--matcha-mid); 
  font-size: 16px; 
  font-weight: 700; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  margin-bottom: 10px; 
}

.day-title { 
  font-size: 36px; 
  font-weight: 700; 
  color: var(--matcha-dark); 
}
.day-year-label { 
  font-size: 18px; 
  color: var(--matcha-mid); 
  font-weight: 500; 
}

.day-content-container { 
  padding: 20px; 
  max-width: 800px; 
}
@media (min-width: 1024px) { 
  .day-content-container { padding: 20px 60px; } 
}

.progress-summary { 
  background: white; 
  padding: 24px; 
  border-radius: 24px; 
  box-shadow: 0 4px 15px rgba(69, 88, 38, 0.05); 
  margin-bottom: 30px; 
  border: 1px solid var(--matcha-soft); 
}
.progress-info { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 12px; 
}
.progress-text { 
  font-weight: 700; 
  color: var(--matcha-dark); 
}
.progress-percentage { 
  font-weight: 700; 
  color: var(--matcha-green); 
}
.progress-bar-bg { 
  height: 10px; 
  background: var(--matcha-bg); 
  border-radius: 10px; 
}
.progress-bar-fill { 
  height: 100%; 
  background: var(--matcha-green); 
  border-radius: 10px; 
  transition: width 0.4s ease-in-out; 
}

.section-label { 
  font-size: 13px; 
  font-weight: 700; 
  color: var(--matcha-mid); 
  text-transform: uppercase; 
  letter-spacing: 1.5px; 
  margin-bottom: 20px; 
}
.habits-day-list { 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
}
.empty-state { 
  padding: 40px; 
  text-align: center; 
  background: white; 
  border-radius: 24px; 
  border: 1.5px dashed var(--matcha-soft); 
  color: var(--matcha-mid); 
}
</style>