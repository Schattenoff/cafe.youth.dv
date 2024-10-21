<script>
export default {
    name: "Dish",

    props: ['dish'],
}
</script>

<template>
    <div class="dish">
        <div class="dish__photoWrap">
            <img class="dish__photo"
                 :src="dish.preview"
                 :alt="dish.name" />
        </div>
        <div class="dish__content">
            <div class="dish__name">{{ dish.name }}</div>
            <div class="dish__actions">
                <div>-</div>
                <div>0</div>
                <div>+</div>
            </div>
        </div>
    </div>
</template>

<style src="./dish.css" scoped />