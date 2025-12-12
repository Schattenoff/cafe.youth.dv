<script>
import DishForm from "@/assets/panel/menu/section/dish/form/DishForm.vue";
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";

export default {
    name: "Dish",

    components: {
        DishForm
    },

    inject: ['refetchSections'],

    props: ['dish', 'section'],

    data() {
        return {
            isShowForm: false,
            isEditForm: false,
        }
    },

    computed: {
        photoStyle() {
            if(!this.dish.imageUrl) return;

            return {
                'background-size': 'cover',
                'background-image': `url(${this.dish.imageUrl})`
            }
        },

        classVisible() {
            if(this.dish.isVisible) {
                return 'dish__action--visible';
            } else {
                return 'dish__action--notVisible';
            }
        }
    },

    methods: {
        onOpenForm() {
            this.isShowForm = true;
        },

        onCloseForm() {
            this.isShowForm = false;
            this.isEditForm = false;
        },

        onEditForm() {
            this.isEditForm = true;
            this.onOpenForm();
        },

        onDelete() {
            const payload = {};

            window.confirm(`Вы уверены, что хотите удалить «${this.dish.name}»?`) &&
            apiRequest('delete', `/dish/${this.dish.id}`, payload, (res) => {
                if (res.error) {
                    return;
                }

                this.refetchSections();
            });
        },

        onToggleVisible() {
            const payload = {
                id: this.dish.id,
                isVisible: !this.dish.isVisible
            }

            apiRequest('put', '/dish', payload, (res) => {
                if (res.error) {
                    return;
                }

                this.refetchSections();
            })
        }

    }

}
</script>

<template>
    <div v-if="dish.id" class="dish" :class="{'dish--hidden': !dish.isVisible}">
        <div class="dish__photo" :style="photoStyle"></div>
        <div class="dish__wrap">
            <div class="dish__name">{{ dish.name }}</div>
            <div class="dish__price">{{ dish.price.toFixed(2) }} руб.</div>
        </div>
        <div class="dish__actions">
            <div class="dish__action dish__action--edit" @click="onEditForm()"></div>
            <div class="dish__action" :class="classVisible" @click="onToggleVisible()"></div>
            <div class="dish__action dish__action--delete" @click="onDelete()"></div>
        </div>
    </div>
    <div v-else class="dish__add" @click="onOpenForm()">Добавить</div>
    <DishForm v-if="isShowForm"
              :isEdit="isEditForm"
              :dish="dish"
              :section="section"
              @close="onCloseForm()" />
</template>

<style src="./dish.css" scoped />