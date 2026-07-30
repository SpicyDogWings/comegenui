import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/playground",
      name: "Playground",
      children: [
        {
          path: "theme-builder",
          name: "Theme Builder",
          component: () => import("@/pages/playground/ThemeBuilder.vue")
        },
        {
          path: "components",
          name: "Components playground",
          children: [
            {
              path: "button",
              name: "Button playground",
              component: () => import("@/pages/playground/components/Button.vue")
            },
            {
              path: "toggle-color-scheme",
              name: "ToggleColorScheme playground",
              component: () => import("@/pages/playground/components/ToggleColorScheme.vue")
            },
            {
              path: "alert",
              name: "Alert playground",
              component: () => import("@/pages/playground/components/Alert.vue")
            },
            {
              path: "badge",
              name: "Badge playground",
              component: () => import("@/pages/playground/components/Badge.vue")
            },
            {
              path: "modal",
              name: "Modal playground",
              component: () => import("@/pages/playground/components/Modal.vue")
            },
            {
              path: "switch",
              name: "Switch playground",
              component: () => import("@/pages/playground/components/Switch.vue")
            },
            {
              path: "checkbox",
              name: "Checkbox playground",
              component: () => import("@/pages/playground/components/Checkbox.vue")
            },
            {
              path: "input",
              name: "Input playground",
              component: () => import("@/pages/playground/components/Input.vue")
            },
            {
              path: "textarea",
              name: "Textarea playground",
              component: () => import("@/pages/playground/components/Textarea.vue")
            },
            {
              path: "select",
              name: "Select playground",
              component: () => import("@/pages/playground/components/Select.vue")
            },
            {
              path: "autocomplete",
              name: "Autocomplete playground",
              component: () => import("@/pages/playground/components/Autocomplete.vue")
            },
            {
              path: "file-input",
              name: "FileInput playground",
              component: () => import("@/pages/playground/components/FileInput.vue")
            },
            {
              path: "file-input-zone",
              name: "FileInputZone playground",
              component: () => import("@/pages/playground/components/FileInputZone.vue")
            },
            {
              path: "dropdown",
              name: "Dropdown playground",
              component: () => import("@/pages/playground/components/Dropdown.vue")
            },
            {
              path: "dropdown-menu",
              name: "DropdownMenu playground",
              component: () => import("@/pages/playground/components/DropdownMenu.vue")
            },
            {
              path: "pagination",
              name: "Pagination playground",
              component: () => import("@/pages/playground/components/Pagination.vue")
            },
            {
              path: "table",
              name: "Table playground",
              component: () => import("@/pages/playground/components/Table.vue")
            },
            {
              path: "advanced-table",
              name: "AdvancedTable playground",
              component: () => import("@/pages/playground/components/AdvancedTable.vue")
            },
          ]
        },
      ]
    }
  ]
});

export default router;
