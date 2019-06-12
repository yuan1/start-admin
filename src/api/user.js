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
        let fd = new FormData();
        fd.append('username', data.username);
        fd.append('password', data.password);
        return axios.post(`${base.api}/login`, fd, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    menuData(username) {
        return axios.get(`${base.api}/menu/${username}`)
    }

};

export default user;
