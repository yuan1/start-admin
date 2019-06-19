/**
 * userManager模块接口列表
 * @author lyh
 * @date 2019-06-12
 */

import base from './base'; // 导入接口域名列表
import axios from '@/utils/http'; // 导入http中创建的axios实例

const userManager = {
    // 系统管理 (定义调用接口的方法，根据需求传参，并返回数据)
    /* 用户 */
    getUser(params) {
        return axios.get(`${base.api}/user`, { params: params })
    },
    createUser(data) {
        return axios.post(`${base.api}/user`, data)
    },
    updateUser(data) {
        return axios.put(`${base.api}/user`, data)
    },
    deleteUser(userIds) {
        return axios.delete(`${base.api}/user/${userIds.join(',')}`)
    },

    userPswReset(params) {
        return axios.get(`${base.api}/user/password/reset`,{ params: params })
    },
    /* 角色 */
    getRole(params) {
        return axios.get(`${base.api}/role`,{ params: params })
    },
    createRole(data){
        return axios.post(`${base.api}/role`, data)
    },
    updateRole(data){
        return axios.put(`${base.api}/role`, data)
    } ,
    deleteRole(roleIds) {
        return axios.delete(`${base.api}/role/${roleIds.join(',')}`)
    },
    getRoleMenu(roleId) {
        return axios.get(`${base.api}/role/menu/${roleId}`)
    },

    /* 部门 */
    getDept(params) {
        return axios.get(`${base.api}/dept`,{ params: params })
    },
    createDept(data){
        return axios.post(`${base.api}/dept`, data)
    },
    updateDept(data){
        return axios.put(`${base.api}/dept`, data)
    } ,
    deleteDept(deptIds) {
        return axios.delete(`${base.api}/dept/${deptIds.join(',')}`)
    },
    /* 菜单 */
    getMenu(params) {
        return axios.get(`${base.api}/menu`,{ params: params })
    },
    createMenu(data){
        return axios.post(`${base.api}/menu`, data)
    },
    updateMenu(data){
        return axios.put(`${base.api}/menu`, data)
    } ,
    deleteMenu(menuIds) {
        return axios.delete(`${base.api}/menu/${menuIds.join(',')}`)
    },
    /* 字典 */
    getDict(params) {
        return axios.get(`${base.api}/dict`,{ params: params })
    },
    createDict(data){
        return axios.post(`${base.api}/dict`, data)
    },
    updateDict(data){
        return axios.put(`${base.api}/dict`, data)
    } ,
    deleteDict(dictIds) {
        return axios.delete(`${base.api}/dict/${dictIds.join(',')}`)
    },

};

export default userManager;