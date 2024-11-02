<script>
export default {
    name: "Dish",

    props: ['dish'],

    computed: {
        totalAmount() {
            return this.dish.count ? this.dish.amount * this.dish.count : this.dish.amount;
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
                 :src="dish.preview"
                 :alt="dish.name" />
        </div>
        <div class="dish__content">
            <div class="dish__name">{{ dish.name }}</div>
            <div class="dish__amount">{{ totalAmount.toFixed(2) }} BYN</div>
            <div class="dish__actions">
                <div class="dish__action" @click="handleMinus">
                    <span>-</span>
                </div>
                <input class="dish__count" v-model="dish.count" />
                <div class="dish__action" @click="handlePlus">
                    <span>+</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="./dish.css" scoped />