<template>
<!-- 供货入库列表 -->
    <div class="supplied-list">
        <saomiao-header @search="search"></saomiao-header>
        <div class="commodity-tab">
            <van-tabs type="card" color="#666666" title-active-color="#333333" @change="onClick" v-model="active">
                <van-tab :title="tab.name" v-for='(tab,index) in tabList' :key="index">
                    <scroll class="bscroll-wrapper" ref="wrapper" :data="recordGroup" :pulldown="pulldown" :pullup="pullup" @pulldown="_pulldown" @pullup="_pullup">
                         <div class="bscroll-con">
                                <div class="order" v-for="(data,index) in dataList" :key="index" >
                                    <div class="order-header">
                                        <span>Supply No.:{{data.orderSn}}</span>
                                        <div class="fl-right">
                                            <span>{{orderStatus(data.wmsOrderStatus,'statusList')}}</span>
                                        </div>
                                    </div>
                                    <div class="order-con" @click="toDetail(data.orderId,data.wmsOrderStatus)">
                                        <p>Supplier：{{data.businessName}}</p>
                                        <p>Warehouse：{{data.warehouseName}}</p>
                                        <p>Qty Supplied：{{data.totalNum}}</p>
                                    </div>
                                    <div class="order-footer" v-show="data.wmsOrderStatus == 2 || data.wmsOrderStatus == 3">
                                        <!-- <div class="btn fl-right" v-if="data.wmsOrderStatus == 2">打印供货单</div> -->
                                        <!-- <div class="btn fl-right" v-if="data.wmsOrderStatus == 2" @click="toPickUp(data.orderId,data.wmsOrderStatus)">Warehouse</div> -->
                                        
                                        <!-- <div class="btn fl-right" v-if="data.wmsOrderStatus == 3">打印入库单</div> -->
                                        <!-- <div class="btn fl-right" v-if="data.wmsOrderStatus == 3" @click="toshelves(data.orderId)">Shelve</div> -->
                                        <div class="btn fl-right" v-if="data.canShelfUp == 1" @click="toshelves(data.orderId)">Shelve</div>
                                        <div class="btn fl-right" v-if="data.canStockIn == 1" @click="toPickUp(data.orderId,data.wmsOrderStatus)">Warehouse</div>
                                        <!-- <div class="btn fl-right" v-if="data.wmsOrderStatus == 4">打印上架单</div> -->
                                    </div>
                                </div>
                         </div>
                    </scroll>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
