<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-header style="background: #fff; padding: 0">
            <div>
                <div>
                    <a-icon
                            class="trigger"
                            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                            @click="()=> collapsed = !collapsed"
                    />
                    <div style="float: right;margin: 0 10px">
                        <a href="https://www.baidu.com/"><span class="action"><a-icon
                                type="question-circle-o"/></span></a>
                        <span class="action"><a-icon type="bell"/></span>
                        <a-dropdown>
                            <a class="action" href="#">
                                <a-avatar class="avatar" size="small" style="margin-right: 12px"
                                          src="https://axure-file.lanhuapp.com/6b1d2547-b791-4d62-adce-a4881352a46d__862eb7a7eeb6b7490153498e634cb182"/>
                                {{$store.state.account.firstName}}
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item key="0" @click="setClick">
                                    <a href="#">
                                        <a-icon type="home"/>
                                        个人中心 </a>
                                </a-menu-item>
                                <a-menu-item key="1" @click="changePwd">
                                    <a href="#">
                                        <a-icon type="setting"/>
                                        账号设置 </a>
                                </a-menu-item>
                                <a-menu-divider/>
                                <a-menu-item key="3" @click="exitLayout">
                                    <a-icon type="logout"/>
                                    退出登录
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </div>
                </div>
            </div>

        </a-layout-header>
        <div class="breadcrumb">
            <a-breadcrumb :routes="routes">
                <template slot="itemRender" slot-scope="{route, params, routes, paths}">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{route.breadcrumbName}}  {{$route.path}}
      </span>
                    <router-link v-else :to="`${basePath}/${paths.join('/')}`">
                        {{route.breadcrumbName}}
                    </router-link>
                </template>
            </a-breadcrumb>
        </div>
        <a-layout-content :style="{ margin: '0', minHeight: '280px' }">
            <router-view/>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            huahuah
        </a-layout-footer>


    </a-layout>
</template>
<script>

    import router from '@/router';

    export default {
        data() {
            const {lang} = this.$route.params;
            return {
                collapsed: false,
                basePath: `/${lang}/components/breadcrumb`,
                routes: [{
                    path: 'index',
                    breadcrumbName: '首页'
                }, {
                    path: 'first',
                    breadcrumbName: '仪表盘'
                }],
            }
        },
        methods: {
            exitLayout() {
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                router.replace({
                    path: '/session/login',
                    query: {
                        redirect: router.currentRoute.fullPath
                    }
                });
            },
            changePwd() {
                this.$router.push('/info');
            },
            setClick() {
                this.$router.push('/setting');
            }
        }
    }


</script>
<style>
    #components-layout-demo-custom-trigger .trigger {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color .3s;
        z-index: 100;
    }

    #components-layout-demo-custom-trigger .trigger:hover {
        color: #1890ff;
    }

    #components-layout-demo-custom-trigger .logo {
        height: 45px;
        width: 45px;
        background: url("../assets/logo.png");
        background-size: 100% 100%;
        margin: 16px;
    }

    .logo h1 {
        color: #fff;
        margin: 0 0 0 64px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        font-weight: 400;
        vertical-align: middle;
        font-size: 18px;
        line-height: 46px;
    }

    .ant-layout.ant-layout-has-sider {
        height: 100%;
    }

    .breadcrumb {
        background: #fff;
        padding: 16px 32px 0;
        border-top: 1px solid #e8e8e8;
    }

    .action {
        padding: 0 12px;
    }


</style>
