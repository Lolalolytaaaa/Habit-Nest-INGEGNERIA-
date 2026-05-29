<template>
  <div class="full-year-view">
    <header class="year-header">
      <h1 class="display-year">{{ year }}</h1>
    </header>

    <div class="months-grid-full">
      <div 
        v-for="(month, index) in months" 
        :key="index" 
        class="month-card-full"
        @click="$emit('zoom-to-month', index)"
      >
        <h3 class="month-label" :class="{ 'highlight': isCurrentMonth(index) }">{{ month }}</h3>
        
        <div class="mini-days-full">
          <div v-for="n in 31" :key="n" class="day-dot-matcha"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarYear',
  props: ['year'],
  data() {
    return {
      months: [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
      ]
    }
  },
  methods: {
    isCurrentMonth(index) {
      const today = new Date();
      const checkYear = this.year === today.getFullYear();
      const checkMonth = index === today.getMonth();
      
      return checkYear && checkMonth;
    }
  }
}
</script>

<style scoped>
.full-year-view { 
  width: 100%; 
  min-height: 100vh; 
  padding: 20px 60px; 
  background-color: var(--matcha-bg); 
}

.display-year { 
  font-size: 64px; 
  font-weight: 700; 
  color: var(--matcha-dark); 
  margin-bottom: 40px; 
}

.months-grid-full { 
  display: grid; 
  grid-template-columns: repeat(4, 1fr); 
  gap: 30px; 
}

.month-card-full {
  background: white;
  padding: 25px;
  border-radius: 24px;
  border: 1px solid var(--matcha-soft);
  cursor: pointer;
  transition: transform 0.2s;
}

.month-card-full:hover { 
  transform: translateY(-5px); 
  box-shadow: 0 10px 20px rgba(69,88,38,0.1); 
}

.month-label { 
  font-size: 20px; 
  font-weight: 700; 
  color: var(--matcha-mid); 
  margin-bottom: 15px; 
}

.month-label.highlight { 
  color: var(--matcha-dark); 
  text-decoration: underline; 
}

.mini-days-full { 
  display: grid; 
  grid-template-columns: repeat(7, 1fr); 
  gap: 8px; 
}

.day-dot-matcha { 
  width: 6px; 
  height: 6px; 
  background-color: var(--matcha-soft); 
  border-radius: 50%; 
}
</style>