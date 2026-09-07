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
              path: "copy-button",
              name: "CopyButton playground",
              component: () => import("@/pages/playground/components/CopyButton.vue")
            },
            {
              path: "toggle-color-scheme",
              name: "ToggleColorScheme playground",
              component: () => import("@/pages/playground/components/ToggleColorScheme.vue")
            },
            {
              path: "floating-button",
              name: "FloatingButton playground",
              component: () => import("@/pages/playground/components/FloatingButton.vue")
            },
            {
              path: "color-picker",
              name: "ColorPicker playground",
              component: () => import("@/pages/playground/components/ColorPicker.vue")
            },
            {
              path: "label",
              name: "Label playground",
              component: () => import("@/pages/playground/components/Label.vue")
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
              path: "card",
              name: "Card playground",
              component: () => import("@/pages/playground/components/Card.vue")
            },
            {
              path: "author-card",
              name: "AuthorCard playground",
              component: () => import("@/pages/playground/components/AuthorCard.vue")
            },
            {
              path: "avatar",
              name: "Avatar playground",
              component: () => import("@/pages/playground/components/Avatar.vue")
            },
            {
              path: "loader",
              name: "Loader playground",
              component: () => import("@/pages/playground/components/Loader.vue")
            },
            {
              path: "modal",
              name: "Modal playground",
              component: () => import("@/pages/playground/components/Modal.vue")
            },
            {
              path: "collapse",
              name: "Collapse playground",
              component: () => import("@/pages/playground/components/Collapse.vue")
            },
            {
              path: "command-palette",
              name: "CommandPalette playground",
              component: () => import("@/pages/playground/components/CommandPalette.vue")
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
              path: "month-slider",
              name: "MonthSlider playground",
              component: () => import("@/pages/playground/components/MonthSlider.vue")
            },
            {
              path: "year-slider",
              name: "YearSlider playground",
              component: () => import("@/pages/playground/components/YearSlider.vue")
            },
            {
              path: "calendar",
              name: "Calendar playground",
              component: () => import("@/pages/playground/components/Calendar.vue")
            },
            {
              path: "date-picker",
              name: "DatePicker playground",
              component: () => import("@/pages/playground/components/DatePicker.vue")
            },
            {
              path: "date-picker-range",
              name: "DatePickerRange playground",
              component: () => import("@/pages/playground/components/DatePickerRange.vue")
            },
            {
              path: "dropdown",
              name: "Dropdown playground",
              component: () => import("@/pages/playground/components/Dropdown.vue")
            },
            {
              path: "popover",
              name: "Popover playground",
              component: () => import("@/pages/playground/components/Popover.vue")
            },
            {
              path: "tooltip",
              name: "Tooltip playground",
              component: () => import("@/pages/playground/components/Tooltip.vue")
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
              path: "tabs",
              name: "Tabs playground",
              component: () => import("@/pages/playground/components/Tabs.vue")
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
            {
              path: "editable-row",
              name: "Editable Row playground",
              component: () => import("@/pages/playground/components/EditableRow.vue")
            },
            {
              path: "markdown",
              name: "Markdown playground",
              component: () => import("@/pages/playground/components/Markdown.vue")
            },
            {
              path: "codeblock",
              name: "CodeBlock playground",
              component: () => import("@/pages/playground/components/CodeBlock.vue")
            },
            {
              path: "blockquote",
              name: "Blockquote playground",
              component: () => import("@/pages/playground/components/Blockquote.vue")
            },
            {
              path: "navbar",
              name: "Navbar playground",
              component: () => import("@/pages/playground/components/Navbar.vue")
            },
          ]
        },
      ]
    }
  ]
});

export default router;
