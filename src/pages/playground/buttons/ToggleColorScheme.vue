<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import ToggleColorSheme from "@/components/buttons/ToggleColorSheme.vue";
</script>

<template>
    <PlaygroundLayout title="ToggleColorScheme">
        <div class="playground-row">
            <ToggleColorSheme />
        </div>
    </PlaygroundLayout>
</template>

<style scoped>
.playground-row {
    text-align: center;
}
</style>
