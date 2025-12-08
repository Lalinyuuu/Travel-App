import { createApp } from 'vue'
import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import App from './App.vue'
import LandingPage from './pages/LandingPage.vue'
import AllTripsPage from './pages/AllTripsPage.vue'
import ProvincesPage from './pages/ProvincesPage.vue'
import AboutPage from './pages/AboutPage.vue'
import TripDetailPage from './pages/TripDetailPage.vue'
import LoginPage from './pages/LoginPage.vue'
import RegisterPage from './pages/RegisterPage.vue'
import DashboardPage from './pages/DashboardPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'
import { authService } from './services/auth'
import i18n from './i18n'
import './style.css'

const routes = [
  { path: '/', name: 'Landing', component: LandingPage },
  { path: '/trips', name: 'AllTrips', component: AllTripsPage },
  { path: '/provinces', name: 'Provinces', component: ProvincesPage },
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/trips/:id', name: 'TripDetail', component: TripDetailPage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

const loadGoogleMapsAPI = (): void => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
  
  if (!apiKey) {
    return
  }

  if (document.querySelector('script[src*="maps.googleapis.com"]')) {
    return
  }

  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async`
  script.async = true
  script.defer = true
  
  document.head.appendChild(script)
}

loadGoogleMapsAPI()

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')

