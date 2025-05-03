<script>
import Dish from "@/assets/panel/menu/section/dish/main/Dish.vue";
import SectionForm from "@/assets/panel/menu/section/form/SectionForm.vue";
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";

export default {
    name: "Section",

    components: {
        Dish,
        SectionForm
    },

    inject: ['refetchSections'],

    props: ['section'],

    data() {
        return {
            isShowForm: false,
            isEditForm: false,
        }
    },

    computed: {
        dishes() {
            return this.section.dishes;
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

            window.confirm(`Вы уверены что хотите удалить раздел «${this.section.name}»?`) &&
            apiRequest('delete', `/section/${this.section.id}`, payload, (res) => {
                if (res.error) {
                    return;
                }

                this.refetchSections();
            });
        }
    }
}
</script>

<template>
    <div v-if="section.id" class="section">
        <div class="section__title">
            {{ section.name }}

            <div class="section__actions">
                <div class="section__action section__action--edit" @click="onEditForm()"></div>
                <div class="section__action section__action--delete" @click="onDelete()"></div>
            </div>
        </div>
        <div class="section__dishes">
            <Dish v-for="dish in dishes"
                  :key="dish.id"
                  :dish="dish"
                  :section="section" />
        </div>
    </div>
    <div v-else class="section__add" @click="onOpenForm()">Добавить раздел</div>
    <SectionForm v-if="isShowForm"
                 :isEdit="isEditForm"
                 :section="section"
                 @close="onCloseForm()" />
</template>

<style src="./section.css" scoped />