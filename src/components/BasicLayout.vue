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
          <a-menu-item v-else :key="'menu_'+index+'_'+menu.icon" @click="$router.push(menu.path)">
            <a-icon :type="menu.icon"/>
            <span>{{menu.name}}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="()=> collapsed = !collapsed"
            />
            <div style="float: right;margin: 0 10px">
              <a-dropdown>
                <a class="action" href="#">
                  <a-avatar
                    class="avatar"
                    size="small"
                    style="margin-right: 12px"
                    :src="avatar"
                  />
                  {{user.username}}
                </a>
                <a-menu slot="overlay">
                  <a-menu-item key="0" @click="setClick">
                    <a href="#">
                      <a-icon type="user"/>个人中心
                    </a>
                  </a-menu-item>
                  <a-menu-item key="1" @click="changePwd">
                      <a-icon type="key"/>密码修改
                  </a-menu-item>
                  <a-menu-divider/>
                  <a-menu-item key="3" @click="exitLayout">
                    <a-icon type="logout"/>退出登录
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '0', minHeight: '280px', overflowY: 'auto' }">
        <div class="breadcrumb">
          <a-breadcrumb>
            <a-breadcrumb-item :key="item.path" v-for="(item, index) in breadcrumb">
              <span v-if="index === 0"><router-link to="/">{{item.name}}</router-link></span>
              <span v-else>{{item.name}}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <router-view/>
      </a-layout-content>
      <a-layout-footer style="text-align: center">huahuah</a-layout-footer>
    </a-layout>
    <update-password ref="pwdModal"/>
  </a-layout>

</template>
<script>
import UpdatePassword from "@/views/personal/UpdatePassword";
import {mapState} from "vuex";

export default {
  components: {UpdatePassword},
  data() {
    return {
      collapsed: false,
      menuData: [],
      breadcrumb: [],
      visible: false,
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
  computed: {
    ...mapState({
      user: state => state.user
    }),
    avatar() {
      return `static/avatar/${this.user.avatar}`
    },
  },
  mounted() {
    this.getBreadcrumb()
  },
  updated() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      this.breadcrumb = this.$route.matched
    },
    exitLayout() {
      this.$store.commit("logout");
      location.reload();
    },
    changePwd(){
      this.$refs.pwdModal.show();
    },
    setClick() {
      this.$router.push('/profile')
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
