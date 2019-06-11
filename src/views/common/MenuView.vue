<template>
    <sider-menu :menuData="menuData" :collapsed="collapsed"
                 :collapsible="true"/>

</template>

<script>

    import SiderMenu from "@/components/menu/SiderMenu";

    let menuData = [];

    export default {
        name: "MenuView",
        components: {SiderMenu},
        data(){
            return{
                collapsed: false,
                menuData: menuData
            }
        },
        methods:{
            beforeCreate() {
                let routers = this.localStorage.getItem("USER_ROUTER");
                menuData = routers.find((item) => item.path === '/').children.filter((menu) => {
                    let meta = menu.meta;
                    if (typeof meta.isShow === 'undefined') {
                        return true
                    } else return meta.isShow
                })
            }
        }
    }
</script>

<style scoped>

</style>