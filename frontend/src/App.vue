<template>
  <div id="app-container">
    <Navbar 
      class="main-header"
      :year="globalYear" 
      :user-icon="userIcon"
      :user-color="userColor"
      :username="username"
      :email="email"
      @change-year="updateYear" 
      @user-action="handleUserAction"
    /> 
    
    <nav class="navigation-bar">
      <router-link to="/calendar" class="nav-item" active-class="active">
        <i class="fa-solid fa-calendar-days"></i>
        <span>Calendario</span>
      </router-link>
      
      <router-link to="/badges" class="nav-item" active-class="active">
        <i class="fa-solid fa-ranking-star"></i>
        <span>Classifica</span>
      </router-link>

      <router-link to="/login" class="nav-item" active-class="active">
        <i class="fa-solid fa-arrow-right-to-bracket"></i>
        <span>Login</span>
      </router-link>
      
      <router-link to="/profile" class="nav-item" active-class="active">
        <i class="fa-solid fa-user"></i>
        <span>Profilo</span>
      </router-link>
    </nav>

    <main class="content-viewport">
      <router-view :selectedYear="globalYear" />
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default { 
  name: 'App',
  components: { Navbar },
  data() {
    return {
      globalYear: new Date().getFullYear(),
      userIcon: 'fa-solid fa-user',
      userColor: '#6B7F3A',
      username: 'Ospite',
      email: '',
      isLoggedIn: false
    }
  },
  mounted() {
    this.updateUserIcon();
    window.addEventListener('storage', this.updateUserIcon);
  },
  watch: {
    $route() {
      this.updateUserIcon();
    }
  },
  methods: {
    updateYear(newYear) {
      this.globalYear = newYear;
    },
    updateUserIcon() {
      const savedData = localStorage.getItem('habitNest_profile_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.userIcon = data.profileIcon || 'fa-solid fa-user';
        this.userColor = data.profileColor || '#6B7F3A';
        this.username = data.username || 'Utente';
        this.email = data.email || '';
        this.isLoggedIn = true;
      }
    },
    handleUserAction() {
      if (this.isLoggedIn) {
        localStorage.removeItem('habitNest_profile_data');
        location.reload();
      } else {
        this.$router.push('/login');
      }
    }
  }
}
</script>

<style>
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--matcha-bg);
}

.main-header {
  position: sticky;
  top: 0;
  z-index: 2000;
  background-color: var(--matcha-bg);
}

.content-viewport {
  flex: 1;
  padding: 20px;
  padding-bottom: 90px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.navigation-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: var(--color-white);
  border-top: 1px solid var(--matcha-soft);
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--matcha-mid);
  font-size: 11px;
  gap: 4px;
  transition: var(--transition);
}

.nav-item i { 
  font-size: 20px; 
}
.nav-item.active { 
  color: var(--matcha-dark); 
  font-weight: 700; 
}

@media (min-width: 768px) {
  .content-viewport {
    padding-top: 20px;
    padding-bottom: 40px;
  }

  .navigation-bar {
    position: sticky;
    top: 70px; 
    bottom: auto;
    background-color: var(--matcha-bg); 
    border-top: none;
    border-bottom: 1px solid var(--matcha-soft); 
    height: 55px;
    padding: 0 40px;
    justify-content: flex-start;
    gap: 30px;
    box-shadow: none;
    z-index: 1500;
  }

  .nav-item {
    flex-direction: row;
    font-size: 14px;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 8px;
  }
  
  .nav-item:hover {
    background-color: var(--matcha-soft);
  }
}

body.dark-theme .navigation-bar {
  background-color: var(--matcha-bg);
}
</style>