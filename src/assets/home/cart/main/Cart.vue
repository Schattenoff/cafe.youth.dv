<script>
import Curtain from "@/assets/home/cart/curtain/Curtain.vue";
import CartItem from "@/assets/home/cart/item/CartItem.vue";
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";

export default {
    name: "Cart",

    components: {
        CartItem,
        Curtain,
    },

    props: ['sections'],

    data() {
        return {
            isLoading: false,
            isSuccess: false,
            userName: '',
            hasContentBelow: false,
        }
    },

    computed: {
        dishes() {
            return this.sections.map(section => (section.dishes)).flat().filter(dish => dish.count);
        },

        totalAmount() {
            return this.dishes.reduce((acc, dish ) => {
                acc += dish.price * dish.count;
                return acc;
            }, 0).toFixed(2).replace(/\.00$/, "");
        },

        isDisabled() {
            return this.userName.trim().length < 2;
        }
    },

    mounted() {
        this.scrollObserver = new ResizeObserver(this.updateCheckoutShadow);
        this.scrollObserver.observe(this.$refs.cart);
        this.updateCheckoutShadow();
    },

    updated() {
        this.updateCheckoutShadow();
    },

    beforeUnmount() {
        this.scrollObserver.disconnect();
    },

    methods: {
        updateCheckoutShadow() {
            const { scrollHeight, clientHeight, scrollTop } = this.$refs.cart;
            this.hasContentBelow = scrollHeight - clientHeight - Math.max(0, scrollTop) > 1;
        },

        onClose() {
            this.$emit('close');
        },

        clearCart() {
            if (this.isLoading) return;
            if (!window.confirm("Удалить все блюда из корзины?")) return;
            this.dishes.forEach(dish => {
                dish.count = 0;
            });
        },

        submit() {
            if (this.isLoading || this.isDisabled || !this.dishes.length) return;

            this.isLoading = true;

            const payload = {
                name: this.userName.trim(),
                items: this.dishes,
            };

            apiRequest('post', '/order', payload, (res) => {

                this.isLoading = false;

                if (res.error) {
                    window.alert(res.message || 'Не удалось оформить заказ');
                    return;
                }

                this.$parent.reloadStock();

                this.isSuccess = true;
            }).catch((error) => {
                this.isLoading = false;
                window.alert(error.message || 'Не удалось оформить заказ');
            });
        }
    }
}
</script>

<template>
    <Curtain v-slot="{ close }" label="Корзина" @close="onClose">
        <div ref="cart" class="cart" @scroll.passive="updateCheckoutShadow">
            <div class="cart__controls">
                <button v-if="dishes.length && !isSuccess" type="button" class="cart__iconButton"
                        aria-label="Очистить корзину" title="Очистить корзину"
                        :disabled="isLoading" @click="clearCart">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7m4-7v7" />
                    </svg>
                </button>
                <button type="button" class="cart__iconButton" aria-label="Закрыть корзину" @click="close">&times;</button>
            </div>
            <template v-if="dishes.length && !isSuccess">
                <div class="cart__title">Корзина</div>

                <div class="cart__items">
                    <CartItem v-for="item in dishes" :key="item.id" :item="item" />
                </div>

                <div class="cart__summary">
                    <p class="cart__donation">Указанная стоимость является пожертвованием</p>
                    <div class="cart__total">
                        <span>Итого</span>
                        <strong>{{ totalAmount }} руб.</strong>
                    </div>
                </div>

                <label class="cart__nameField">
                    <input class="cart__input" type="text" autocomplete="name"
                           placeholder=" " v-model="userName" />
                    <span class="cart__nameLabel">Ваше имя</span>
                </label>

                <div class="cart__checkout" :class="{ 'cart__checkout--raised': hasContentBelow }">
                    <button type="button" class="cart__submit" :disabled="isDisabled || isLoading" @click="submit">
                        <div v-if="isLoading" class="cart__spinner"></div>
                        <span v-else>Заказать</span>
                    </button>
                </div>
            </template>

            <div v-else-if="isSuccess" class="cart__success">
                <div class="cart__successIco"></div>
                Заказ успешно оформлен!
            </div>

            <div v-else class="cart__empty">
                <svg class="cart__emptyIcon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 4h2l2.2 10h11.5L21 7H6" />
                    <circle cx="9" cy="19" r="1" />
                    <circle cx="18" cy="19" r="1" />
                </svg>
                <p>Ваша корзина пуста</p>
                <button type="button" class="cart__goToMenu" @click="close">
                    Перейти в меню
                </button>
            </div>

        </div>
    </Curtain>
</template>

<style src="./cart.css" scoped />