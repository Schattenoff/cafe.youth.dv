<script>
export default {
    name: "Dish",

    props: ['dish'],

    computed: {
        totalAmount() {
            return this.dish.price.toFixed(2);
        }
    },

    methods: {
        handleMinus() {
            this.dish.count--;
        },

        handlePlus() {
            this.dish.count++;
        }
    }
}
</script>

<template>
    <div class="dish">
        <div class="dish__photoWrap">
            <img class="dish__photo"
                 :src="dish.imageUrl"
                 :alt="dish.name" />
        </div>
        <div class="dish__content">
            <div class="dish__name">{{ dish.name }}</div>
            <div class="dish__amount">{{ totalAmount }} BYN</div>
            <div v-if="dish.count" class="dish__actions">
                <div class="dish__action dish__actionMinus" @click="handleMinus()">
                </div>
                <input class="dish__count" v-model="dish.count" />
                <div class="dish__action dish__actionPlus" @click="handlePlus()">
                </div>
            </div>
            <div v-else class="dish__cartBtn" @click="handlePlus()">В корзину</div>
        </div>
    </div>
</template>

<style src="./dish.css" scoped />