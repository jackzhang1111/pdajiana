<template>
<!-- 揽件详情 -->
    <div class="package-pieces">
        <nosaomiao-header title="Pack Products"></nosaomiao-header>
        <div class="order-con">
            <div class="order-no">
                <p>Tracking No: {{detailData.expressNo}}</p>
                <p>Associated No: {{detailData.saleOrderSn}}</p>
            </div>
            <div class="spqd">
                <div class="spqd-header">Product List</div>
                <div class="spqd-list" v-for="(detail,index) in detailData.detailList" :key="index">
                    <img :src="$webUrl+detail.skuImg" class="shangpin-img fl-left">
                    <div class="fl-left good-name">
                        <p class="p1 clamp-2 c-333">{{detail.supplyName}}</p>
                        <p class="p2 c-666">TSIN：{{detail.tsinCode}}</p>
                        <p class="p3 c-666">
                            <span>{{detail.skuValuesTitle}}</span>
                            <span class="fl-right">x{{detail.detailNum}}</span>
                        </p>
                    </div>
                </div>
                <div class="spqd-footer">
                    <span>Total:</span> 
                    <span>{{detailData.totalNum}}Pcs</span> 
                    <span class="c-orange">{{jn}}{{detailData.orderAmountWebsite}}</span>
                </div>
            </div>
        </div>
        
        <div class="qrlj-btn" @click="pieces" v-if="detailData.canPickup != 0">Confirm the Order</div>
        <div class="btn-place"></div>
    </div>
</template>

<script>
import nosaomiaoHeader from '@/multiplexing/nosaomiaoHeader.vue'
import { Dialog,Toast} from 'vant'
import {pickuplogisticsorderApi,logisticsorderinfoApi} from '@/api/logistics/delivery/index.js'
export default {
    props: {

    },
    data() {
        return {
            detailData:{}
        };
    },
    computed: {

    },
    created() {

    },
    mounted() {
        this.logisticsorderinfo(this.$route.query.orderid)
    },
    watch: {

    },
    methods: {
        //揽件按钮
        pieces(){
            Dialog.confirm({
                title: 'Tips',
                message: 'Are you sure to transit the order?',
                confirmButtonText:'Yes',
                cancelButtonText:'No'
                }).then(() => {
                    this.pickuplogisticsorder(this.$route.query.orderid)
                }).catch(() => {});
        },
        //配送单详情
        logisticsorderinfo(id){
            let get_type = this.$route.query.type
            logisticsorderinfoApi({order_id:id,get_type}).then(res => {
                if(res.code == 0){
                    this.detailData = res.Data
                }else if(res.code == 1){
                    Toast(res.orderSn+'isn’t your delivery order, please contact customer service.')
                    setTimeout(()=>{this.$router.go(-1)},1000)
                }else if(res.code == 2){
                    Toast('cannot be found, please scan a new code.')
                    setTimeout(()=>{this.$router.go(-1)},1000)
                }else if(res.code == 3){
                    Toast(res.orderSn+'did not take the order. Please take the order first.')
                    setTimeout(()=>{this.$router.go(-1)},1000)
                }
            })
        },
        //揽件接口
        pickuplogisticsorder(orderId){
            pickuplogisticsorderApi({orderId}).then(res => {
                if(res.code == 0){
                    Toast('Successfully taken')
                    this.logisticsorderinfo(this.$route.query.orderid)
                }else if(res.code == 1){
                    Toast('Parameter “requestModel” cannot be empty.')
                }else if(res.code == 2){
                    Toast('The ID of tracking order must be larger than 0')
                }else if(res.code == 21){
                    Toast('Cannot find the tracking order')
                }else if(res.code == 22){
                    Toast('The tracking order isn’t Pending Taking and cannot be taken.')
                }else if(res.code == 23){
                    Toast('The tracking order is delivered and cannot be taken again.')
                }else if(res.code == 24){
                    Toast('The tracking order isn’t ex-warehoused and cannot be taken.')
                }else if(res.code == 31){
                    Toast('The tracking order isn’t belong to the courier and cannot be operated.')
                }
            })
        }
    },
    components: {
        nosaomiaoHeader
    },
};
</script>

<style scoped lang="less">
.package-pieces{
    position: relative;
    min-height: 100vh;
    .order-con{
        padding: 20px 30px 0;
        .order-no{
            line-height: 30px;
            padding: 30px 0;
            font-size: 28px;
            background-color: #fff;
            margin-bottom: 20px;
            p{
                padding-left: 30px;
            }
        }
        .spqd{
            background-color: #fff;
            overflow: hidden;
            margin-bottom: 50px;
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
                margin-bottom: 30px;
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
                }
            }
            .spqd-footer{
                padding: 0 30px;
                height: 88px;
                line-height: 88px;
                text-align: right;
                span{
                    font-size: 30px;
                    margin-left:21px;
                }
            }
        }
        
    }
    .qrlj-btn{
        position: absolute;
        width: 100%;
        height: 110px;
        background-color: #333;
        line-height: 110px;
        font-size:40px;
        text-align: center;
        color: #fff;
        bottom: 0;
    }
    .btn-place{
        height: 110px;;
    }
}
</style>
