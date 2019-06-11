<template>
    <a-layout-sider
            width="256px"
            :collapsible="collapsible"
            v-model="collapsed"
            :trigger="null">
        <div :class="['logo']">
            <router-link to="/">
                <!--                <img src="logo.png" alt="">-->
                <h1 class="animated fadeIn">XXXXXX</h1>
            </router-link>
        </div>
        <i-menu :collapsed="collapsed" :menuData="menuData" @select="onSelect"/>
    </a-layout-sider>
</template>

<script>
    import IMenu from './menu'

    export default {
        name: 'SiderMenu',
        components: {IMenu},
        props: {
            collapsed: {
                type: Boolean,
                required: false,
                default: false
            },
            menuData: {
                type: Array,
                required: true
            },
            collapsible: {
                type: Boolean,
                required: false,
                default: false
            },

        },
        methods: {
            onSelect(obj) {
                this.$emit('menuSelect', obj)
            }
        }
    }
</script>

<style scoped>
    .shadow {
        box-shadow: 1px 0 6px rgba(0, 21, 41, .35);
    }
</style>
