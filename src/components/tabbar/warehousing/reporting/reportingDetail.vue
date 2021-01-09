<template>
    <div class="distribution-detail">
        <nosaomiao-header title="product detail"></nosaomiao-header>
        <div class="detail-con">
            <div class="spqd">
                <div class="spqd-header">Product Info</div>
                <div class="spqd-list">
                    <img :src="$webUrl+detail.skuImg" class="shangpin-img fl-left">
                    <div class="fl-left good-name">
                        <p class="p1 clamp-2 c-333">{{detail.skuName}}</p>
                        <p class="p2 c-666">TSIN：{{detail.tsinCode}}</p>
                        <p class="p2 c-666">FNSKU：{{detail.fnskuCode}}</p>
                        <p class="p2 c-666" v-show="detail.skuValuesTitleEng">Specifications：{{detail.skuValuesTitleEng}}</p>
                        <p class="p2 c-666" v-show="detail.stockOutTime">Delivery time:{{detail.stockOutTime}}</p>
                        <span class="status-kuang">{{orderStatus(detail.outStockType,'statusList')}}</span>
                                            
                    </div>
                </div>
            </div>
        </div>
        <div class="order-time">
            
                <div class="spqd-header">inventory information</div>
                <div v-if="positionList.length > 0">
                    <div class="time-item" v-for="(position,index) in positionList" :key="index">
                        <div class="c-333 time-title">position {{index+1}}:</div>
                        <div class="fs-22 c-666">{{position.regionName}}</div>
                    </div>
                </div>
                <!-- 当前系统可售库存为0，无法显示具体货位信息 -->
                <div class="time-item" v-else>The current system available inventory is 0, unable to display specific location information</div>
            
            
        </div>
    </div>
</template>

<script>
import nosaomiaoHeader from '@/multiplexing/nosaomiaoHeader.vue'
import {queryRegionNameListApi} from '@/api/warehousing/reporting/index.js'
import {Toast} from 'vant'
export default {
    props: {

    },
    data() {
        return {
            positionList:[],
            detail:{},
            statusList:[
                {name:'Sales Delivery',type:1},
                {name:'Goods returned from warehouse',type:2},
            ],
        };
    },
    computed: {

    },
    created() {

    },
    mounted() {
        this.queryRegionNameList({skuId:Number(this.$route.query.skuId),outWarehouseId:Number(this.$route.query.outWarehouseId)})
        this.detail = JSON.parse(localStorage.reportingData)
    },
    watch: {

    },
    methods: {
        //售后详情
        queryRegionNameList(data){
            queryRegionNameListApi(data).then(res => {
                if(res.code == 0){
                    this.positionList = res.Data
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
    },
    components: {
        nosaomiaoHeader,
    },
};
</script>

<style scoped lang="less">
.distribution-detail{
    .detail-con{
        padding: 0 30px;
    }
    .spqd{
        background-color: #fff;
        overflow: hidden;
        margin-bottom: 20px;
        .spqd-header{
            padding: 0 30px;
            height: 88px;
            line-height: 88px;
            font-size: 32px;
        }
        .spqd-list{
            overflow: hidden;
            padding: 0 30px 27px ;
            border-bottom: 1px solid #F2F3F5;
            &:nth-last-child(2){
                margin:0;
            }
            .shangpin-img{
                width: 140px;
                height:140px;
                margin-right:20px;
            }
            .good-name{
                width: 464px;
                .p1{
                    font-size:24px;
                    line-height:36px;
                }
                .p2{
                    margin:18px 0 15px;
                    font-size:22px;
                }
                .p3{
                    margin:18px 0 15px;
                    font-size:24px;
                }
                .status-kuang{  
                    display: inline-block;
                    margin-top:10px;
                    padding: 10px;
                    border: 1px solid #D2A835;
                    color: #D2A835;
                }
            }
        }
    }
    .order-time{
        background-color: #fff;
        margin: 0 30px;
        .spqd-header{
            padding: 0 30px;
            height: 88px;
            line-height: 88px;
            font-size: 32px;
        }
        .time-item{
            
            border-bottom: 1px solid #F2F3F5;
            padding: 30px;
            overflow: hidden;
            line-height: 40px;
            display: flex;
            // flex-wrap: wrap;
            .time-title{
                width: 150px;
                font-size: 26px;
            }
        }
    }
}

.fs-22{
    font-size: 26px;
    width: 450px;
}
</style>
