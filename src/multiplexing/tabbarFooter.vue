<!--
 * @Author: your name
 * @Date: 2020-11-16 16:14:52
 * @LastEditTime: 2020-11-18 16:04:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pdajiana\src\multiplexing\tabbarFooter.vue
-->
<template>
    <!-- 底部导航 -->
    <div class="tabbar">
        <van-tabbar class="icons" v-model="active" active-color="#000" inactive-color="#010101" route>
            <!-- <span>自定义</span> -->
            <!-- <img slot="icon" slot-scope="props" :src="props.active ? icon.active : icon.inactive"> -->
            <van-tabbar-item route to="/control/warehousing" replace v-if="!userinfoPda.personnelId">
                <span>Warehouse</span>
                <img slot="icon" slot-scope="props" :src="props.active ? icon.cangchu1 : icon.cangchu" class="icon-style">
            </van-tabbar-item>
             <van-tabbar-item route to="/control/logistics" replace v-if="userinfoPda.personnelId">
                <span>Delivery</span>
                <img slot="icon" slot-scope="props" :src="props.active ? icon.wuliu1 : icon.wuliu" class="icon-style">
            </van-tabbar-item>
            <!-- <van-tabbar-item route to="/control/statistical" replace>
                <span>Statistics</span>
                <img slot="icon" slot-scope="props" :src="props.active ? icon.tongji1 : icon.tongji" class="icon-style">
            </van-tabbar-item> -->
            <van-tabbar-item route to="/control/account" replace> 
                <span>My</span>
                <img slot="icon" slot-scope="props" :src="props.active ? icon.wode1 : icon.wode" class="icon-style">
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import cangchu from '@/assets/img/warehousing-01@2x.png'
import cangchu1 from '@/assets/img/warehousing@2x.png'
import wuliu from '@/assets/img/logistics-01@2x.png'
import wuliu1 from '@/assets/img/logistics@2x.png'
import tongji from '@/assets/img/statistical-01@2x.png'
import tongji1 from '@/assets/img/statistical@2x.png'
import wode from '@/assets/img/account-01@2x.png'
import wode1 from '@/assets/img/account@2x.png'
import {getuserApi} from '@/api/login/index.js'
export default {
    props: {

    },
    data() {
        return {
            icon:{
                cangchu,
                cangchu1,
                wuliu,
                wuliu1,
                tongji,
                tongji1,
                wode,
                wode1
            },
            active:0,
            userinfoPda:{}
        };
    },
    computed: {

    },
    created() {

    },
    mounted() {
        setTimeout(()=>{
            let userinfoPda=localStorage.userinfoPda
            if(userinfoPda){
                this.userinfoPda = JSON.parse(localStorage.userinfoPda)
            }else{
                this.getuser()
            }
        },2000)
        
    },
    watch: {

    },
    methods: {
        // 获取用户信息
        getuser(){
            getuserApi({}).then(res=>{
                this.userinfoPda = res.user
                localStorage.userinfoPda = JSON.stringify(res.user); 
            })
        }
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.tabbar{
    width: 100%;
    height: 98px;
}
</style>
