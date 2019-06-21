/**
 * user模块接口列表
 * @author lyh
 * @date 2019-06-11
 */

import base from './base'; // 导入接口域名列表
import axios from '@/utils/http'; // 导入http中创建的axios实例

const user = {
    // 用户登录  (定义调用接口的方法，根据需求传参，并返回数据)
    login(data) {
        return axios.post(`${base.api}/login`,data)
    },
    menuData(username) {
        return axios.get(`${base.api}/menu/${username}`)
    },
    updateAvatar(data) {
        return axios.put(`${base.api}/user/avatar`, data)
    },
    updateProfile(data) {
        return axios.put(`${base.api}/user/profile`, data)
    },
    updatePassword(data) {
        return axios.put(`${base.api}/user/password`, data)
    },
    checkPassword(params) {
        return axios.get(`${base.api}/user/password/check`, { params: params })
    },
    userProfile(data) {
        return axios.get(`${base.api}/user/${data.username}`)
    },
    indexPage(data) {
        return axios.get(`${base.api}/index/${data.username}`)
    },

};

export default user;
