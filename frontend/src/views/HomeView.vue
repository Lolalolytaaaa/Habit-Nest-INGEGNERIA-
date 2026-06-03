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
                :key="habit._id"
                :title="habit.title" 
                :emoji="habit.emoji" 
                :time="habit.time" 
                :isDone="habit.completed"
                @toggle="toggleHabit(habit._id)"
                @remove="removeHabit(habit._id)"
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
      activeDay: { year: oggi.getFullYear(), month: oggi.getMonth(), number: oggi.getDate() },
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
      habits: []
    }
  },
  async created() {
    try {
      const response = await fetch('http://localhost:3000/api/habits');
      this.habits = await response.json();
    } catch (error) {
      console.error("Errore caricamento dati:", error);
    }
  },
  computed: {
    filteredHabits() {
      const currentKey = this.getCurrentDateKey();
      return this.habits.filter(h => h.date === currentKey);
    },
    formattedDate() {
      let dateToDisplay = this.activeDay ? new Date(this.activeDay.year, this.activeDay.month, this.activeDay.number) : this.today;
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      let dateString = dateToDisplay.toLocaleDateString('it-IT', options);
      return dateString.charAt(0).toUpperCase() + dateString.slice(1);
    }
  },
  methods: {
    getCurrentDateKey() {
      const y = this.activeDay ? this.activeDay.year : this.today.getFullYear();
      const m = (this.activeDay ? this.activeDay.month : this.today.getMonth()) + 1;
      const d = this.activeDay ? this.activeDay.number : this.today.getDate();
      return `${y}-${m}-${d}`;
    },
    showMonth(monthIndex) { 
      if (typeof monthIndex === 'number') this.selectedMonth = monthIndex;
      this.viewLevel = 'month'; 
    },
    updateSelectedMonth(monthIndex) { this.selectedMonth = monthIndex; },
    showDay(day) {
      if (!day || !day.number) return;
      this.activeDay = day;
      this.viewLevel = 'day'; 
    },
    handleManualAdd() {
      if (this.newHabitTitle.trim() === '') return;
      this.addFromLibrary({ title: this.newHabitTitle, emoji: "✨", time: "In giornata" });
      this.newHabitTitle = '';
    },
    async addFromLibrary(template) {
      const nuovaAbitudine = {
        title: template.title,
        emoji: template.emoji,
        time: template.time,
        date: this.getCurrentDateKey(),
        completed: false
      };
      try {
        const response = await fetch('http://localhost:3000/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuovaAbitudine)
        });
        const savedHabit = await response.json();
        this.habits.push(savedHabit);
        this.isLibraryOpen = false;
      } catch (err) { console.error(err); }
    },
    async removeHabit(id) {
      try {
        await fetch(`http://localhost:3000/api/habits/${id}`, { method: 'DELETE' });
        this.habits = this.habits.filter(h => h._id !== id);
      } catch (err) { console.error(err); }
    },
    async toggleHabit(id) {
      try {
        const response = await fetch(`http://localhost:3000/api/habits/${id}`, { method: 'PUT' });
        const updatedHabit = await response.json();
        const index = this.habits.findIndex(h => h._id === id);
        if (index !== -1) this.habits[index] = updatedHabit;
      } catch (err) { console.error(err); }
    },
    toggleHabitById(id) { this.toggleHabit(id); }
  }
}
</script>