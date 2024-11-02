<script>
export default {
    name: "Nav",

    props: ['navs'],

    methods: {
        handleScrollToSection(id) {
            document.getElementById(id).scrollIntoView({behavior: 'smooth'})
        }
    }

}
</script>

<template>
    <div class="nav">
        <div v-for="nav in navs"
             :key="nav.id"
             class="nav__item"
             :class="{'nav__item--active': nav.id === 1}"
             @click="handleScrollToSection(nav.id)">
            {{nav.name}}
        </div>
    </div>
</template>

<style src="./nav.css" scoped/>