<template>
    <div class="supplied-detail">
        <nosaomiao-header :title="detailStatus"></nosaomiao-header>
        <div class="spqd">
            <div class="spqd-header">Order Info</div>
            <div class="order-time">
                <div class="time-item">
                    <span class="c-333">Ex-warehouse No</span>
                    <div class="fl-right fs-22 c-666">{{detailData.shelfDownorderSn}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">Sale No</span>
                    <div class="fl-right fs-22 c-666">{{detailData.saleOrderSn}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">Supplier</span>
                    <div class="fl-right fs-22 c-666">{{detailData.businessName}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">Qty Sold</span>
                    <div class="fl-right fs-22 c-666">{{detailData.saleTotalNum}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">Warehouse</span>
                    <div class="fl-right fs-22 c-666">{{detailData.warehouseName}}</div>
                </div>
                <div class="time-item">
                    <span class="c-333">Qty Ex-warehoused</span>
                    <div class="fl-right fs-22 c-666">{{detailData.totalNum}}</div>
                </div>
                <div class="time-item" v-if="typeSatus == 2 || typeSatus == 1">
                    <span class="c-333">Location</span>
                    <div class="fl-right fs-22 c-666">
                        <div v-for="(warehouse,index) in detailData.warehouselist" :key="index">
                            <span>{{warehouse.regionName}}</span>&nbsp;&nbsp;&nbsp;
                            <span>{{warehouse.downItemNum}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="spqd">
            <div class="spqd-header">Product List</div>
            <div class="spqd-list" v-for="(product,index) in detailData.productList" :key="index">
                <img :src="$webUrl+product.skuImg" class="shangpin-img fl-left">
                <div class="fl-left good-name">
                    <p class="p1 clamp-2 c-333">{{product.skuName}}</p>
                    <p class="p2 c-666">Store-in Batch No：{{product.batchNo}}</p>
                    <p class="p2 c-666">TSIN：{{product.tsinCode}}</p>
                    <p class="p3 c-666">
                        <span>{{product.skuValuesTitle}}</span>
                        <span class="fl-right">x{{product.detailNum}}</span>
                    </p>
                </div>
            </div>
            <div class="spqd-footer">
                <span>Total:</span>
                <span>{{detailData.totalProNum}}</span>
            </div>
        </div>
        <div class="order-time" v-if="typeSatus != 0">
            <div class="time-item">
                <span class="c-333">Date of Removing</span>
                <div class="fl-right fs-22 c-666">{{detailData.finishTime}}</div>
            </div>
            <div class="time-item" v-if="typeSatus != 1">
                
                <span class="c-333">Date of Ex-warehousing</span>
                <div class="fl-right fs-22 c-666">{{detailData.stockOutTime}}</div>
            </div>
        </div>
        <div class="place"></div>
    </div>
</template>

<script>
import nosaomiaoHeader from '@/multiplexing/nosaomiaoHeader.vue'
import {saleoutstockdowmdetailApi} from '@/api/warehousing/sold/index.js'
export default {
    props: {

    },
    data() {
        return {
            statusList:[
                {name:'Not packed',type:0},
                {name:'Not ex-warehoused',type:1},
                {name:'Warehoused',type:2},
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
        this.saleoutstockdowmdetail(this.$route.query.orderid)
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
        //供货详情接口
        saleoutstockdowmdetail(orderId){
            saleoutstockdowmdetailApi({orderId}).then(res => {
                if(res.code == 0){
                    this.detailData = res.Data
                }
            })
        },
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
