<script>
import Header from "@/assets/home/header/Header.vue";
import Nav from "@/assets/home/nav/Nav.vue";
import Dish from "@/assets/home/dish/Dish.vue";
export default {
    name: "Home",

    components: {
        Header,
        Nav,
        Dish
    },

    data() {
        return {
            sections: [
                {
                    id: 1,
                    name: 'Горячее',
                    dishes: [
                        {
                            id: 1,
                            name: 'Бутерброд',
                            preview: 'https://steamuserimages-a.akamaihd.net/ugc/1630856622137054636/EFA39C29D68B2B9040DE340F62DA3DC3F2946A4A/',
                            amount: 0.50,
                            count: 0
                        },
                        {
                            id: 2,
                            name: 'Тост',
                            preview: 'https://i.pinimg.com/736x/d4/ca/cb/d4cacb8c6f85aa84d22d9db30e0d5f10.jpg',
                            amount: 1.50,
                            count: 0
                        }
                    ]
                },
                {
                    id: 2,
                    name: 'Напитки',
                    dishes: [
                        {
                            id: 1,
                            name: 'Pepsi 0,5L',
                            preview: 'https://kamensk-vodovoz.ru/upload/iblock/9e4/v1b1xrgrctjb3icejtr2ftcg3w2zjnb4/c547558f_7e26_11ee_a1cf_10604b806b5a_c5475590_7e26_11ee_a1cf_10604b806b5a.jpg',
                            amount: 2.20,
                            count: 0
                        },
                        {
                            id: 2,
                            name: 'Pepsi 0,5L',
                            preview: 'https://kamensk-vodovoz.ru/upload/iblock/9e4/v1b1xrgrctjb3icejtr2ftcg3w2zjnb4/c547558f_7e26_11ee_a1cf_10604b806b5a_c5475590_7e26_11ee_a1cf_10604b806b5a.jpg',
                            amount: 2.20,
                            count: 0
                        },
                        {
                            id: 3,
                            name: 'Pepsi 0,5L',
                            preview: 'https://kamensk-vodovoz.ru/upload/iblock/9e4/v1b1xrgrctjb3icejtr2ftcg3w2zjnb4/c547558f_7e26_11ee_a1cf_10604b806b5a_c5475590_7e26_11ee_a1cf_10604b806b5a.jpg',
                            amount: 2.20,
                            count: 0
                        },
                        {
                            id: 4,
                            name: 'Pepsi 0,5L',
                            preview: 'https://kamensk-vodovoz.ru/upload/iblock/9e4/v1b1xrgrctjb3icejtr2ftcg3w2zjnb4/c547558f_7e26_11ee_a1cf_10604b806b5a_c5475590_7e26_11ee_a1cf_10604b806b5a.jpg',
                            amount: 2.20,
                            count: 0
                        },
                    ]
                },
            ]
        }
    },

    computed: {
        navs() {
            return this.sections.map(section => ({
                id: section.id,
                name: section.name
            }));
        },
        totalAmount() {
            return this.sections.map(section => (section.dishes)).flat().reduce((acc, dish ) => {
                acc += dish.amount * dish.count;
                return acc;
            }, 0).toFixed(2);
        }
    },

    methods: {
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
        }
    }
}
</script>

<template>
    <div class="home">
        <Header @refresh="refresh()" />
        <Nav :navs="navs" />
        <div class="home__sections">
            <div v-for="section in sections"
                 :id="section.id"
                 :key="section.id"
                 class="home__section">
                <h2 class="home__sectionTitle">{{section.name}}</h2>
                <div class="home__dishes">
                    <Dish v-for="dish in section.dishes"
                          :dish="dish"
                          :key="dish.id" />
                </div>
            </div>
        </div>
        <div class="home__total">
            <div>Итого: </div>
            <div>{{ totalAmount }} BYN</div>
        </div>
    </div>
</template>

<style src="./home.css" scoped/>