<script setup lang="ts">
import Button from "@/components/Button.vue"
</script>

<template>
    <section class="playground">
        <div class="playground-headerbar">
            <h1>Playground</h1>
            <Button>Light</Button>
        </div>
        <div class="playground-box">
            <Button variant="subtle">
                Haz click
            </Button>
        </div>
    </section>
</template>

<style scoped>
.playground {
    width: 100dvw;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background-color: var(--playground-bg);
}

.playground-headerbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 2rem 0 2rem;
}

.playground-box {
    width: 100dvw;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
