/**
 * task模块接口列表
 * @author lyh
 * @date 2019-06-19
 */

import base from './base'; // 导入接口域名列表
import axios from '@/utils/http'; // 导入http中创建的axios实例

const task = {
    /* 定时任务 */
    getJob(params) {
        return axios.get(`${base.api}/job`, { params: params })
    },
    createJob(data) {
        return axios.post(`${base.api}/job`, data)
    },
    updateJob(data) {
        return axios.put(`${base.api}/job`, data)
    },
    deleteJob(jobIds) {
        return axios.delete(`${base.api}/job/${jobIds}`)
    },
    runJob(jobId) {
        return axios.get(`${base.api}job/run${jobId}`)
    },
    pauseJob(jobId) {
        return axios.get(`${base.api}/job/pause${jobId}`)
    },
    resumeJob(jobId) {
        return axios.get(`${base.api}/job/resume${jobId}`)
    },

};

export default task;
