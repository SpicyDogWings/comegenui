<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
    <PlaygroundLayout title="Button">
        <div class="playground-buttons">
            <Button color="primary">Button</Button>
        </div>
    </PlaygroundLayout>
</template>

<style scoped>
.playground-row {
    text-align: center;
}
</style>
