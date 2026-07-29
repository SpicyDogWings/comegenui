<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
    <PlaygroundLayout title="Button">
        <div class="playground-buttons">
            <h2>Variants</h2>
            <div class="playground-row">
                <Button color="primary" variant="solid">Solid</Button>
                <Button color="primary" variant="soft">Soft</Button>
                <Button color="primary" variant="ghost">Ghost</Button>
                <Button color="primary" variant="subtle">Subtle</Button>
                <Button color="primary" variant="outlined">Outlined</Button>
                <Button color="primary" variant="link">Link</Button>
            </div>

            <h2>Colors</h2>
            <div class="playground-row">
                <Button color="primary">Primary</Button>
                <Button color="secondary">Secondary</Button>
                <Button color="neutral">Neutral</Button>
                <Button color="success">Success</Button>
                <Button color="warning">Warning</Button>
                <Button color="danger">Danger</Button>
            </div>

            <h2>Disabled</h2>
            <div class="playground-row">
                <Button color="primary" disabled>Primary</Button>
                <Button color="secondary" disabled>Secondary</Button>
                <Button color="neutral" disabled>Neutral</Button>
                <Button color="success" disabled>Success</Button>
                <Button color="warning" disabled>Warning</Button>
                <Button color="danger" disabled>Danger</Button>
            </div>

            <h2>Sizes</h2>
            <div class="playground-row playground-row--center">
                <Button color="primary" class="playground-btn-sm">Small</Button>
                <Button color="primary">Medium</Button>
                <Button color="primary" class="playground-btn-lg">Large</Button>
            </div>

            <h2>With Icon</h2>
            <div class="playground-row">
                <Button color="primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    Next
                </Button>
                <Button color="secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                    Back
                </Button>
                <Button color="danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    Delete
                </Button>
            </div>

            <h2>As Link</h2>
            <div class="playground-row">
                <Button color="primary" to="https://google.com" target="_blank">External Link</Button>
                <Button color="secondary" to="/playground/buttons/button">Internal Link</Button>
            </div>
        </div>
    </PlaygroundLayout>
</template>

<style scoped>
.playground-buttons {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
}

.playground-buttons h2 {
    font-size: var(--cu-font-size-lg);
    font-weight: var(--cu-font-weight-semibold);
    margin: 0;
    color: var(--cu-color-neutral);
}

.playground-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    justify-content: flex-start;
}

.playground-row--center {
    justify-content: center;
}

.playground-btn-sm {
    font-size: var(--cu-font-size-xs) !important;
    padding: var(--cu-space-xs) var(--cu-space-sm) !important;
}

.playground-btn-lg {
    font-size: var(--cu-font-size-lg) !important;
    padding: var(--cu-space-lg) var(--cu-space-xl) !important;
}
</style>
