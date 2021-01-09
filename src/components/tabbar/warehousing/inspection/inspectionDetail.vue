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
                        <!-- 规格属性 -->
                        <p class="p2 c-666" v-show="detail.skuValuesTitleEng">Specifications：{{detail.skuValuesTitleEng}}</p>
                        <!-- 出库时间 -->
                        <p class="p2 c-666" v-show="detail.stockOutTime">Delivery time:{{detail.stockOutTime}}</p>
                        <p class="p2 c-666">reporting time: {{detail.reportTime}}</p>
                        <p class="p2 c-666" style="color:red">
                            <span v-show="detail.sysNum">System inventory:{{detail.sysNum}};</span>
                            <span v-show="detail.reportNum">Report inventory:{{detail.reportNum}};</span>
                            <span v-show="detail.differNum">Differential inventory:{{detail.differNum}}</span>
                        </p>
                        <span class="status-kuang">{{orderStatus(detail.outStocktype,'statusList')}}</span>
                                            
                    </div>
                </div>
            </div>
        </div>
        <div class="order-time">
            <div class="spqd-header">inventory information</div>
            <div v-if="positionList.length > 0">
                <div class="time-item" v-for="(position,index) in positionList" :key="index">
                    <div class="c-333 time-title">position {{index+1}}:</div>
                    <div class="fs-22 c-666">
                        <div>{{position.regionName}}</div>
                        <div>System available inventory:{{position.canUseNum}}; reported inventory:{{position.reportUseNum}} </div>
                    </div>
                </div>
                <div class="error-tips" :style="{color:(detail.remarksState == 2 ? '#333':'#D23535')}">
                    <span>Total system inventory: {{detail.sysNum}};</span>
                    <span>reported total inventory: {{detail.reportNum}};</span>
                    <span>variance inventory: {{detail.differNum}}</span>
                </div>
            </div>
            <!-- 当前系统可售库存为0，无法显示具体货位信息 -->
            <div class="time-item" v-else>The current system available inventory is 0, unable to display specific location information</div>
        </div>
        <div class="order-time m-tb-20">
            <div class="footer-tips">
                <p>Reported by: {{detail.reportUsername}}</p>
                <p>Reporting time: {{detail.reportTime}}</p>
            </div>
            <div class="footer-tips" v-if="detail.remarksState == 3">
                <p>Handler:{{detail.handleUsername}}</p>
                <p class="flex" style="line-height:14px">
                    <span style="width:200px">Processing Instructions:</span>
                    <span style="width:200px">{{detail.handleRemarks}}</span>
                </p>
                <p>Processing Time:{{detail.handleTime}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import nosaomiaoHeader from '@/multiplexing/nosaomiaoHeader.vue'
import {queryreportObjectApi} from '@/api/warehousing/inspection/index.js'
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
        this.queryreportObject({reportId:Number(this.$route.query.reportId)})
        
    },
    watch: {

    },
    methods: {
        //售后详情
        queryreportObject(data){
            queryreportObjectApi(data).then(res => {
                if(res.code == 0){
                    this.detail = res.Data
                    this.positionList = res.Data.detailList
                    console.log(this.detail.remarksState);
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
        .error-tips{
            color: #D23535;
            font-size: 22px;
            padding: 18px 30px;
            line-height: 30px;
        }
        .footer-tips{
            padding: 26px 30px;
            font-size: 26px;
            color: #666;
            line-height: 70px;
        }
    }
    .m-tb-20{
        margin:20px 30px 80px;
    }
}

.fs-22{
    font-size: 26px;
    width: 450px;
}
</style>
