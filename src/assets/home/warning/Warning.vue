<script>
export default {
    name: "Warning",

    mounted() {
        this.previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    },

    unmounted() {
        document.body.style.overflow = this.previousOverflow;
    }
}
</script>

<template>
    <div class="warning">
        <div class="warning__text">
            Предзаказ недоступен!
        </div>
    </div>
</template>

<style src="./warning.css" scoped/>