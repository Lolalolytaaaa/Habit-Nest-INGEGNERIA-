<template>
  <div class="app-viewport">
    <transition name="ios-zoom" mode="out-in">
      
      <CalendarYear 
        v-if="viewLevel === 'year'" 
        :year="selectedYear" 
        @zoom-to-month="showMonth" 
      />

      <div v-else-if="viewLevel === 'month'" class="dashboard-content">
        <header class="dashboard-header">
          <div class="today-badge">
            <span class="status-text">{{ formattedDate }}</span>
          </div>
        </header>

        <main class="main-dashboard-grid">
          <section class="calendar-card-expanded">
            <CalendarGrid 
              :year="selectedYear"
              :initialMonth="selectedMonth"
              :habits="habits"
              @zoom-out-to-year="viewLevel = 'year'"
              @zoom-in-to-day="showDay"
              @change-month="updateSelectedMonth"
            />
          </section>

          <aside class="habits-sidebar">
            <h2 class="sidebar-label">Abitudini</h2>

            <div class="add-habit-container">
              <div class="add-habit-module">
                <input 
                  v-model="newHabitTitle" 
                  type="text" 
                  placeholder="Nuova abitudine..." 
                  @keyup.enter="handleManualAdd"
                />
                <button 
                  class="toggle-library-btn" 
                  :class="{ 'active': isLibraryOpen }"
                  @click="isLibraryOpen = !isLibraryOpen"
                >
                  +
                </button>
              </div>

              <transition name="dropdown-fade">
                <div v-if="isLibraryOpen" class="habit-library-dropdown">
                  <h3 class="dropdown-label">Scegli dalla libreria</h3>
                  <div class="library-grid">
                    <button 
                      v-for="template in habitLibrary" 
                      :key="template.title"
                      class="library-item"
                      @click="addFromLibrary(template)"
                    >
                      <span class="lib-emoji">{{ template.emoji }}</span>
                      <span class="lib-title">{{ template.title }}</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <transition-group name="list-stagger" tag="div" class="habits-list">
              <HabitCard 
                v-for="habit in filteredHabits" 
                :key="habit.id"
                :title="habit.title" 
                :emoji="habit.emoji" 
                :time="habit.time" 
                :isDone="habit.completed"
                @toggle="toggleHabit(habit.id)"
                @remove="removeHabit(habit.id)"
              />
            </transition-group>
          </aside>
        </main>
      </div>

      <CalendarDay 
        v-else-if="viewLevel === 'day'" 
        :selectedDay="activeDay" 
        :habits="filteredHabits"
        @zoom-out-to-month="viewLevel = 'month'"
        @update-habits="toggleHabitById"
      />

    </transition>
  </div>
</template>

<script>
import CalendarYear from '../components/CalendarYear.vue'
import CalendarGrid from '../components/CalendarGrid.vue'
import CalendarDay from '../components/CalendarDay.vue'
import HabitCard from '../components/HabitCard.vue'

export default {
  name: 'HomeView',
  components: { CalendarYear, CalendarGrid, CalendarDay, HabitCard },
  props: ['selectedYear'],
  data() {
    const oggi = new Date();
    return {
      viewLevel: 'month', 
      activeDay: {
        year: oggi.getFullYear(),
        month: oggi.getMonth(),
        number: oggi.getDate()
      },
      selectedMonth: oggi.getMonth(),
      today: oggi,
      newHabitTitle: '',
      isLibraryOpen: false, 
      habitLibrary: [
        { title: "Meditazione", emoji: "🧘‍♂️", time: "08:00" },
        { title: "Corsa", emoji: "🏃‍♂️", time: "07:30" },
        { title: "Bere Acqua", emoji: "💧", time: "Tutto il giorno" },
        { title: "Leggere", emoji: "📚", time: "21:00" },
        { title: "Stretching", emoji: "🤸‍♂️", time: "08:30" },
        { title: "Journaling", emoji: "✍️", time: "22:00" },
        { title: "Vitamine", emoji: "💊", time: "Colazione" },
        { title: "Passeggiata", emoji: "🌲", time: "Pomeriggio" },
        { title: "Pulizia", emoji: "🧹", time: "10:00" },
        { title: "Letto rifatto", emoji: "🛏️", time: "07:00" },
        { title: "Skin Care", emoji: "🧼", time: "Mattina/Sera" },
        { title: "No Social", emoji: "📵", time: "1 ora" }
      ],
      habits: JSON.parse(localStorage.getItem('habit-nest-data')) || []
    }
  },
  computed: {
    filteredHabits() {
      const currentKey = this.getCurrentDateKey();
      return this.habits.filter(function(h) {
        return h.date === currentKey;
      });
    },
    formattedDate() {
      let dateToDisplay = this.today;
      if (this.activeDay) {
        dateToDisplay = new Date(this.activeDay.year, this.activeDay.month, this.activeDay.number);
      }
      
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      let dateString = dateToDisplay.toLocaleDateString('it-IT', options);
      return dateString.charAt(0).toUpperCase() + dateString.slice(1);
    }
  },
  methods: {
    getCurrentDateKey() {
      let y = this.today.getFullYear();
      let m = this.today.getMonth() + 1;
      let d = this.today.getDate();

      if (this.activeDay) {
        y = this.activeDay.year;
        m = this.activeDay.month + 1;
        d = this.activeDay.number;
      }
      
      return y + '-' + m + '-' + d;
    },
    showMonth(monthIndex) { 
      if (typeof monthIndex === 'number') {
        this.selectedMonth = monthIndex;
      }
      this.viewLevel = 'month'; 
    },
    updateSelectedMonth(monthIndex) {
      this.selectedMonth = monthIndex;
    },
    showDay(day) {
      if (!day || !day.number) return;
      this.activeDay = day;
      this.viewLevel = 'day'; 
    },
    saveHabits() {
      localStorage.setItem('habit-nest-data', JSON.stringify(this.habits));
    },
    handleManualAdd() {
      if (this.newHabitTitle.trim() === '') return;
      
      const nuovoTemplate = {
        title: this.newHabitTitle,
        emoji: "✨",
        time: "In giornata"
      };
      
      this.addFromLibrary(nuovoTemplate);
      this.newHabitTitle = '';
    },
    addFromLibrary(template) {
      const nuovaAbitudine = {
        id: Date.now(),
        title: template.title,
        emoji: template.emoji,
        time: template.time,
        date: this.getCurrentDateKey(),
        completed: false
      };
      
      this.habits.push(nuovaAbitudine);
      this.saveHabits();
      this.isLibraryOpen = false;
    },
    removeHabit(id) {
      const index = this.habits.findIndex(function(h) {
        return h.id === id;
      });
      if (index !== -1) {
        this.habits.splice(index, 1);
        this.saveHabits();
      }
    },
    toggleHabit(id) {
      for (let i = 0; i < this.habits.length; i++) {
        if (this.habits[i].id === id) {
          this.habits[i].completed = !this.habits[i].completed;
          this.saveHabits();
        }
      }
    },
    toggleHabitById(id) {
      this.toggleHabit(id);
    }
  }
}
</script>

