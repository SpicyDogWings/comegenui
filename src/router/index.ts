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
              component: () => import("@/pages/playground/information/Alert.vue")
            },
            {
              path: "badge",
              name: "Badge playground",
              component: () => import("@/pages/playground/information/Badge.vue")
            }
          ]
        },
        {
          path: "overlay",
          name: "Overlay playground",
          children: [
            {
              path: "modal",
              name: "Modal playground",
              component: () => import("@/pages/playground/overlay/Modal.vue")
            }
          ]
        },
        {
          path: "form",
          name: "Form playground",
          children: [
            {
              path: "switch",
              name: "Switch playground",
              component: () => import("@/pages/playground/form/Switch.vue")
            },
            {
              path: "file-input",
              name: "FileInput playground",
              component: () => import("@/pages/playground/form/FileInput.vue")
            },
            {
              path: "file-input-zone",
              name: "FileInputZone playground",
              component: () => import("@/pages/playground/form/FileInputZone.vue")
            },
            {
              path: "checkbox",
              name: "Checkbox playground",
              component: () => import("@/pages/playground/form/Checkbox.vue")
            }
          ]
        },
      ]
    }
  ]
});

export default router;
