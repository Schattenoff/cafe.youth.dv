<script>
export default {
    name: "Drawer",

    computed: {
        links() {
            return [
                {
                    name: 'Заказы',
                    href: '/panel/orders',
                },
                {
                    name: 'Меню',
                    href: '/panel/menu',
                }
            ]
        }
    },

    methods: {
        onClose() {
            this.$emit('close');
        }
    }
}
</script>

<template>
    <div class="drawer" @click="onClose">
        <div class="drawer__content" @click.stop>
            <div class="drawer__links">
                <a v-for="link in links"
                   :key="link.href"
                   :href="link.href"
                   class="drawer__link">
                    {{link.name}}
                </a>
            </div>
        </div>
    </div>
</template>

<style src="./drawer.css" scoped />