<style scoped>
.dashboard-content { 
  padding: 0 16px 40px 16px; 
  background-color: var(--matcha-bg); 
  min-height: 100vh;
  transition: padding 0.3s ease;
}

.dashboard-header { 
  padding: 20px 0 30px 5px; 
}

.today-badge { 
  display: inline-flex; 
  align-items: center; 
  background-color: var(--matcha-soft); 
  padding: 10px 24px; 
  border-radius: 50px; 
  box-shadow: 0 2px 10px rgba(69, 88, 38, 0.05); 
}
.status-text { 
  font-size: 14px; 
  font-weight: 700; 
  color: var(--matcha-dark); 
  text-transform: uppercase; 
  letter-spacing: 0.5px; 
}

.main-dashboard-grid { 
  display: grid; 
  grid-template-columns: 1fr; 
  gap: 30px; 
  width: 100%;
}

@media (min-width: 1024px) { 
  .dashboard-content { 
    padding: 0 20px 40px 20px; 
  } 
  .main-dashboard-grid { 
    grid-template-columns: 1fr 350px; 
    gap: 35px; 
  } 
}

.calendar-card-expanded { 
  background: white; 
  border-radius: 24px; 
  border: 1px solid var(--matcha-soft); 
  box-shadow: 0 10px 40px rgba(69, 88, 38, 0.08); 
  overflow: hidden; 
  width: 100%; 
}

.sidebar-label { 
  font-size: 20px; 
  font-weight: 700; 
  margin-bottom: 20px; 
  color: var(--matcha-mid); 
}
.add-habit-container { 
  position: relative; 
  margin-bottom: 24px; 
}
.add-habit-module { 
  display: flex; 
  gap: 10px; 
}
.add-habit-module input { 
  flex: 1; 
  background: var(--color-white); 
  border: 1px solid var(--matcha-soft); 
  padding: 12px 16px; 
  border-radius: 14px; 
  font-family: 'Quicksand', sans-serif; 
  outline: none; 
}
.toggle-library-btn { 
  background-color: var(--matcha-dark); 
  color: var(--matcha-bg); 
  border: none; 
  width: 42px; 
  height: 42px; 
  border-radius: 14px; 
  font-size: 20px; 
  font-weight: 700; 
  cursor: pointer; 
  transition: all 0.3s ease; 
}

.toggle-library-btn.active { 
  transform: rotate(45deg); 
  background-color: var(--matcha-mid); 
}
.habit-library-dropdown { 
  position: absolute; 
  top: calc(100% + 10px); 
  right: 0; 
  left: 0; 
  background: white; 
  border-radius: 20px; 
  border: 1px solid var(--matcha-soft); 
  box-shadow: 0 15px 30px rgba(69, 88, 38, 0.15); 
  padding: 20px; 
  z-index: 100; 
}
.dropdown-label { 
  font-size: 11px; 
  font-weight: 700; 
  color: var(--matcha-mid); 
  text-transform: uppercase; 
  letter-spacing: 1px; 
  margin-bottom: 15px; 
  transition: color 0.3s ease;
}

.library-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 10px; 
}
.library-item { 
  background: var(--matcha-bg); 
  border: none; 
  padding: 12px; 
  border-radius: 12px; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  cursor: pointer; 
  transition: all 0.2s; 
  text-align: left; 
}
.library-item:hover { 
  background-color: var(--matcha-soft); 
  transform: scale(1.02); 
}
.lib-emoji { font-size: 18px; }
.lib-title { font-size: 13px; font-weight: 700; color: var(--matcha-dark); }

.habits-list { 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
  position: relative; 
}
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: all 0.3s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-10px); }
.list-stagger-enter-active, .list-stagger-leave-active { transition: all 0.5s ease; }
.list-stagger-enter-from { opacity: 0; transform: translateX(30px); }
.list-stagger-leave-to { opacity: 0; transform: scale(0.5); position: absolute; }
.ios-zoom-enter-active, .ios-zoom-leave-active { transition: all 0.4s ease; }
</style>