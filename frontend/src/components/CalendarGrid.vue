<template>
  <div class="matcha-calendar-container">
    <header class="calendar-header">
      <div class="header-left">
        <button class="nav-year-btn" @click="$emit('zoom-out-to-year')">
          <span class="arrow">&lt;</span> {{ currentYear }}
        </button>
      </div>

      <div class="month-navigator">
        <button class="month-nav-btn" @click="prevMonth">◀</button>
        <h1 class="month-title">{{ monthNames[currentMonthIndex] }}</h1>
        <button class="month-nav-btn" @click="nextMonth">▶</button>
      </div>

      <div class="header-right">
        <button class="menu-btn">
          <svg viewBox="0 0 24 24" class="matcha-icon">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="matcha-grid-wrapper">
      <div class="weekdays-row">
        <span v-for="l in ['L','M','M','G','V','S','D']" :key="l" class="weekday-label">{{l}}</span>
      </div>

      <div class="days-grid">
        <div 
          v-for="(day, index) in daysInGrid" 
          :key="index" 
          class="day-cell"
          :class="{ 'is-today': isToday(day), 'empty': !day.number }"
          @click="onDayClick(day)"
        >
          <span class="day-number">{{ day.number }}</span>
          
          <div v-if="day.number" class="event-blocks">
            <div 
              v-for="(habit, hIndex) in getHabitsForDay(day).slice(0, 2)" 
              :key="habit.id" 
              class="event-block"
              :class="hIndex === 0 ? 'block-green' : 'block-light'"
            >
              {{ habit.title }}
            </div>
            <div v-if="getHabitsForDay(day).length > 2" class="more-indicator">
              +{{ getHabitsForDay(day).length - 2 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarGrid',
  props: ['year', 'initialMonth', 'habits'],
  emits: ['zoom-out-to-year', 'zoom-in-to-day', 'change-year', 'change-month'],
  data() {
    return {
      currentMonthIndex: 0, 
      currentYear: 2026,
      monthNames: [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
      ]
    }
  },
  computed: {
    daysInGrid() { return []; }
  },
  methods: {
    getHabitsForDay(day) { return []; },
    prevMonth() {},
    nextMonth() {},
    isToday(day) { return false; },
    onDayClick(day) {}
  }
}
</script>

<style scoped>
</style>