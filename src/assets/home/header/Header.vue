<script>
export default {
    name: "Header",

    emits: ['refresh'],

    methods: {
        handleRefresh() {
            this.$emit('refresh');
        }
    }
}
</script>

<template>
    <header class="header">
        <button type="button" class="header__refresh" aria-label="Очистить выбор"
                @click="handleRefresh"></button>
        <h1 class="header__title">Cafe Youth DV</h1>
    </header>
</template>

<style src="./header.css" scoped />
