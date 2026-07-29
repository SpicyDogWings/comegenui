import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/playground",
      name: "Playground",
      children: [
        {
          path: "button",
          name: "Button playground",
          component: () => import("@/pages/playground/Button.vue")
        }
      ]
    }
  ]
});

export default router;
