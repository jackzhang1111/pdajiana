'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PDT_API:'"http://192.168.3.107:99"',   //ERP api
  // PDT_API:'"http://47.115.5.76:8083"'
})
