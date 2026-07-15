<script>
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";
import OrderForm from "@/assets/panel/orders/form/OrderForm.vue";

export default {
    name: "OrdersItem",

    components: {
        OrderForm,
    },

    inject: ['refetchOrders'],

    props: ['order'],

    data() {
        return {
            isShowForm: false,
        }
    },

    computed: {
        createdAtDateFormat() {
            return this.dateFormat(new Date(this.order.createdAt));
        },

        total() {
            const sum = this.order.items.reduce((acc, item) => {
                return acc + (item.dish.price * item.quantity);
            }, 0);

            return sum.toFixed(2);
        }
    },

    methods: {
        dateFormat(date) {
            // Получаем день, месяц, год, часы и минуты
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            // Формируем строку в нужном формате
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        },

        onEditForm() {
            this.isShowForm = true;
        },

        onCloseForm() {
            this.isShowForm = false;
        },

        onDelete() {
            const payload = {};

            window.confirm(`Вы уверены, что хотите удалить заказ «${this.order.name}»?`) &&
            apiRequest('delete', `/order/${this.order.id}`, payload, (res) => {
                if (res.error) {
                    return;
                }

                this.refetchOrders();
            });
        },
    }
}
</script>

<template>
    <div class="item">
        <div class="item__actions">
            <div class="item__action item__action--edit" @click="onEditForm()"></div>
            <div class="item__action item__action--delete" @click="onDelete()"></div>
        </div>
        <div class="item__created">Дата заказа: {{ createdAtDateFormat }}</div>
        <div class="item__name">Имя: <b>{{order.name }}</b></div>
        <div class="item__dishes">
            <div v-for="item in order.items" :key="item.id" class="item__dish">
                <span class="item__dishName">{{ item.dish.name }}</span>
                <span class="item__quantity">x{{ item.quantity }}</span>
            </div>
            <div class="item__total">
                <div>Итого:</div>
                <div>{{total}} руб.</div>
            </div>
        </div>
    </div>
    <OrderForm v-if="isShowForm"
               :order="order"
               @close="onCloseForm()" />
</template>

<style src="./orders-item.css" scoped />
