import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/playground",
      name: "Playground",
      children: [
        {
          path: "buttons",
          name: "Buttons playground",
          children: [
            {
              path: "button",
              name: "Button playground",
              component: () => import("@/pages/playground/buttons/Button.vue")
            },
            {
              path: "toggle-color-scheme",
              name: "ToggleColorScheme playground",
              component: () => import("@/pages/playground/buttons/ToggleColorScheme.vue")
            }
          ]
        },
        {
          path: "components",
          name: "Components playground",
          children: [
            {
              path: "alert",
              name: "Alert playground",
              component: () => import("@/pages/playground/components/Alert.vue")
            }
          ]
        },
      ]
    }
  ]
});

export default router;
