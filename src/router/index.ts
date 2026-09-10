import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/pages/Home.vue")
    },
    {
      path: "/playground",
      name: "Playground",
      redirect: "/playground/components/button",
      children: [
        {
          path: "theme-builder",
          name: "Theme Builder",
          component: () => import("@/pages/playground/ThemeBuilder.vue")
        },
      ]
    }
  ]
});

export default router;
