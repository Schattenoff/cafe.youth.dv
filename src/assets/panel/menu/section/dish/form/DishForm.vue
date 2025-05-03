<script>
import {apiRequest} from "@/assets/common/apiRequest/apiRequest.js";

export default {
    name: "DishForm",

    inject: ['refetchSections'],

    props: ['isEdit', 'section', 'dish'],

    data() {
        return {
            isLoading: false,
            name: '',
            price: '',
            image: '',
            imagePreview: '',
        }
    },

    computed: {
        headerText() {
            return this.isEdit ? 'Редактирование' : 'Добавить';
        },

        buttonText() {
            return this.isEdit ? 'Сохранить' : 'Добавить';
        }
    },

    mounted() {
        if(this.isEdit && this.dish) {
            this.name = this.dish.name;
            this.price = this.dish.price;
            this.imagePreview = this.dish.imageUrl;
        }
    },

    methods: {
        onClose() {
            this.$emit('close');
        },

        handleImageUpload(e) {
            const file = e.target.files[0]
            if (file) {
                this.image = file;
                // Создаем превью изображения
                const reader = new FileReader()
                reader.onload = (event) => {
                    this.imagePreview = event.target.result
                }
                reader.readAsDataURL(file)
            }
        },

        removeImage() {
            this.image = null;
            this.imagePreview = null;
        },

        onSubmit() {
            if(this.isLoading) return;

            this.isLoading = true;

            const formData = new FormData();
            formData.append('id', this.dish.id);
            formData.append('name', this.name);
            formData.append('price', this.price);
            formData.append('sectionId', this.section.id);
            formData.append('image', this.image);

            apiRequest(this.isEdit ? 'put' : 'post', '/dish', formData, (res) => {
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
    <div class="dishForm__overlay" @click.self="onClose()">
        <div class="dishForm">
            <div class="dishForm__header">
                <h3>{{ headerText }}</h3>
                <button @click="onClose">&times;</button>
            </div>
            <div class="dishForm__body">

                <div class="dishForm__field">
                    <div class="dishForm__caption">Изображение</div>
                    <div class="dishForm__imageUpload">
                        <input
                            v-if="!imagePreview"
                            type="file"
                            accept="image/*"
                            @change="handleImageUpload"
                            ref="fileInput">
                        <div class="dishForm__imagePreview" v-if="imagePreview">
                            <img :src="imagePreview" alt="Превью">
                            <button
                                type="button"
                                @click.stop="removeImage"
                                class="dishForm__removeImage">
                                &times;
                            </button>
                        </div>
                        <div v-else class="dishForm__imageUploadPlaceholder">
                            <span>+ Загрузить изображение</span>
                        </div>
                    </div>
                </div>

                <div class="dishForm__field">
                    <div class="dishForm__caption">Название</div>
                    <input class="dishForm__input" type="text" id="title" v-model="name" required>
                </div>

                <div class="dishForm__field">
                    <div class="dishForm__caption">Цена</div>
                    <input
                        class="dishForm__input"
                        type="number"
                        id="price"
                        v-model.number="price"
                        min="0"
                        step="0.01"
                        required
                    >
                </div>

                <div class="dishForm__footer">
                    <div class="dishForm__submit" @click="onSubmit()">{{ buttonText }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="./dish-form.css" scoped />