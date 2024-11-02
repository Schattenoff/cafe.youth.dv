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
        <div @click="handleRefresh()">ref</div>
        <div>Cafe Youth DV</div>
        <div>search</div>
    </header>
</template>

<style src="./header.css" scoped />
