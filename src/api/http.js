import axios from 'axios';
import main from '@/main.js'
import { Toast } from 'vant';
import Qs from 'qs'
//form Data格式
const mainAxios = axios.create({
    timeout: 30000,
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    withCredentials: true,
});

const parkAxios = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type':'application/json;charset=utf-8'
    },
    withCredentials: true,
});


// 添加请求拦截器
mainAxios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    Toast.loading({
        message: 'loading',
        forbidClick: true,
        loadingType: 'spinner',
        duration:30000
      });
    
    return config;

    }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加请求拦截器
parkAxios.interceptors.request.use(function (config) {
    if(localStorage.token){
        config.headers.token = localStorage.token; 
    }
    
    // 在发送请求之前做些什么
    Toast.loading({
        message: 'loading',
        forbidClick: true,
        loadingType: 'spinner',
        duration:10000
      });
    config.transformRequest = [function (data) {
        // 在请求之前对data传参进行格式转换
        data = JSON.stringify(data)
        return data
    }];
    return config;

    }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加响应拦截器
mainAxios.interceptors.response.use(function (response) {
    let { noError = true } =  response.config

    if (noError) {
        let data = response.data
        if(data.code < 0){
            if(data.code == -1){
                data.msg = "Token cannot be null"
                setTimeout(()=>{main.$router.push({name: 'login'})},1000)

            }else if(data.code == -2){
                data.msg = "No account information! Please login again."
                setTimeout(()=>{main.$router.push({name: 'login'})},1000)

            }else if(data.code == -3){
                data.msg = "The login is invalid. Please login again."
                setTimeout(()=>{main.$router.push({name: 'login'})},1000)

            }else if(data.code == -4){
                data.msg = "Non-existent account/incorrect password"
            }
        }else{
            if (data.code == 500) {
                data.msg = "Network is busy, please try again later!"
                Toast(data.msg);
            }else if(data.code == 0){
                Toast.clear();
            }
        }
        
    }
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    if (error.response) {
        console.log(error.response);
        if (error.response.status == 401 ) {
            console.log(401);
            // redirect()
        } else if (error.response.status == 402) {
            console.log(402);
            // redirect()
        }
        Toast("Network is busy, please try again later!");
    }

    return Promise.reject(error);
});

// 添加响应拦截器
parkAxios.interceptors.response.use(function (response) {
    let { noError = true } =  response.config
    if (noError) {
        let data = response.data
        if(data.code < 0){
            if(data.code == -1){
                data.msg = "Token cannot be null"
                setTimeout(()=>{main.$router.push({name: 'login'})},1000)
            }else if(data.code == -2){
                data.msg = "No account information! Please login again."
                setTimeout(()=>{main.$router.push({name: 'login'})},1000)
                
            }else if(data.code == -3){
                data.msg = "The login is invalid. Please login again."
                setTimeout(()=>{main.$router.push({name: 'login'})},1000)
            }else if(data.code == -4){
                data.msg = "Non-existent account/incorrect password"
            }
            Toast(data.msg);
        }else{
            if (data.code == 500) {
                data.msg = "Network is busy, please try again later!"
                Toast(data.msg);
            }else if(data.code == 0){
                Toast.clear();
            }else{
                Toast('error');
            }
        }
        
    }
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    Toast('error');
    if (error.response) {
        console.log(error.response);
        if (error.response.status == 401 ) {
            console.log(401);
            // redirect()
        } else if (error.response.status == 402) {
            console.log(402);
            // redirect()
        }
        Toast("Network is busy, please try again later!");
    }

    return Promise.reject(error);
});

function redirect(){}



export {mainAxios,parkAxios}
