<template>
    <div class="distribution-list">
        <saomiao-header @search="search"></saomiao-header>
        <div class="commodity-tab">
            <van-tabs type="card" color="#666666" title-active-color="#333333" @change="onClick">
                <van-tab :title="tab.name" v-for='(tab,index) in tabList' :key="index">
                    <scroll class="bscroll-wrapper" ref="wrapper" :data="recordGroup" :pulldown="pulldown" :pullup="pullup" @pulldown="_pulldown" @pullup="_pullup">
                        <div class="bscroll-con">
                            <div class="order" v-for="(data,index) in dataList" :key="index" >
                                <div class="order-header">
                                    <span>Tracking No:{{data.expressNo}}</span>
                                    <div class="fl-right">
                                        <span>{{orderStatus(data.orderCourierStatus,'statusList')}}</span>
                                    </div>
                                </div>
                                <div class="order-con" @click="toDetail(data.orderId)">
                                    <img :src="$webUrl+data.headImg" class="touxiang fl-left">
                                    <div class="fl-left xinxi">
                                        <div class="p1">
                                            <span>{{data.consignee}}</span>
                                            <span>{{data.mobile}}</span>
                                        </div>
                                        <div class="p2">
                                            <span>{{data.addressDetail}}</span>
                                        </div>
                                    </div>
                                    
                                    <div class="btn fl-right" @click.stop="receipt(data.orderId)" v-if="data.orderCourierStatus==0">Confirm</div>
                                    <div class="btn fl-right" @click.stop="pieces(data.orderId)" v-if="data.canPickup == 1">Pack Products</div>
                                    <div class="sqtk fl-right" v-if="data.applyRefund == 1">Refund</div>
                                </div>
                                <div class="order-footer">
                                    <div class="footer-item">
                                        <img src="@/assets/img/phone@2x.png">
                                        <span>Dial</span> 
                                    </div>
                                    <div class="footer-item">
                                        <img src="@/assets/img/navigation@2x.png">
                                        <span>Navigation</span> 
                                    </div>
                                    <div class="footer-item">
                                        <img src="@/assets/img/abnormal@2x.png">
                                        <span>Exception</span> 
                                    </div>
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
import { Dialog } from 'vant';
import {getlogisticsorderApi,receivelogisticsorderApi} from '@/api/logistics/delivery/index.js'
export default {
    props: {

    },
    data() {
        return {
            tabList:[
                {name:'All',value:0},
                {name:'New Order',value:1},
                {name:'Not Taken',value:2},
                {name:'In Transit',value:3},
                {name:'Received',value:4},
                {name:'Refused',value:5},
            ],
            dataList:[],
            recordGroup:[],
            pulldown:true,
            pullup:true,
            formData:{
                expressNo:'',
                orderCourierStatus:null,
                page:1,
                limit:10
            },
            guanmengou:true,
            totalCount:0,
            statusList:[
                {name:'Pending Confirmation',type:0},
                {name:'Not Taken',type:1},
                {name:'In Transit',type:2},
                {name:'Received',type:3},
                {name:'Refused',type:4},
            ]
        };
    },
    computed: {

    },
    created() {

    },
    mounted() {
        this.refreshOrder()
    },
    watch: {

    },
    methods: {
        toDetail(orderid){
            this.$router.push({name:'distributionDetail',query:{orderid,type:1}})
        },
        //接单
        receipt(id){
           Dialog.confirm({
                title: 'Tips',
                message: 'Are you sure to confirm the order?',
                confirmButtonText:'Yes',
                cancelButtonText:'No'
                }).then(() => {
                    // on confirm
                    this.receivelogisticsorder(id)
                }).catch(() => {});
        },
        //揽件
        pieces(orderid){
            this.$router.push({name:'packagePieces',query:{orderid,type:1}})
        },
        //配送列表
        getlogisticsorder(data,flag){
            getlogisticsorderApi(data).then(res => {
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
                this.getlogisticsorder(this.formData,false)
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
            this.getlogisticsorder(this.formData,true)
            this.pullup = true
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
        //切换tab
        onClick(index) {
            if(index == 0){
                this.formData.orderCourierStatus = null
            }else{
                this.formData.orderCourierStatus = index - 1
            }  
            this.refreshOrder()
        },
        search(value){
            this.$router.push({name:'searchDist',query:{expressNo:value}})
        },
        //接单
        receivelogisticsorder(id){
            receivelogisticsorderApi({orderId:id}).then(res => {
                if(res.code == 0){
                    this.refreshOrder()
                }
            })
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
.distribution-list{
    
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
                
                &:nth-child(2){
                    flex-basis:25% !important; 
                }
                &:nth-child(3){
                    flex-basis:25% !important; 
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
            border-bottom: 1px solid #F2F3F5;
            padding:  30px;
            overflow: hidden;
        }
        .order-con{
            padding: 30px 30px 19px;
            border-bottom: 1px solid #F2F3F5;
            overflow: hidden;
            .touxiang{
                width: 100px;
                height: 97px;
                margin-right:30px;
            }
            .xinxi{
                width: 487px;
                .p1{
                    font-size: 26px;
                    color: #666;
                }
                .p2{
                    color: #999;
                    margin:30px 0 60px;
                }
            }
            .btn{
                height:48px;
                border:1px solid #666666;
                border-radius:6px;
                line-height: 48px;
                text-align: center;
                margin-left:20px;
                padding: 0 20px;
            }
            .sqtk{
                height:48px;
                line-height: 48px;
                text-align: right;
                
            }
        }
        .order-footer{
            display: flex;
            justify-content:space-between;
            height: 88px;
            line-height: 88px;
            .footer-item{
                width: 229px;
                text-align: center;
                img{
                    width: 32px;
                    height: 32px;
                    vertical-align: middle;
                    margin-right:22px;
                }
            }
        }
    }
    .commodity-tab{
        /deep/ .van-tabs__content{
            position: relative;
            overflow: hidden;
        }
    }
}
</style>
