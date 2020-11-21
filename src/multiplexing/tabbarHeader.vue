<!--
 * @Author: your name
 * @Date: 2020-11-16 16:14:52
 * @LastEditTime: 2020-11-19 16:09:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pdajiana\src\multiplexing\tabbarHeader.vue
-->
<template>
    <div class="tabbar-header">
        <span class="left" v-if="relateDomainListEng" @click="toUrl(relateDomainListEng[0].domain)">Go {{relateDomainListEng[0].name}}</span>
        <span>{{headerTitle}}</span>
        <van-icon name="chat-o" size="20" class="chat"/>
    </div>
</template>

<script>
import {getrelatedomainApi} from '@/api/login/index'
export default {
    props: {
        headerTitle:{
            type:String,
            default:'TOSPINO'
        }
    },
    data() {
        return {
            relateDomainListEng:null
        };
    },
    computed: {

    },
    created() {

    },
    mounted() {
        // 英文版本信息
        let relateDomainListEng=localStorage.relateDomainListEng
        if(relateDomainListEng){
            this.relateDomainListEng=JSON.parse(localStorage.relateDomainListEng)
            console.log("mounted -> this.relateDomainListEng 老版系统", this.relateDomainListEng)
        }else{
            getrelatedomainApi().then(res=>{
                if(res.code===0){
                    this.relateDomainListEng=res.relateDomainListEng
                    localStorage.relateDomainListEng = JSON.stringify(res.relateDomainListEng);
                }
            })
        }
    },
    watch: {

    },
    methods: {
        toUrl(url){
            if(!url){
                return false
            }
            window.location.href = `${url}#/control/warehousing?token=${localStorage.token}`;
        }
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.tabbar-header{
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    position: relative;
    .chat{
        position: absolute;
        right:30px;
        top:50%;
        transform: translateY(-50%);
    }
    .left{
        position: absolute;
        left:30px;
        top:50%;
        font-size: 28px;
        transform: translateY(-50%);
    }
}
</style>
