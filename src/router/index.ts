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
          path: "information",
          name: "Information playground",
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
            }
          ]
        },
        {
          path: "data",
          name: "Data playground",
          children: [
            {
              path: "table",
              name: "Table playground",
              component: () => import("@/pages/playground/data/Table.vue")
            },
            {
              path: "advanced-table",
              name: "AdvancedTable playground",
              component: () => import("@/pages/playground/data/AdvancedTable.vue")
            }
          ]
        },
        {
          path: "form",
          name: "Form playground",
          children: [
            {
              path: "input",
              name: "Input playground",
              component: () => import("@/pages/playground/form/Input.vue")
            },
            {
              path: "textarea",
              name: "Textarea playground",
              component: () => import("@/pages/playground/form/Textarea.vue")
            },
            {
              path: "select",
              name: "Select playground",
              component: () => import("@/pages/playground/form/Select.vue")
            },
            {
              path: "autocomplete",
              name: "Autocomplete playground",
              component: () => import("@/pages/playground/form/Autocomplete.vue")
            },
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
