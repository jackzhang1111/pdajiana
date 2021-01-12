/*
 * @Author: your name
 * @Date: 2020-11-16 16:14:52
 * @LastEditTime: 2020-11-16 16:17:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pdajiana\config\dev.env.js
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // PDT_API: '"http://47.115.5.76:8083"'
  //PDT_API: '"http://192.168.3.32:99"',
  PDT_API: '"http://192.168.3.8:99"',
})
