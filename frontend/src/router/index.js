import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../views/Landing.vue';
import Symposium from '../views/Symposium.vue';
import AdminPanel from '../views/AdminPanel.vue';

const routes = [
  { path: '/', component: Landing },
  { path: '/live/:lang?', component: Symposium },
  { path: '/admin', component: AdminPanel }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // Si la ruta inicia con /live, requerimos que el usuario tenga 'userName'
  if (to.path.startsWith('/live')) {
    const isRegistered = !!localStorage.getItem('userName');
    if (!isRegistered) {
      // Si no está registrado, lo mandamos al Landing con la ruta deseada guardada
      return next(`/?redirect=${encodeURIComponent(to.fullPath)}`);
    }
  }
  next();
});

export default router;
