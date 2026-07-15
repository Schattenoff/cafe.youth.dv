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

        // У блюда задан лимит порций (quantity !== null/undefined)
        isLimited() {
            return this.dish.quantity !== null && this.dish.quantity !== undefined;
        },

        // Раскуплено полностью (по данным сервера)
        isSoldOut() {
            return this.isLimited && this.dish.quantity <= 0;
        },

        // Остаток с учётом того, что уже в корзине
        remaining() {
            if (!this.isLimited) return null;
            return Math.max(0, this.dish.quantity - (this.dish.count || 0));
        },

        // Можно ли добавить ещё
        canAdd() {
            return !this.isLimited || this.remaining > 0;
        },

        visibleActions() {
            return this.dish.count || this.isFocusDishCount;
        }
    },

    watch: {
        // Не даём вручную ввести больше, чем есть в наличии
        'dish.count'(val) {
            if (this.isLimited && val > this.dish.quantity) {
                this.dish.count = this.dish.quantity;
            }
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
            if (!this.canAdd) return;
            this.dish.count++;
        }
    }
}
</script>

<template>
    <div v-if="dish.isVisible" class="dish" :class="{ 'dish--soldOut': isSoldOut }">
        <div class="dish__photoWrap">
            <img class="dish__photo"
                 :src="srcImage"
                 :alt="dish.name" />
            <div v-if="isLimited && !isSoldOut" class="dish__badge">Осталось: {{ remaining }}</div>
            <div v-if="isSoldOut" class="dish__soldOut">Нет в наличии</div>
        </div>
        <div class="dish__content">
            <div class="dish__name">{{ dish.name }}</div>
            <div class="dish__amount">Пожертвование: {{ totalAmount }} руб.</div>

            <template v-if="!isSoldOut">
                <div v-if="visibleActions" class="dish__actions">
                    <div class="dish__action dish__actionMinus" @click="handleMinus()">
                    </div>
                    <input ref="dishCount"
                           class="dish__count"
                           type="number"
                           v-model="dish.count"
                           @focus="handleFocus"
                           @blur="handleBlur" />
                    <div class="dish__action dish__actionPlus"
                         :class="{ 'dish__action--disabled': !canAdd }"
                         @click="handlePlus()">
                    </div>
                </div>
                <div v-else class="dish__cartBtn" @click="handlePlus()">В корзину</div>
            </template>
        </div>
    </div>
</template>

<style src="./dish.css" scoped />
