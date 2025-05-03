<script>
import Section from "@/assets/panel/menu/section/main/Section.vue";
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";

export default {
    name: "Menu",

    components: {
        Section,
    },

    provide() {
        return {
            refetchSections: () => this.getSections(),
        }
    },

    data() {
        return {
            isReady: false,
            sections: null,
        }
    },

    mounted() {
        this.getSections();
    },

    methods: {
        getSections() {
            const payload = {};

            apiRequest('get', '/section', payload, (res) => {
                if (res.error) {
                    return;
                }
                this.sections = res;
                this.isReady = true;

                // это для того, чтобы отобразить кнопки «Добавить» для блюда и раздела
                this.sections.push({ id: 0 });
                this.sections.forEach(section => {
                    if (!section.dishes) {
                        section.dishes = [];
                    }
                    section.dishes.push({ id: 0 });
                });
            });

        },
    }
}
</script>

<template>
    <div v-if="isReady" class="menu">
        <div class="menu__title">Меню</div>
        <div class="menu__sections">
            <Section v-for="section in sections"
                     :key="section.id"
                     :section="section" />
        </div>
    </div>
</template>

<style src="./menu.css" scoped />