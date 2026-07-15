<script>
export default {
    name: "CartItem",

    props: ['item'],

    computed: {
        photoSrc() {
            return this.item.imageUrl ? this.item.imageUrl : '/default.jpg';
        }
    },

    methods: {
        minus() {
            this.item.count--;
        },
        plus() {
            // Не превышаем остаток у блюд с лимитом
            if (this.item.quantity != null && this.item.count >= this.item.quantity) {
                return;
            }
            this.item.count++;
        },
    },
}
</script>

<template>
    <div class="cItem">
        <div class="cItem__photoWrap">
            <img class="cItem__photo" :src="photoSrc" :alt="item.name" />
        </div>

        <div class="cItem__info">
            <div class="cItem__name">
                {{ item.name }}
            </div>
            <div class="cItem__price">
                {{ item.price }} руб.
            </div>
        </div>

        <div class="cItem__actions">
            <div class="cItem__action cItem__actionMinus" @click="minus()"></div>
            <div class="cItem__count">{{ item.count }}</div>
            <div class="cItem__action cItem__actionPlus" @click="plus()"></div>
        </div>
    </div>
</template>

<style src="./cart-item.css" scoped />