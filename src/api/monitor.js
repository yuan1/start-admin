/**
 * monitor模块接口列表
 * @author lyh
 * @date 2019-06-19
 */

import base from './base'; // 导入接口域名列表
import axios from '@/utils/http'; // 导入http中创建的axios实例

const monitor = {
    /* 在线用户 */
    getOnline(params) {
        return axios.get(`${base.api}/online`, { params: params })
    },
    deleteOnline(id) {
        return axios.delete(`${base.api}/online/${id}`)
    },
    /* 系统日志 */
    getSystemLog(params) {
        return axios.get(`${base.api}/log`,{ params: params })
    },
    deleteSystemLog(ids) {
        return axios.delete(`${base.api}/log/${ids}`)
    },

};

export default monitor;
