import Vuex from 'vuex';
import Vue from 'vue';

// import api from './api' // 导入api接口

Vue.use(Vuex);

function save(name, data) {
    localStorage.setItem(name, JSON.stringify(data))
}

function get(name) {
    const data = localStorage.getItem(name);
    return data ? JSON.parse(data) : null;
}

export default new Vuex.Store({
    state: {
        token: get('USER_TOKEN'),
        user: get('USER'),
        permissions: get('PERMISSIONS'),
        roles: get('ROLES'),

    },
    mutations: {
        // 登录成功将, token保存在localStorage中
        setToken: (state, data) => {
            save('USER_TOKEN', data);
            state.token = data;
        },
        // 退出登录将, token清空
        logout: (state) => {
            localStorage.clear();
            state.token = null
        },
        setUser: (state, data) => {
            save('USER', data);
            state.user = data;
        },
        setPermissions: (state, data) => {
            save('PERMISSIONS', data);
            state.permissions = data;
        },
        setRoles: (state, data) => {
            save('ROLES', data);
            state.roles = data;
        }

    },
    actions: {
        // initAccount({commit}) {
        //     api.user.getAccount().then(res => {
        //         console.log(res.data);
        //         commit('setAccount', res.data);
        //     })
        // }
    }
});
