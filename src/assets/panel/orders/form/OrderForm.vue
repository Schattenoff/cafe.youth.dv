<script>
import Curtain from "@/assets/home/cart/curtain/Curtain.vue";
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";

export default {
    name: "OrderForm",

    inject: ['refetchOrders'],

    components: { Curtain },

    props: { order: Object },

    emits: ['close'],

    data() {
        return {
            isLoading: false,
            name: '',
            items: [],       // [{ dishId, name, price, count }]
            dishes: [],      // все блюда из меню для добавления
            selectedDishId: '',
            dishesStatus: 'loading',
        }
    },

    computed: {
        title() {
            return this.order ? 'Редактирование заказа' : 'Добавить заказ';
        },

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
        this.name = this.order?.name ?? '';
        this.items = (this.order?.items ?? []).map(item => ({
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

        async getDishes() {
            try {
                const sections = await apiRequest('get', '/section', {}, () => {});
                if (!Array.isArray(sections)) {
                    this.dishesStatus = 'error';
                    return;
                }

                this.dishes = sections.flatMap(section => section.dishes ?? []);
                this.dishesStatus = 'ready';
            } catch {
                this.dishesStatus = 'error';
            }
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

        async onSubmit() {
            if (this.isLoading) return;

            if (!this.name.trim()) {
                window.alert('Введите имя');
                return;
            }

            if (!this.items.length) {
                window.alert('Добавьте хотя бы одно блюдо');
                return;
            }

            this.isLoading = true;

            const payload = {
                name: this.name.trim(),
                items: this.items.map(item => ({
                    id: item.dishId,
                    count: item.count,
                })),
            };

            try {
                const method = this.order ? 'put' : 'post';
                const url = this.order ? `/order/${this.order.id}` : '/order';
                const result = await apiRequest(method, url, payload, () => {});

                if (result.error) {
                    window.alert(result.message || 'Не удалось сохранить заказ');
                    return;
                }

                await this.$refs.curtain?.requestClose();
                this.refetchOrders();
            } catch (error) {
                window.alert(error.message || 'Не удалось сохранить заказ');
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>

<template>
    <Curtain ref="curtain" v-slot="{ close }" :label="title" @close="onClose">
        <div class="orderForm">
            <div class="orderForm__header">
                <h3>{{ title }}</h3>
                <button type="button" aria-label="Закрыть" @click="close">&times;</button>
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
                    <select class="orderForm__select" v-model="selectedDishId"
                            aria-label="Выберите блюдо" :disabled="dishesStatus !== 'ready'">
                        <option value="">
                            {{ dishesStatus === 'loading' ? 'Загрузка блюд…' :
                                dishesStatus === 'error' ? 'Не удалось загрузить блюда' : 'Выберите блюдо…' }}
                        </option>
                        <option v-for="dish in availableDishes" :key="dish.id" :value="dish.id">
                            {{ dish.name }} — {{ dish.price.toFixed(2) }} руб.
                        </option>
                    </select>
                    <button type="button" class="orderForm__addBtn" :disabled="!selectedDishId" @click="addDish">Добавить</button>
                </div>

                <div class="orderForm__totalRow">
                    <div>Итого:</div>
                    <div>{{ total }} руб.</div>
                </div>

                <div class="orderForm__footer">
                    <button type="button" class="orderForm__submit" :disabled="isLoading" @click="onSubmit">
                        <div v-if="isLoading" class="orderForm__spinner"></div>
                        <span v-else>{{ order ? 'Сохранить' : 'Создать заказ' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Curtain>
</template>

<style src="./order-form.css" scoped />
