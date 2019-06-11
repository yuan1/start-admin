/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import {notification} from 'ant-design-vue';
import store from '../store'


/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param other
 */
const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {
        case 404:
            notification.error({
                message: '系统提示',
                description: '很抱歉，资源未找到',
                duration: 4
            });
            break;
        case 403:
        case 401:
            notification.warn({
                message: '系统提示',
                description: '很抱歉，您无法访问该资源，可能是因为没有相应权限或者登录已失效',
                duration: 4
            });
            break;
        default:
            notification.error({
                message: '系统提示',
                description: other ? other : '系统内部异常，请联系网站管理员',
                duration: 4
            });
            break
    }
};

// 创建axios实例
var instance = axios.create({timeout: 1000 * 12});
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
    config => {
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
        // 有 token就带上
        if (store.state.token) {
            config.headers.Authentication = store.state.token
        }
        return config;
    },
    error => Promise.error(error));

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功
    res => Promise.resolve(res),
    // 请求失败
    error => {
        const {response} = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            // store.commit('changeNetwork', false);
        }
    });

export default instance;
