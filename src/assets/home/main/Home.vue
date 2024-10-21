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

    computed: {
        sections() {
            return [
                {
                    id: 1,
                    name: 'Горячее',
                    dishes: [
                        {
                            id: 1,
                            name: 'Бутерброд',
                            preview: 'https://steamuserimages-a.akamaihd.net/ugc/1630856622137054636/EFA39C29D68B2B9040DE340F62DA3DC3F2946A4A/',
                            amount: 0.50,
                        },
                        {
                            id: 2,
                            name: 'Тост',
                            preview: 'https://i.pinimg.com/736x/d4/ca/cb/d4cacb8c6f85aa84d22d9db30e0d5f10.jpg',
                            amount: 1.50,
                        }
                    ]
                }
            ]
        }
    },
}
</script>

<template>
    <div class="home">
        <Header />
        <Nav />
        <div class="home__sections">
            <div v-for="section in sections"
                 :key="section.id"
                 class="home__section">
                <h2 class="home__sectionTitle">{{section.name}}</h2>
                <Dish v-for="dish in section.dishes"
                      :dish="dish"
                      :key="dish.id" />
            </div>
        </div>
    </div>
</template>

<style src="./home.css" scoped/>