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
        <div class="header__refresh" @click="handleRefresh()">refresh</div>
        <div>Cafe Youth DV</div>
        <div class="header__search">
            search
        </div>
    </header>
</template>

<style src="./header.css" scoped />
