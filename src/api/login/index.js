/*
 * @Author: your name
 * @Date: 2020-11-16 16:14:52
 * @LastEditTime: 2020-11-18 17:24:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pdajiana\src\api\login\index.js
 */
import {main, park} from '@/api/index'
//登录
export function loginApi(params) {
    return park({
        url:`/PDAlogin/pda/login`,
        method: 'POST',
        data:params
    })
}

//共方法返回图片服务器的路径
export function gethttpimgurlApi(params) {
    return park({
        url:`/PDAlogin/gethttpimgurl`,
        method: 'POST',
        data:params
    })
}

//用户退出登录
export function logoutApi() {
    return park({
        url:`/PDAlogin/logout`,
        method: 'POST',
    })
}

//版本明细
export function getversionApi() {
    return park({
        url:`PDAlogin/getversion`,
        method: 'POST',
    })
}

//获取其他相关的域
export function getrelatedomainApi() {
    return park({
        url:`/PDAlogin/getrelatedomain`,
        method: 'POST',
    })
}

//获取用户信息
export function getuserApi(params) {
    return park({
        url:`/PDAlogin/getuser`,
        method: 'POST',
        data:params
    })
}

