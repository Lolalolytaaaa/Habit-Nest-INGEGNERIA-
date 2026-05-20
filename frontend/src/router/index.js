import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import BadgesView from '../views/BadgesView.vue'
import LoginView from '../views/LoginView.vue' 

const routes = [
  { 
    path: '/', 
    redirect: '/calendar' 
  },
  { 
    path: '/calendar', 
    name: 'Calendar', 
    component: HomeView 
  },
  { 
    path: '/badges', 
    name: 'Classifica', 
    component: BadgesView 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginView 
  },
  { 
    path: '/profile', 
    name: 'Profile', 
    component: ProfileView 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router