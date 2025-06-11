<script>
export default {
    name: "Nav",

    props: ['navs'],

    data() {
        return {
            scrollBusy: false,
            currentSectionIndex: 0,
            autoscrollTimer: null,
            navSections: null,
        }
    },

    computed: {

        currentSection() {
            return this.navSections && this.navSections[this.currentSectionIndex];
        },
    },

    mounted() {
        const html = document.getElementsByTagName('html')[0];

        html.style.scrollPaddingTop = '96px';

        window.addEventListener('scroll', this.onScroll);

        this.navSections = this.initSections();
        console.log('navSections', this.navSections);
    },

    unmounted() {
        window.removeEventListener('scroll', this.onScroll);
    },

    methods: {
        initSections() {
            if(this.navs) {
                return this.navs.map(section => {

                    section.el = document.querySelector(`#sect${section.id}`);

                    // Дебаг: если элемент не найден
                    if (!section.el) {
                        console.log(`Элемент с data-id="${section.id}" не найден!`);
                    }

                    return section;
                });
            }

            return null;
        },

        handleScrollToSection(id) {
            document.getElementById(`sect${id}`).scrollIntoView({
                behavior: 'smooth'
            })
        },

        recalcCurrentSectionIndex() {

            let current = 0;

            for (let i = 0; i < this.navSections.length; i++) {

                if (this.navSections[i].el) {
                    const top = this.navSections[i].el.getBoundingClientRect().top;

                    if (top >= 100) {
                        break;
                    } else {
                        current = i;
                    }
                }

            }

            this.currentSectionIndex = current;

            const currentSectionElement = document.getElementById(`navSect${this.currentSection.id}`);

            this.autoscrollBar(currentSectionElement.offsetLeft - 40);

            this.$nextTick(() => {
                this.scrollBusy = false;
            });

        },


        onScroll() {
            if (!this.scrollBusy) {
                this.scrollBusy = true;
                this.recalcCurrentSectionIndex();
            }
        },

        autoscrollBar(pos) {
            clearTimeout(this.autoscrollTimer);

            this.autoscrollTimer = setTimeout (() => {
                const curScroll = this.$refs.nav.scrollLeft;
                if (pos < curScroll || Math.abs(curScroll - pos) > 150) {
                    this.$refs.nav.scroll({left: pos, behavior: 'smooth'});
                }
            }, 100);
        },


    }

}
</script>

<template>
    <div v-if="navSections" ref="nav" class="nav">
        <div v-for="nav in navSections"
             :key="nav.id"
             :id="'navSect' + nav.id"
             class="nav__item"
             :class="{'nav__item--active': nav.id === currentSection.id}"
             @click="handleScrollToSection(nav.id)">
            {{nav.name}}
        </div>
    </div>
</template>

<style src="./nav.css" scoped/>