<script>
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";

export default {
    name: "OrderForm",

    inject: ['refetchOrders'],

    props: ['order'],

    data() {
        return {
            isLoading: false,
            name: '',
            items: [],       // [{ dishId, name, price, count }]
            dishes: [],      // все блюда из меню для добавления
            selectedDishId: '',
        }
    },

    computed: {
        total() {
            return this.items
                .reduce((sum, item) => sum + item.price * item.count, 0)
                .toFixed(2);
        },

        availableDishes() {
            // блюда, которых ещё нет в заказе
            const usedIds = this.items.map(i => i.dishId);
            return this.dishes.filter(d => !usedIds.includes(d.id));
        }
    },

    mounted() {
        this.name = this.order.name;
        this.items = this.order.items.map(item => ({
            dishId: item.dishId,
            name: item.dish.name,
            price: item.dish.price,
            count: item.quantity,
        }));

        this.getDishes();
    },

    methods: {
        onClose() {
            this.$emit('close');
        },

        getDishes() {
            apiRequest('get', '/section', {}, (res) => {
                if (res.error) {
                    return;
                }

                // res — массив разделов, у каждого dishes[]
                this.dishes = res.reduce((acc, section) => {
                    if (section.dishes) {
                        acc.push(...section.dishes);
                    }
                    return acc;
                }, []);
            });
        },

        increment(item) {
            item.count++;
        },

        decrement(item) {
            if (item.count > 1) {
                item.count--;
            }
        },

        removeItem(index) {
            this.items.splice(index, 1);
        },

        addDish() {
            if (!this.selectedDishId) return;

            const dish = this.dishes.find(d => d.id === this.selectedDishId);
            if (!dish) return;

            this.items.push({
                dishId: dish.id,
                name: dish.name,
                price: dish.price,
                count: 1,
            });

            this.selectedDishId = '';
        },

        onSubmit() {
            if (this.isLoading) return;

            if (!this.name) {
                window.alert('Введите имя');
                return;
            }

            if (!this.items.length) {
                window.alert('Добавьте хотя бы одно блюдо');
                return;
            }

            this.isLoading = true;

            const payload = {
                name: this.name,
                items: this.items.map(item => ({
                    id: item.dishId,
                    count: item.count,
                })),
            };

            apiRequest('put', `/order/${this.order.id}`, payload, (res) => {
                this.isLoading = false;

                if (res.error) {
                    window.alert(res.message || 'Не удалось сохранить заказ');
                    return;
                }

                this.onClose();
                this.refetchOrders();
            });
        }
    }
}
</script>

<template>
    <div class="orderForm__overlay" @click.self="onClose()">
        <div class="orderForm">
            <div class="orderForm__header">
                <h3>Редактирование заказа</h3>
                <button @click="onClose">&times;</button>
            </div>
            <div class="orderForm__body">

                <div class="orderForm__field">
                    <div class="orderForm__caption">Имя</div>
                    <input class="orderForm__input" type="text" v-model="name" required>
                </div>

                <div class="orderForm__field">
                    <div class="orderForm__caption">Блюда</div>

                    <div v-if="items.length" class="orderForm__items">
                        <div v-for="(item, index) in items" :key="item.dishId" class="orderForm__item">
                            <div class="orderForm__itemName">{{ item.name }}</div>
                            <div class="orderForm__counter">
                                <div class="orderForm__counterBtn" @click="decrement(item)">−</div>
                                <div class="orderForm__counterValue">{{ item.count }}</div>
                                <div class="orderForm__counterBtn" @click="increment(item)">+</div>
                            </div>
                            <div class="orderForm__itemRemove" @click="removeItem(index)">&times;</div>
                        </div>
                    </div>
                    <div v-else class="orderForm__empty">Нет позиций</div>
                </div>

                <div class="orderForm__field orderForm__add">
                    <select class="orderForm__select" v-model="selectedDishId">
                        <option value="">Выберите блюдо…</option>
                        <option v-for="dish in availableDishes" :key="dish.id" :value="dish.id">
                            {{ dish.name }} — {{ dish.price.toFixed(2) }} руб.
                        </option>
                    </select>
                    <div class="orderForm__addBtn" @click="addDish()">Добавить</div>
                </div>

                <div class="orderForm__totalRow">
                    <div>Итого:</div>
                    <div>{{ total }} руб.</div>
                </div>

                <div class="orderForm__footer">
                    <div class="orderForm__submit" @click="onSubmit()">
                        <div v-if="isLoading" class="orderForm__spinner"></div>
                        <span v-else>Сохранить</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="./order-form.css" scoped />
