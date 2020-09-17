'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PDT_API: '"http://192.168.3.8:99"',
  // PDT_API:'"http://47.115.5.76:8083"'
})
