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
      currentMonthIndex: this.initialMonth !== undefined ? this.initialMonth : new Date().getMonth(), 
      currentYear: this.year || new Date().getFullYear(),
      monthNames: [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
      ]
    }
  },
  watch: {
    year(newYear) {
      this.currentYear = newYear;
    },
    initialMonth(newMonth) {
      this.currentMonthIndex = newMonth;
    }
  },
  computed: {
    daysInGrid() {
      const year = this.currentYear;
      const month = this.currentMonthIndex;
      const firstDayDate = new Date(year, month, 1);
      const firstDayJS = firstDayDate.getDay(); 
      const startOffset = (firstDayJS === 0) ? 6 : firstDayJS - 1;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const grid = [];

      for (let i = 0; i < startOffset; i++) {
        grid.push({ number: '', isToday: false });
      }

      for (let i = 1; i <= daysInMonth; i++) {
        grid.push({
          number: i,
          year: year,
          month: month
        });
      }

      const remaining = 42 - grid.length;
      for (let i = 0; i < remaining; i++) {
        grid.push({ number: '', isToday: false });
      }

      return grid;
    }
  },
  methods: {
    getHabitsForDay(day) {
      if (!day.number || !this.habits) return [];
      const dateKey = `${day.year}-${day.month + 1}-${day.number}`;
      return this.habits.filter(h => h.date === dateKey);
    },
    prevMonth() {
      if (this.currentMonthIndex === 0) {
        this.currentMonthIndex = 11;
        this.currentYear--;
        this.$emit('change-year', this.currentYear);
      } else {
        this.currentMonthIndex--;
      }
      this.$emit('change-month', this.currentMonthIndex);
    },
    nextMonth() {
      if (this.currentMonthIndex === 11) {
        this.currentMonthIndex = 0;
        this.currentYear++;
        this.$emit('change-year', this.currentYear);
      } else {
        this.currentMonthIndex++;
      }
      this.$emit('change-month', this.currentMonthIndex);
    },
    isToday(day) {
      if (!day.number) return false;
      const today = new Date();
      return today.getDate() === day.number &&
             today.getMonth() === this.currentMonthIndex &&
             today.getFullYear() === this.currentYear;
    },
    onDayClick(day) {
      if (day.number) {
        this.$emit('zoom-in-to-day', {
          number: day.number,
          month: day.month,
          year: day.year
        });
      }
    }
  }
}
</script>

<style scoped>
.matcha-calendar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-white);
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}
.month-navigator {
  display: flex;
  align-items: center;
  gap: 15px;
}
.month-nav-btn {
  background: none;
  border: none;
  color: var(--matcha-mid);
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s ease;
}
.month-nav-btn:hover { transform: scale(1.2); }
.month-title {
  color: var(--matcha-dark);
  font-size: 22px;
  font-weight: 700;
  min-width: 120px;
  text-align: center;
}

.nav-year-btn {
  font-family: 'Quicksand', sans-serif; 
  background: none;
  border: none;
  color: var(--matcha-mid);
  font-size: 18px; 
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px; 
  transition: color 0.2s ease;
}

.nav-year-btn:hover {
  color: var(--matcha-dark);
}

.matcha-grid-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0 12px 12px;
}
.weekdays-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding-bottom: 12px;
}
.weekday-label {
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--matcha-mid);
}
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid var(--matcha-soft);
  border-radius: 16px;
  overflow: hidden;
}
.day-cell {
  border-right: 1px solid var(--matcha-soft);
  border-bottom: 1px solid var(--matcha-soft);
  padding: 4px;
  min-height: 60px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}
.day-cell:hover:not(.empty) {
  background-color: var(--color-white);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(69, 88, 38, 0.1);
  z-index: 10;
}
.day-cell.empty { background-color: var(--matcha-bg); cursor: default; }
.day-number { font-size: 14px; font-weight: 700; color: var(--matcha-dark); }

.is-today .day-number {
  background-color: transparent;
  color: #ff5e57;
  border: 2px solid #ff5e57;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
}

.event-blocks { display: flex; flex-direction: column; gap: 2px; margin-top: 4px; }
.event-block {
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 4px;
  color: var(--matcha-dark);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: slide-in 0.3s ease-out;
}
@keyframes slide-in {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
.block-green { background-color: var(--matcha-green); }
.block-light { background-color: var(--matcha-light); }
.more-indicator { font-size: 8px; color: var(--matcha-mid); font-weight: 700; padding-left: 4px; }
</style>