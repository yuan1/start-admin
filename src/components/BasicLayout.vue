<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider :trigger="null" collapsible v-model="collapsed">
      <div class="logo">
        <h1>HUA</h1>
      </div>
      <a-menu mode="inline" theme="dark" :inlineCollapsed="collapsed">
        <template v-for="(menu,index) in menuData">
          <a-sub-menu
            v-if="menu.children && menu.children.length>0"
            :key="'sub_'+index+'_'+menu.icon"
          >
            <span slot="title">
              <a-icon :type="menu.icon"/>
              <span>{{menu.name}}</span>
            </span>
            <a-menu-item
              v-for="(child,cindex) in menu.children"
              :key="'sub_child_'+index+cindex+'_'+child.icon"
            >
              <router-link :to="child.path">{{child.name}}</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="'menu_'+index+'_'+menu.icon" @click="router.push(menu.path)">
            <a-icon :type="menu.icon"/>
            <span>{{menu.name}}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <div>
          <div>
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="()=> collapsed = !collapsed"
            />
            <div style="float: right;margin: 0 10px">
              <a href="https://www.baidu.com/">
                <span class="action">
                  <a-icon type="question-circle-o"/>
                </span>
              </a>
              <span class="action">
                <a-icon type="bell"/>
              </span>
              <a-dropdown>
                <a class="action" href="#">
                  <a-avatar
                    class="avatar"
                    size="small"
                    style="margin-right: 12px"
                    src="https://axure-file.lanhuapp.com/6b1d2547-b791-4d62-adce-a4881352a46d__862eb7a7eeb6b7490153498e634cb182"
                  />
                  {{$store.state.user.username}}
                </a>
                <a-menu slot="overlay">
                  <a-menu-item key="0" @click="setClick">
                    <a href="#">
                      <a-icon type="home"/>个人中心
                    </a>
                  </a-menu-item>
                  <a-menu-item key="1" @click="changePwd">
                    <a href="#">
                      <a-icon type="setting"/>账号设置
                    </a>
                  </a-menu-item>
                  <a-menu-divider/>
                  <a-menu-item key="3" @click="exitLayout">
                    <a-icon type="logout"/>退出登录
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '0', minHeight: '280px', overflowY: 'auto' }">
        <router-view/>
      </a-layout-content>
      <a-layout-footer style="text-align: center">huahuah</a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import router from "@/router";

export default {
  data() {
    return {
      collapsed: false,
      menuData: []
    };
  },
  created() {
    let routers = JSON.parse(localStorage.getItem("USER_ROUTER")) || [];
    console.log(routers);
    this.menuData = routers
      .find(item => item.path === "/")
      .children.filter(menu => {
        let meta = menu.meta;
        if (typeof meta.isShow === "undefined") {
          return true;
        } else return meta.isShow;
      });
    console.log(this.menuData);
  },
  methods: {
    exitLayout() {
      this.$store.commit("logout");
      location.reload();
    },
    changePwd() {
      router.push("/info");
    },
    setClick() {
      router.push("/setting");
    }
  }
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
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
