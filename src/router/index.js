import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/quiz",
    name: "quiz",
    component: () => import("../views/QuizView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
