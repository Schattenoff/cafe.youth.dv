<script>
export default {
    name: "Auth",

    props: ['isAuth'],

    data() {
        return {
            login: '',
            password: '',
            confirmLogin: 'admin',
            confirmPassword: 'yaAdminRealno',
        }
    },

    methods: {
        auth() {
            if (this.login === this.confirmLogin && this.password === this.confirmPassword) {
                this.$emit('auth', true);
            } else {
                alert('Неверный логин или пароль');
            }
        }
    }
}
</script>

<template>
    <div class="auth">
        <div class="auth__form">
            <label class="auth__field">
                <div class="auth__caption">Логин</div>
                <input class="auth__input" v-model="login" />
            </label>
            <label class="auth__field">
                <div class="auth__caption">Пароль</div>
                <input class="auth__input" type="password" v-model="password" />
            </label>
            <button class="auth__btn" @click="auth()">Войти</button>
        </div>
    </div>
</template>

<style src="./auth.css" scoped />