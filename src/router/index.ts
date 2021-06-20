import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Controller from '@/views/Controller.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: '/game/:gameid',
    name: 'Controller',
    component: Controller
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;