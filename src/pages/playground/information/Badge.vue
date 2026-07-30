<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Badge from "@/components/information/Badge.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'All Combinations', id: 'combinations' },
];
</script>

<template>
    <PlaygroundLayout title="Badge" :outlineItems="outlineItems">
        <div class="playground-badge">
            <section id="variants" class="playground-badge-section">
                <h2>Variants</h2>
                <div class="playground-badge-row">
                    <Badge color="primary" variant="solid">solid</Badge>
                    <Badge color="primary" variant="soft">soft</Badge>
                    <Badge color="primary" variant="ghost">ghost</Badge>
                    <Badge color="primary" variant="subtle">subtle</Badge>
                    <Badge color="primary" variant="outlined">outlined</Badge>
                </div>
            </section>

            <hr class="playground-separator" />

            <section id="colors" class="playground-badge-section">
                <h2>Colors</h2>
                <div class="playground-badge-row">
                    <Badge color="primary">primary</Badge>
                    <Badge color="secondary">secondary</Badge>
                    <Badge color="neutral">neutral</Badge>
                    <Badge color="success">success</Badge>
                    <Badge color="warning">warning</Badge>
                    <Badge color="danger">danger</Badge>
                </div>
            </section>

            <hr class="playground-separator" />

            <section id="combinations" class="playground-badge-section">
                <h2>All Combinations</h2>
                <table class="playground-badge-table">
                    <thead>
                        <tr>
                            <th>variant \ color</th>
                            <th v-for="color in ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']" :key="color">{{ color }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="variant in ['solid', 'soft', 'ghost', 'subtle', 'outlined']" :key="variant">
                            <td class="playground-badge-label">{{ variant }}</td>
                            <td v-for="color in ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']" :key="color">
                                <Badge :color="color" :variant="variant">{{ variant }}</Badge>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </PlaygroundLayout>
</template>

<style scoped>
.playground-badge {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
}

.playground-badge h2 {
    font-size: var(--cu-font-size-lg);
    font-weight: var(--cu-font-weight-semibold);
    margin: 0;
    color: var(--cu-color-neutral);
}

.playground-badge-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.playground-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
}

.playground-separator {
    border: none;
    border-top: 1px solid var(--cu-border-color);
    margin: 0;
}

.playground-badge-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--cu-font-size-sm);
}

.playground-badge-table th,
.playground-badge-table td {
    padding: var(--cu-space-sm) var(--cu-space-md);
    text-align: left;
}

.playground-badge-table th {
    font-weight: var(--cu-font-weight-medium);
    opacity: 0.6;
    border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.playground-badge-table td {
    border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.playground-badge-label {
    opacity: 0.6;
    font-weight: var(--cu-font-weight-medium);
}
</style>
