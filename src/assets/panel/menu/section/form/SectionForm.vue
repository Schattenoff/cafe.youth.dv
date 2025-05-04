<script>
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";

export default {
    name: "SectionForm",

    inject: ['refetchSections'],

    props: ['isEdit', 'section'],

    data() {
        return {
            isLoading: false,
            name: ''
        }
    },

    computed: {
        headerText() {
            return this.isEdit ? 'Редактирование' : 'Добавить раздел';
        },

        buttonText() {
            return this.isEdit ? 'Сохранить' : 'Добавить';
        }
    },

    mounted() {
        if(this.isEdit && this.section) {
            this.name = this.section.name;
        }
    },

    methods: {
        onClose() {
            this.$emit('close');
        },

        onSubmit() {
            if(this.isLoading) return;

            this.isLoading = true;

            const payload = {
                id: this.section.id,
                name: this.name
            }

            apiRequest(this.isEdit ? 'put' : 'post', '/section', payload, (res) => {
                this.isLoading = false;

                if (res.error) {
                    return;
                }

                this.onClose();
                this.refetchSections();
            });
        }
    }

}
</script>

<template>
    <div class="sectionForm__overlay" @click.self="onClose()">
        <div class="sectionForm">
            <div class="sectionForm__header">
                <h3>{{ headerText }}</h3>
                <button @click="onClose">&times;</button>
            </div>
            <div class="sectionForm__body">
                <div class="sectionForm__field">
                    <div class="sectionForm__caption">Название раздела</div>
                    <input class="sectionForm__input" type="text" id="title" v-model="name" required>
                </div>
                <div class="sectionForm__footer">
                    <div class="sectionForm__submit" @click="onSubmit()">
                        <div v-if="isLoading" class="sectionForm__spinner"></div>
                        <span v-else>{{ buttonText }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="./section-form.css" scoped />