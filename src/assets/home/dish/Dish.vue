<script>
export default {
    name: "Dish",

    props: ['dish'],

    data() {
        return {
            isFocusDishCount: false,
        }
    },

    computed: {
        totalAmount() {
            return this.dish.price.toFixed(2);
        },

        srcImage() {
            return this.dish.imageUrl ? this.dish.imageUrl : '/default.jpg';
        },

        visibleActions() {
            return this.dish.count || this.isFocusDishCount;
        }
    },

    methods: {
        handleFocus() {
            this.isFocusDishCount = true;
        },

        handleBlur() {
            this.isFocusDishCount = false;
        },

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
    <div v-if="dish.isVisible" class="dish">
        <div class="dish__photoWrap">
            <img class="dish__photo"
                 :src="srcImage"
                 :alt="dish.name" />
        </div>
        <div class="dish__content">
            <div class="dish__name">{{ dish.name }}</div>
            <div class="dish__amount">{{ totalAmount }} BYN</div>
            <div v-if="visibleActions" class="dish__actions">
                <div class="dish__action dish__actionMinus" @click="handleMinus()">
                </div>
                <input ref="dishCount"
                       class="dish__count"
                       type="number"
                       v-model="dish.count"
                       @focus="handleFocus"
                       @blur="handleBlur" />
                <div class="dish__action dish__actionPlus" @click="handlePlus()">
                </div>
            </div>
            <div v-else class="dish__cartBtn" @click="handlePlus()">В корзину</div>
        </div>
    </div>
</template>

<style src="./dish.css" scoped />