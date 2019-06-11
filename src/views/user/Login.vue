<template>
    <div style="width: 400px;height:100%;margin: 0 auto;display: flex; flex-direction:column;justify-content:center">
        <h1 style="text-align: center">HUA起飞ADMIN项目</h1>
        <a-form
                id="components-form-demo-normal-login"
                :form="form"
                class="login-form"
                @submit="handleSubmit"
        >
            <a-form-item>
                <a-input
                        v-decorator="[
          'username',
          { rules: [{ required: true, message: 'Please input your username!' }] }
        ]"
                        placeholder="Username"
                >
                    <a-icon
                            slot="prefix"
                            type="user"
                            style="color: rgba(0,0,0,.25)"
                    />
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-input
                        v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] }
        ]"
                        type="password"
                        placeholder="Password"
                >
                    <a-icon
                            slot="prefix"
                            type="lock"
                            style="color: rgba(0,0,0,.25)"
                    />
                </a-input>
            </a-form-item>
            <a-form-item>
                <a
                        class="login-form-forgot"
                        href=""
                >
                    Forgot password
                </a>
                <a-button
                        :loading="loading"
                        type="primary"
                        html-type="submit"
                        class="login-form-button"
                >
                    Log in
                </a-button>
                Or
                <router-link to="/session/register"> register now!</router-link>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                loading: false,
                form: this.$form.createForm(this)
            }
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault();
                const {
                    form: {validateFields}
                } = this;
                validateFields((err, values) => {
                    if (!err) {
                        console.log(values);
                        this.$api.user.login(values).then(res => {
                            // 执行某些操作
                            if (res.data && res.data.data) {
                                let data = res.data.data;
                                this.saveLoginData(data);
                            }
                            setTimeout(() => {
                                this.loading = false
                            }, 500);
                            this.$router.push('/')
                        }).catch(() => {
                            this.loading = false;
                        })
                    }
                });
            },
            saveLoginData(data) {
                this.$store.commit('setToken', data.token);
                this.$store.commit('setUser', data.user);
                this.$store.commit('setPermissions', data.permissions);
                this.$store.commit('setRoles', data.roles);
            }
        },
    }
</script>
<style>
    #components-form-demo-normal-login .login-form {
        max-width: 300px;
    }

    #components-form-demo-normal-login .login-form-forgot {
        float: right;
    }

    #components-form-demo-normal-login .login-form-button {
        width: 100%;
    }
</style>
