<template>
<!-- 调拨详情 -->
    <div class="supplied-detail">
        <nosaomiao-header :title="detailStatus"></nosaomiao-header>
        <div class="spqd">
            <div class="spqd-header">Order Info</div>
            <div class="order-time" v-if="$route.query.status == 0">
                <div class="time-item">
                    <span class="c-333">Type</span>
                    <div class="fl-right fs-22 c-666">{{orderStatus(detailData.typeValue,'typeStatus')}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">Out</span>
                    <div class="fl-right fs-22 c-666">{{detailData.outWarehouseName}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">In</span>
                    <div class="fl-right fs-22 c-666">{{detailData.inWarehouseName}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">Source</span>
                    <div class="fl-right fs-22 c-666">{{orderStatus(detailData.transferSourceType,'transferSource')}}</div>
                </div>
                <div class="time-item" v-if="detailData.transferSourceType != 5">
                    <span class="c-333">Supply No.</span>
                    <div class="fl-right fs-22 c-666">{{detailData.rlaOrderSn}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">Qty of Ex-warehousing</span>
                    <div class="fl-right fs-22 c-666">{{detailData.totalNum}}</div>
                </div>
                <div class="time-item" v-if="typeSatus != 0">
                    <span class="c-333">Location</span>
                    <div class="fl-right fs-22 c-666">
                        <div v-for="(detail,index) in detailData.regionList" :key="index">{{detail.regionName}}&nbsp;&nbsp;&nbsp;{{detail.totalNum}}</div>
                    </div>
                    
                </div>
            </div>
            <div class="order-time" v-else>
                <div class="time-item">
                    <span class="c-333">Type</span>
                    <div class="fl-right fs-22 c-666">{{orderStatus(detailData.typeValue,'typeStatus')}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">In</span>
                    <div class="fl-right fs-22 c-666">{{detailData.inWarehouseName}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">Ex-warehouse No.</span>
                    <div class="fl-right fs-22 c-666">{{detailData.rlaOrderSn}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">Qty of Ex-warehousing</span>
                    <div class="fl-right fs-22 c-666">{{detailData.outTotal}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">Qty of Warehousing</span>
                    <div class="fl-right fs-22 c-666">{{detailData.totalNum}}</div>
                </div>
            </div>
        </div>
        <div class="spqd">
            <div class="spqd-header">Product List</div>
            <div class="spqd-list" v-for="(product,index) in detailData.productList" :key="index">
                <img :src="$webUrl+product.skuImg" class="shangpin-img fl-left">
                <div class="fl-left good-name">
                    <p class="p1 clamp-2 c-333">{{product.skuName}}</p>
                    <p class="p2 c-666">TSIN:{{product.tsinCode}}</p>
                    <p class="p3 c-666">
                        <span>{{product.skuValuesTitleEng}}</span>
                        <span class="fl-right">x{{product.detailNum}}</span>
                    </p>
                    <p class="p2 c-666">Store-in Batch No.:{{product.batchNo}}</p>
                    <p class="p2 c-666">FNSKU：{{product.fnskuCode}}</p>
                    <p class="p2 c-666">Seller's SKU：{{product.skuCode}}</p>
                </div>
            </div>
            <div class="spqd-footer">
                <span>Total:</span>
                <span>{{detailData.totalProNum}}</span>
            </div>
        </div>
        <div class="order-time">
            <div class="time-item" >
                <span class="c-333">Creator</span>
                <div class="fl-right fs-22 c-666">{{detailData.addUserNo}}</div>
            </div>
            <div class="time-item">
                <span class="c-333">Date of Creation</span>
                <div class="fl-right fs-22 c-666">{{detailData.addTimeEng}}</div>
            </div>
            <div v-if="$route.query.status == 0">
                <div class="time-item" v-if='typeSatus >= 1'>
                    <span class="c-333">Date of Remove</span>
                    <div class="fl-right fs-22 c-666">{{detailData.finishTimeEng}}</div>
                </div>
                <div class="time-item" v-if='typeSatus == 2'>
                    <span class="c-333">Date of Ex-warehousing</span>
                    <div class="fl-right fs-22 c-666">{{detailData.stockOutTimeEng}}</div>
                </div>
            </div>
            <div v-else>
                <div class="time-item" v-if='typeSatus >= 1'>
                    <span class="c-333">Date of Warehousing</span>
                    <div class="fl-right fs-22 c-666">{{detailData.stockOutTimeEng}}</div>
                </div>
                <div class="time-item" v-if='typeSatus == 2'>
                    <span class="c-333">Date of Shelving</span>
                    <div class="fl-right fs-22 c-666">{{detailData.finishTimeEng}}</div>
                </div>
            </div>
        </div>
        <div class="place"></div>
    </div>
</template>

<script>
import nosaomiaoHeader from '@/multiplexing/nosaomiaoHeader.vue'
import {transferouttockdowmprodetailApi,transferinstockdowmprodetailApi} from '@/api/warehousing/allocation/index.js'
export default {
    props: {

    },
    data() {
        return {
            statusList:[
                {name:'Not removed',type:0},
                {name:'Not ex-warehoused',type:1},
                {name:'Warehoused',type:2},
            ],
            typeStatus:[
                {name:'Supply Warehousing Order',type:1},
                {name:'Transfer Warehousing Order',type:2},
                {name:'Sales Return Warehousing Order',type:3},
                {name:'Purchasing Return Ex-warehousing Order',type:4},
                {name:'Sales Ex-warehousing Order',type:5},
                {name:'Transfer Ex-warehousing Order',type:6}
            ],
            transferSource:[
                {name:'Supply Warehousing Order',type:1},
                {name:'Transfer Warehousing Order',type:2},
                {name:'Sales Return Warehousing Order',type:3},
                {name:'Supply Order',type:4},
                {name:'Product、Batch',type:5},
            ],
            detailData:{},
            typeSatus:0
        };
    },
    computed: {
        detailStatus(){
            return this.orderStatus(this.$route.query.type,'statusList') + 'detail'
        }
    },
    created() {

    },
    mounted() {
        this.typeSatus = this.$route.query.type
        if(this.$route.query.status == 0){
            this.transferouttockdowmprodetail(this.$route.query.orderid)
            this.statusList = [{name:'Not removed',type:0},{name:'Not ex-warehoused',type:1},{name:'Warehoused',type:2}]
        }else{
            this.transferinstockdowmprodetail(this.$route.query.orderid)
            this.statusList = [{name:'Not Stored',type:0},{name:'Not added',type:1},{name:'Warehoused',type:2}]
        }
    },
    watch: {

    },
    methods: {
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
        //出库详情
        transferouttockdowmprodetail(orderId){
            transferouttockdowmprodetailApi({orderId}).then(res => {
                if(res.code == 0){
                    this.detailData = res.Data
                }
            })
        },
        //入库详情
        transferinstockdowmprodetail(orderId){
            transferinstockdowmprodetailApi({orderId}).then(res => {
                if(res.code == 0){
                    this.detailData = res.Data
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
.supplied-detail{
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
            }
        }
        .spqd-footer{
            padding: 0 30px;
            height: 88px;
            line-height: 88px;
            text-align: right;
            span:nth-child(2){
                font-size: 30px;
                margin-left:21px;
            }
        }
    }
    .order-time{
        background-color: #fff;
        .time-item{
            line-height: 88px;
            font-size: 26px;
            border-bottom: 1px solid #F2F3F5;
            padding: 0 30px;
            overflow: hidden;
        }
    }
}
</style>
