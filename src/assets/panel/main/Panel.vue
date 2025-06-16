<script>
import Auth from "@/assets/panel/auth/Auth.vue";
import Menu from "@/assets/panel/menu/main/Menu.vue";
import Orders from "@/assets/panel/orders/main/Orders.vue";

export default {
    name: "Panel",

    components: {
        Menu,
        Auth,
        Orders,
    },

    data() {
        return {
            isAuth: false,
        }
    },

    computed: {
        isOrders() {
            return this.isAuth && this.$route.name === 'orders';
        },
        isMenu() {
            return this.isAuth && this.$route.name === 'menu';
        }
    },

    mounted() {
        if (localStorage.getItem('auth')) {
            this.isAuth = true;
        }
    },

    methods: {
        auth() {
            this.isAuth = true;
            localStorage.setItem('auth', true);
        },

        openDrawer() {

        }
    },

}
</script>

<template>
    <div v-if="isAuth" class="panel__header">
        <div class="panel__menu" @click="openDrawer"></div>
    </div>
    <Menu v-if="isMenu" />
    <Orders v-else-if="isOrders" />
    <Auth v-else @auth="auth()" />
</template>

<style src="./panel.css" scoped />