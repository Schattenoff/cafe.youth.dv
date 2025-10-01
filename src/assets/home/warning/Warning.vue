<script>
export default {
    name: "Warning",

    mounted() {
        document.body.style.overflow = 'hidden';
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