import saomiaoHeader from '@/multiplexing/saomiaoHeader.vue'
import { Dialog ,Toast} from 'vant';
import {supplyorderlistApi} from '@/api/warehousing/warehousSupplied/index.js'
export default {
    props: {

    },
    data() {
        return {
            tabList:[
                {name:'All',value:0},
                {name:'Undelivered',value:1},
                {name:'Not Stored',value:2},
                {name:'Not Added',value:3},
                {name:'Warehoused',value:4},
            ],
            statusList:[
                {name:'Unapproved',type:0},
                {name:'Undelivered',type:1},
                {name:'Not Stored',type:2},
                {name:'Not Added',type:3},
                {name:'Warehoused',type:4},
            ],
            active:0,
            recordGroup:[],
            pulldown:true,
            pullup:true,
            guanmengou:true,
            totalCount:0,
            dataList:[],
            formData:{
                orderSn:'',
                wmsOrderStatus:0,
                page:1,
                limit:10
            },
        };
    },
    computed: {

    },
    created() {

    },
    mounted() {
        this.refreshOrder()
        if(sessionStorage.getItem("activeIndex")){
            this.active = Number(sessionStorage.getItem("activeIndex"))
            this.formData.wmsOrderStatus = this.active
        }
    },
    watch: {

    },
    methods: { 
        //搜索框 
        search(value){
            this.$router.push({name:'suppliedSearch',query:{expressNo:value}})
        },
        //切换tab
        onClick(index) {
            this.formData.wmsOrderStatus = index 
            sessionStorage.setItem("activeIndex", index);
            this.refreshOrder()
        },
        //下拉刷新
        _pulldown(){
            setTimeout(()=>{
                this.refreshOrder()
            },500)
        },
        //上拉加载
        _pullup() {
            if(!this.pullup) return
            //不知道为什么触发两次,使用关门狗拦截
            if(this.guanmengou){
                this.formData.page++
                this.supplyorderlist(this.formData,false)
                this.guanmengou = false
            }
            setTimeout(()=>{
                this.guanmengou = true
            },500)
        },
        //刷新页面
        refreshOrder(){
            this.formData.page = 1
            this.formData.limit = 10
            this.supplyorderlist(this.formData,true)
            this.pullup = true
        },
        //供货入库列表
        supplyorderlist(data,flag){
            supplyorderlistApi(data).then(res => {
                if(res.code == 0){
                    if(flag){
                        this.dataList = res.Data.list
                    }else{
                        this.dataList = this.dataList.concat(res.Data.list);
                    }
                    this.totalCount = res.Data.totalCount
                    if(this.dataList.length > 0){
                        if(this.dataList.length >= this.totalCount){
                            this.pullup = false
                        }
                    }else{
                        this.pulldown = false
                        this.pullup = false
                    }
                }
            })
        },
        //编译状态
        orderStatus(type,list){
            let name = ''
            this[list].forEach(statu => {
                if(statu.type == type){
                    name = statu.name
                }
            })
            return name
        },
        //去到详情
        toDetail(orderid,wmsOrderStatus){
            this.$router.push({name:'suppliedDetail',query:{orderid,type:wmsOrderStatus}})
        },
        //去入库页面
        toPickUp(orderid){
            //this.$router.push({name:'suppliedPickUp',query:{orderid}})
            this.$router.push({name:'suppliedPartStockIn',query:{orderId:orderid}})
        },
        //去上架页面
        toshelves(paramId){
            //this.$router.push({name:'suppliedShelves',query:{paramId,typeId:1}})
            this.$router.push({path: '/warehousing/shelveList', query: {getorderlistforsupplyorder:1,supplyorderid:paramId}})
           
        }
    },
    components: {
        saomiaoHeader
    },
};
</script>

<style scoped lang="less">
.bscroll-wrapper{
    height: calc(100vh - 230px);
}
.supplied-list{
    .commodity-tab{
        /deep/ .van-tabs__content{
            position: relative;
            overflow: hidden;
        }
    }
    /deep/ .van-tabs--card{
        padding: 0 30px;

        .van-tabs__wrap{
            margin:35px 0 20px;
        }
        .van-tabs__nav--card{
            margin:0;
        }
        .van-tabs__nav{
            .van-tab {
                &:nth-child(1){
                    flex-basis:15% !important; 
                }
                &:nth-child(2){
                    flex-basis:28% !important; 
                }
                &:nth-child(3){
                    flex-basis:28% !important; 
                }
                &:nth-child(4){
                    flex-basis:28% !important; 
                }
                &:nth-child(5){
                    flex-basis:28% !important; 
                }
            }
        }
    }
    .order{
        background-color: #fff;
        font-size: 24px;
        overflow: hidden;
        border-bottom: 1px solid #F2F3F5;
        margin-bottom: 20px;
        .order-header{
            line-height: 40px;
            border-bottom: 1px solid #F2F3F5;
            padding:20px 30px;
            overflow: hidden;
        }
        .order-con{
            padding: 30px 30px 19px;
            border-bottom: 1px solid #F2F3F5;
            overflow: hidden;
            p{
                font-size: 22px;
                color: #333;
                line-height: 40px;
            }
        }
        .order-footer{
            overflow: hidden;
            padding: 30px 30px 19px;
            .btn{
                height:48px;
                border:2px solid #666666;
                border-radius:6px;
                line-height: 48px;
                text-align: center;
                margin-left:20px;
                padding: 0 20px;
            }
        }
    }
}
</style>
