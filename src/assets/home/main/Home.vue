<script>
import Header from "@/assets/home/header/Header.vue";
import Nav from "@/assets/home/nav/Nav.vue";
import Dish from "@/assets/home/dish/Dish.vue";
import Cart from "@/assets/home/cart/main/Cart.vue";
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";

export default {
    name: "Home",

    components: {
        Header,
        Nav,
        Dish,
        Cart
    },

    data() {
        return {
            isReady: false,
            isLoading: false,
            isOpenCart: false,
            sections: null,
            activeSectionId: null,
            observer: null,
        }
    },

    computed: {
        visibleSections() {
            if(!this.sections) return [];

            return this.sections.filter(section => section.dishes.length);
        },

        navs() {
            return this.visibleSections.map(section => ({
                id: section.id,
                name: section.name
            }));
        },

        totalAmount() {
            return this.visibleSections.map(section => (section.dishes)).flat().reduce((acc, dish ) => {
                acc += dish.price * dish.count;
                return acc;
            }, 0).toFixed(2);
        }
    },

    mounted() {
        this.getSections();
    },

    unmounted() {
        if (this.observer) this.observer.disconnect();
    },

    methods: {
        getSections() {
            const payload = {};

            apiRequest('get', '/section', payload, (res) => {
                if (res.error) {
                    return;
                }
                this.sections = res;
                this.activeSectionId = this.sections[0].id;
                this.refresh();
                this.isReady = true;

                setTimeout(() => {
                    this.observerSections();
                }, 100);
            });

        },

        refresh() {
            this.sections = this.sections.map(section => {
                return {
                    ...section,
                    dishes: section.dishes.map(dish => {
                        return {
                            ...dish,
                            count: 0,
                        }
                    })
                }
            })
        },

        openCart() {
            this.isOpenCart = true;
        },

        closeCart() {
            this.isOpenCart = false;
        },

        observerSections() {
            const options = {
                root: null,
                rootMargin: '0px 2px 0px 0px',
                threshold: 1
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.activeSectionId = Number(entry.target.id);
                    }
                });
            }, options);

            // Начинаем наблюдение за всеми секциями
            this.$refs.sectionRefs.forEach((section) => {
                this.observer.observe(section);
            });
        }
    }
}
</script>

<template>
    <div v-if="isReady" class="home">
        <Header @refresh="refresh()" />
        <Nav :navs="navs" :activeSectionId="activeSectionId" />
        <div class="home__sections">
            <template v-for="section in visibleSections">
                <div v-if=section.isVisible
                     :id="'sect' + section.id"
                     :key="section.id"
                     ref="sectionRefs"
                     class="home__section">
                    <h2 class="home__sectionTitle">{{section.name}}</h2>
                    <div class="home__dishes">
                        <Dish v-for="dish in section.dishes"
                              :dish="dish"
                              :key="dish.id" />
                    </div>
                </div>
            </template>
        </div>
        <div v-if="Math.round(totalAmount)" class="home__total" @click="openCart()">
            <div>Мой заказ: </div>
            <div>{{ totalAmount }} BYN</div>
        </div>
        <Cart v-if="isOpenCart" :sections="visibleSections" @close="closeCart" />
    </div>
</template>

<style src="./home.css" scoped/>