<template>
  <nav class="matcha-navbar">
    <div class="navbar-left">
      <span class="brand-name">habit nest</span>
    </div>
    
    <div class="navbar-right">
      <button 
        class="theme-toggle-btn" 
        @click="toggleTheme" 
        :title="isDark ? 'Attiva modalità chiara' : 'Attiva modalità scura'"
      >
        <i :class="isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'"></i>
      </button>

      <div class="year-selector-pill">
        <select v-model="selectedYear" @change="onYearChange" class="hidden-select">
          <option v-for="y in [2023, 2024, 2025, 2026]" :key="y" :value="y">{{ y }}</option>
        </select>
        <div class="pill-content">
          <span class="year-text">{{ selectedYear }}</span>
          <span class="pill-arrow">▼</span>
        </div>
      </div>

      <div class="user-profile-container" v-click-outside="closeMenu">
        <div 
          class="user-avatar" 
          :style="{ backgroundColor: userColor }" 
          @click="isMenuOpen = !isMenuOpen"
        >
          <i :class="userIcon" class="user-icon-nav"></i>
        </div>

        <transition name="menu-pop">
          <div v-if="isMenuOpen" class="google-dropdown">
            <div class="menu-header-minimal">
              <span class="user-email-text">{{ email || 'ospite@habitnest.it' }}</span>
              <button class="close-x-btn" @click="isMenuOpen = false">✕</button>
            </div>

            <div class="menu-content-body">
              <div class="profile-circle-large" :style="{ backgroundColor: userColor }">
                <i :class="userIcon"></i>
              </div>
              <h2 class="user-greeting">Ciao, {{ username || 'Ospite' }}!</h2>
              <router-link to="/profile" class="google-blue-link" @click="isMenuOpen = false">
                Gestisci il tuo profilo
              </router-link>
            </div>

            <div class="menu-tiles-container">
              <div class="tile-action-btn tile-left">
                <i class="fa-solid fa-plus"></i>
                <span>Aggiungi</span>
              </div>
              <div class="tile-action-btn tile-right" @click="handleLogoutAction">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>Esci</span>
              </div>
            </div>

            <div class="legal-info-footer">
              <span>Norme sulla privacy</span>
              <span class="separator-dot">•</span>
              <span>Termini di servizio</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  props: ['year', 'userIcon', 'userColor', 'username', 'email'],
  data() {
    return {
      selectedYear: this.year || 2024,
      isDark: document.body.classList.contains('dark-theme'),
      isMenuOpen: false
    }
  },
  watch: {
    year(newVal) { this.selectedYear = newVal; }
  },
  methods: {
    onYearChange() { this.$emit('change-year', Number(this.selectedYear)); },
    toggleTheme() {
      this.isDark = !this.isDark;
      document.body.classList.toggle('dark-theme');
    },
    closeMenu() { this.isMenuOpen = false; },
    handleLogoutAction() {
      this.isMenuOpen = false;
      this.$emit('user-action');
    }
  },
  directives: {
    'click-outside': {
      beforeMount(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) { binding.value(); }
        };
        document.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) { document.removeEventListener('click', el.clickOutsideEvent); }
    }
  }
}
</script>

<style scoped>
.matcha-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px; 
  height: 70px;    
  background-color: var(--matcha-bg);
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 2000 !important; 
  border-bottom: none; 
  transition: background-color 0.4s ease;
}

.navbar-right { display: flex; align-items: center; gap: 15px; }
.brand-name { font-family: 'Quicksand', sans-serif; font-size: 24px; font-weight: 700; color: var(--matcha-dark); }

.google-dropdown {
  position: absolute; 
  top: 55px; 
  right: 0;
  width: 330px; 
  background: var(--color-white); 
  border-radius: 28px;
  box-shadow: var(--shadow); 
  padding: 12px 16px 20px; 
  z-index: 2100;
  border: 1px solid var(--matcha-soft);
}

body.dark-theme .google-dropdown {
  background-color: #2e303a; 
  border-color: #3f414d;
}

.menu-header-minimal {
  display: flex; justify-content: center; align-items: center;
  position: relative; padding: 10px 0 20px;
}
.user-email-text { font-size: 13.5px; color: var(--matcha-mid); font-weight: 500; }
.close-x-btn { position: absolute; right: 0; background: none; border: none; font-size: 18px; cursor: pointer; color: var(--matcha-mid); }

.menu-content-body { display: flex; flex-direction: column; align-items: center; margin-bottom: 25px; }
.profile-circle-large {
  width: 84px; height: 84px; border-radius: 50%; margin-bottom: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 34px; color: white;
}

.user-greeting { font-family: 'Quicksand', sans-serif; font-size: 22px; color: var(--matcha-dark); margin-bottom: 15px; font-weight: 700; }
.google-blue-link {
  background: var(--matcha-soft); padding: 10px 24px; border: 1px solid var(--matcha-dark); border-radius: 20px;
  text-decoration: none; color: var(--matcha-dark); font-weight: 600; font-size: 14px;
  transition: var(--transition);
}

.menu-tiles-container { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
.tile-action-btn {
  background: var(--matcha-bg); padding: 18px; display: flex; align-items: center; justify-content: center;
  gap: 10px; font-size: 14px; font-weight: 600; color: var(--matcha-dark); cursor: pointer; border-radius: 12px;
  transition: var(--transition);
}
.tile-left { border-radius: 24px 4px 4px 24px; }
.tile-right { border-radius: 4px 24px 24px 4px; }

.legal-info-footer { font-size: 11px; color: var(--matcha-mid); display: flex; justify-content: center; gap: 6px; }

.user-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; transition: var(--transition); }
.user-avatar:hover { transform: scale(1.1); }

.theme-toggle-btn { 
  background: var(--matcha-soft); 
  border: 1.5px solid var(--matcha-dark); 
  width: 36px; height: 36px; border-radius: 50%; 
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: var(--matcha-dark);
  transition: var(--transition);
}

.year-selector-pill { position: relative; background: var(--matcha-soft); border: 1.5px solid var(--matcha-dark); border-radius: 20px; padding: 4px 12px; transition: var(--transition); }
.hidden-select { position: absolute; width: 100%; height: 100%; top: 0; left: 0; opacity: 0; cursor: pointer; z-index: 2; }
.pill-content { display: flex; align-items: center; gap: 6px; }
.year-text { font-weight: 700; color: var(--matcha-dark); }
.pill-arrow { font-size: 9px; color: var(--matcha-dark); }

.menu-pop-enter-active { transition: all 0.25s ease-out; }
.menu-pop-enter-from { opacity: 0; transform: scale(0.92) translateY(-10px); }
</style>