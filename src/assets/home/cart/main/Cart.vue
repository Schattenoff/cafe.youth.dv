<script>
import CartItem from "@/assets/home/cart/item/CartItem.vue";
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";

export default {
    name: "Cart",

    components: {
        CartItem,
    },

    props: ['sections'],

    data() {
        return {
            isLoading: false,
            isSuccess: false,
            userName: '',
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
            }, 0).toFixed(2);
        }
    },

    methods: {
        onClose() {
            this.$emit('close');
        },

        submit() {
            if(this.isLoading) return;

            this.isLoading = true;

            const payload = {
                name: this.userName,
                items: this.dishes,
            };

            apiRequest('post', '/order', payload, (res) => {

                this.isLoading = false;

                if (res.error) {
                    console.log(res.error);
                    return;
                }

                this.$parent.refresh();

                this.isSuccess = true;
            });
        }
    }
}
</script>

<template>
    <div class="cart">
        <div class="cart__close" @click="onClose()">&times;</div>
        <template v-if="dishes.length && !isSuccess">
            <div class="cart__title">Корзина</div>

            <input class="cart__input" type="text" placeholder="Ваше имя" v-model="userName" />

            <div class="cart__items">
                <CartItem v-for="item in dishes" :key="item.id" :item="item" />
            </div>

            <div class="cart__total">
                <span>Итого</span> <span>{{ totalAmount }} BYN</span>
            </div>

            <div class="cart__submit" @click="submit()">Заказать</div>
        </template>

        <div v-else-if="isSuccess" class="cart__success">
            <div class="cart__successIco"></div>
            Заказ успешно оформлен!
        </div>

        <div v-else class="cart__empty">
            Ваша корзина пуста<br>
            <div class="cart__goToMenu" @click="onClose()">
                Перейти в меню
            </div>
        </div>

    </div>

</template>

<style src="./cart.css" scoped />