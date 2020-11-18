<template>
    <div class="warehousing">
        <tabbar-header></tabbar-header>
        <div class="warehousing-top">
            <div class="fl-left tongji">
                <div class="fs-40 tongji-top">{{inordertotal}}</div>
                <div class="c-999">Today's Warehousing</div>
            </div>
            <div class="fl-left tongji">
                <div class="fs-40 tongji-top">{{transordertotal}}</div>
                <div class="c-999">Allocation</div>
            </div>
            <div class="fl-left tongji">
                <div class="fs-40 tongji-top">{{outordertotal}}</div>
                <div class="c-999">Today's Ex-warehouse</div>
            </div>
        </div>
        <div class="warehousing-con">
            <div class="con-item" v-for="(icon,index) in iconList" :key="index" @click="iconItem(icon.routerName)">
                <img :src="icon.icon">
                <div class="c-666">{{icon.name}}</div>
            </div>
        </div>
        
        <div class="saomiao-btn" @click="saomiaoBtn">
            <img src="@/assets/img/saomiao.svg">
            <span>Scan the Barcode</span>
        </div>


        <zhezhao v-if="zhezhaoStatus" @cancalZhezhao="cancalZhezhao">
            <div class="smxz">
                <div class="tiaoshu" v-for="saomiaoItme in saomiaoList" :key="saomiaoItme.value" @click.stop="toSweepCode(saomiaoItme.value)">{{saomiaoItme.name}}</div>
            </div>
        </zhezhao>
    </div>
</template>

<script>
import tabbarHeader from '@/multiplexing/tabbarHeader.vue'
import ghrk from '@/assets/img/ghrk.png'
import cgthck from '@/assets/img/cgthck.png'
import shouhou from '@/assets/img/shouhou.png'
import xsck from '@/assets/img/xsck.png'
import diaobo from '@/assets/img/diaobo.png'
import shangjia from '@/assets/img/shangjia.png'
import xiajia from '@/assets/img/xiajia.png'
import zhezhao from '@/multiplexing/zhezhao.vue'
import {pdaselecthomeordertotalApi} from '@/api/warehousing/warehousSupplied/index.js'
import {getuserApi} from '@/api/login/index.js'
// vue动态修改路由的query参数
import merge from 'webpack-merge'
export default {
    props: {

    },
    data() {
        return {
            iconList:[
                {
                    icon:ghrk,
                    name:'Warehousing Supplied',
                    routerName:'suppliedList'
                },
                {
                    icon:cgthck,
                    name:'Ex-warehouse for Cancellation',
                    routerName:'cancellationList'
                },
                {
                    icon:xsck,
                    name:'Sold',
                    routerName:'soldList'
                },
                {
                    icon:diaobo,
                    name:'Allocation',
                    routerName:'allocationList'
                },
                {
                    icon:shouhou,
                    name:'After-sale Service',
                    routerName:'warehouSalesList'
                },
                {
                    icon:shangjia,
                    name:'Shelve',
                    routerName:'shelveList'
                },
                {
                    icon:xiajia,
                    name:'Remove',
                    routerName:'removeList'
                },
            ],
            zhezhaoStatus:false,
            inordertotal:0,
            transordertotal:0,
            outordertotal:0,
            saomiaoList:[
                {name:'Warehouse',value:1},
                {name:'Ex-warehouse',value:2},
                {name:'Scan product',value:3},
                {name:'Scanning on shelves',value:4}
            ],
        };
    },
    computed: {

    },
    created() {
        let query=this.$route.query
        console.log("created -> query 老版系统", query)
        console.log('第一步');
        // window.open(`${res.jumpDomainEng}?token=${localStorage.token}&type=${that.code}&barcode=${result}`);
        this.$router.push({
            query:merge({})
        })
        if(query.token && query.type && query.barcode){
            localStorage.token=query.token
            this.newtoSweepCode(query.type,query.barcode)
            this.getuser()
            // this.$router.push({query:{}})
        }else if(query.token){
            localStorage.token=query.token
            this.getuser()
        }
        console.log('localStorage.token',localStorage.token);
        this.pdaselecthomeordertotal()
    },
    mounted() {
    },
    watch: {

    },
    methods: {
        cancalZhezhao(flag){
            this.zhezhaoStatus = flag
        },
        //点击物流类型
        iconItem(routerName){
            if(routerName == '') return
            this.$router.push({name:routerName})
            try{
                sessionStorage.removeItem('activeIndex')
                sessionStorage.removeItem('activeOne')
            }
            catch(error){
                console.log(err.message);
            }
        },
        //扫码
        toSweepCode(value){
            this.$router.push({name:'warehousweepCode',query:{code:value}})
        },
        //扫码 新版
        newtoSweepCode(type,barcode){
            this.$router.push({name:'warehousweepCode',query:{code:type,barcode:barcode}})
        },
        saomiaoBtn(){
            this.zhezhaoStatus = true;
        },
        pdaselecthomeordertotal(){
            pdaselecthomeordertotalApi().then(res => {
                if(res.code == 0){
                    this.inordertotal = res.Data.inordertotal
                    this.outordertotal = res.Data.outordertotal
                    this.transordertotal = res.Data.transordertotal
                }
            })
        },
        // 获取用户信息
        getuser(){
            getuserApi({}).then(res=>{
               localStorage.userinfoPda = JSON.stringify(res.user); 
            })
        }
    },
    components: {
        tabbarHeader,
        zhezhao
    },
};
</script>

<style scoped lang="less">
.warehousing{
    font-size: 24px;
    .warehousing-top{
        // padding: 0 30px;
        height: 230px;
        background-color: #fff;
        box-shadow:0px 10px 10px 0px rgba(59,59,59,0.12);
        border-radius:20px;
        margin:50px 30px 60px;
        .tongji{
            width: 33%;
            height: 100%;
            text-align: center;
            .tongji-top{
                padding: 74px 0 50px;
            }
        }
    }
    .warehousing-con{
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 100px;
        .con-item{
            width: 230px;
            height: 158px;
            text-align: center;
            img{
                // transform: scale(0.5);
                height: 50px;
                margin-bottom: 15px;
            }
        }
    }
    .saomiao-btn{
        margin:0 30px;
        height: 88px;
        line-height: 88px;
        font-size: 36px;
        color: #fff;
        text-align: center;
        background-color: #333;
        border-radius:44px;
        img{
            vertical-align: middle;
        }
    }
    .smxz{
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        .tiaoshu{
            padding-left:30px;
            width: 470px;
            height: 100px;
            background-color: #fff;
            line-height: 100px;
            font-size: 30px;
            border-bottom: 1px solid #999;
        }
    }
}
.fs-40{
    font-size: 40px;
}

</style>
