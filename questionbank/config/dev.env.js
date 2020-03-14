'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
API_BASE_URL: '"http://netapi.xkedu.top/api"',// 测试地址

//     API_BASE_URL: '"https://netapi.xkedu.org/api"',   // 正式地址
})
