<script>
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";
import OrdersItem from "@/assets/panel/orders/item/OrdersItem.vue";

export default {
    name: "Orders",

    components: {
        OrdersItem,
    },

    data() {
        return {
            isReady: false,
            orders: null,
        }
    },

    computed: {
        totalOrders() {
            if(!this.orders || !this.orders.length) {
                return;
            }

            const dishesMap = {};

            this.orders.forEach(order => {
                order.items.forEach(item => {
                    const dishId = item.dishId;

                    if (!dishesMap[dishId]) {
                        dishesMap[dishId] = {
                            name: item.dish.name,
                            quantity: 0
                        };
                    }

                    dishesMap[dishId].quantity += item.quantity;
                    dishesMap[dishId].price = item.price;
                });
            });

            return Object.values(dishesMap);
        },

        totalPrice() {
            if(!this.totalOrders.length) {
                return
            }

            return this.totalOrders.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
        }
    },

    mounted() {
        this.getOrders();
    },

    methods: {
        getOrders() {
            const payload = {};

            apiRequest('get', '/order', payload, (res) => {
                if (res.error) {
                    return;
                }

                this.orders = res.orders;
                this.isReady = true;
            });

        },
    }
}
</script>

<template>
    <div v-if="isReady" class="orders">
        <div class="orders__title">Заказы</div>
        <div v-if="totalOrders && totalOrders.length" class="orders__total">
            Общее количество:
            <div v-for="item in totalOrders">
                {{ item.name }} x {{ item.quantity }}
            </div>
            <div class="orders__totalPrice">Цена за все {{ totalPrice }} BYN</div>
        </div>
        <div class="orders__list">

            <OrdersItem v-for="order in orders"
                        :key="order.id"
                        :order="order"></OrdersItem>

        </div>
    </div>
</template>

<style src="./orders.css" scoped />