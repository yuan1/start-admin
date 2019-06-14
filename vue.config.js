//解决跨域问题，访问其他链接
module.exports = {
    devServer: {
    proxy: {
        '/api': {
            target: 'http://admin.liuyonghua.cn:9527/',
                ws: true,
                changeOrigin: true
        }
    }
}
}