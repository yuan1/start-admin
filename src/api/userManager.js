/**
 * userManager模块接口列表
 * @author lyh
 * @date 2019-06-12
 */

import base from './base'; // 导入接口域名列表
import axios from '@/utils/http'; // 导入http中创建的axios实例

const userManager = {
    // 系统管理 (定义调用接口的方法，根据需求传参，并返回数据)
    getUser(params) {
        return axios.get(`${base.api}/user`, { params: params })
    },
    // checkUser (username) {
    //     return axios.get(`${base.api}/user/check/${username}`,)
    // },
    createUser(data) {
        return axios.post(`${base.api}/user`, data)
    },
    updateUser(data) {
        return axios.put(`${base.api}/user`, data)
    },
    deleteUser(userIds) {
        return axios.delete(`${base.api}/user/${userIds.join(',')}`)
    },
    getRole() {
        return axios.get(`${base.api}/role`)
    },
    getDept() {
        return axios.get(`${base.api}/dept`)
    },

};

export default userManager;