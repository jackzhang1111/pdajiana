<template>
<!-- 出库 -->
    <div class="pick-up">
        <saomiao-header @search="search"></saomiao-header>
        <div class="pick-up-order">Cancellation No.：{{detailData.shelfDownorderSn}}</div>
        <div class="order-detail">
            <div class="detail-header">
                <van-icon name="play" class="play-left" :color="playLeft ? '#DCDCDC':'#333'" @click="cliPlayLeft"/>
                <div class="num-input">
                    <input type="number" v-model="current" @change="changeInput">
                </div>
                <span class="ma-35 header-font">/</span>
                <span class="header-font">{{listLength}}</span>
                <van-icon name="play" class="play-right" :color="playRight ? '#DCDCDC':'#333'" @click="cliPlayRight"/>
            </div>
            <div class="order-product">
                <img :src="$webUrl+currentProduct.skuImg">
                <div class="product">
                    <p>{{currentProduct.skuName}}</p>
                    <p class="guige">TSIN：{{currentProduct.tsinCode}}</p>
                    <p class="c-666">FNSKU：{{currentProduct.fnskuCode}}</p>
                    <p class="c-666">Seller's SKU：{{currentProduct.skuCode}}</p>
                </div>
            </div>
            <div class="detailed">
                <div class="detailed-item" v-for="(detailedGuige,index) in detailedGuigeList" :key="index">
                    <span class="c-999">{{detailedGuige.name}}</span>&nbsp;&nbsp;&nbsp;
                    <span class="c-666">{{detailedGuige.value}}</span>
                </div>
                <div class="tiji">
                    <div class="clearfix">
                        <span class="pl-30">Product Dimensions L*W*H(cm)</span>
                        <div class="fl-right">
                            <span class="kuang">{{currentProduct.unitLength}}</span>
                            <span>X</span>
                            <span class="kuang">{{currentProduct.unitWidth}}</span>
                            <span>X</span>
                            <span class="kuang">{{currentProduct.unitHeight}}</span>
                        </div>
                    </div>
                    <div class="total">
                        <span>Volume:</span>
                        <span class="tijitotal">{{currentProduct.unitSize}}</span>
                        <span>m³</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="btns">
            <div class="btn-qbrk" @click="allStock">Ex-warehouse</div>
        </div>
        <div class="shelves-place"></div>
    </div>
</template>

<script>
import saomiaoHeader from '@/multiplexing/saomiaoHeader.vue'
import { Dialog ,Toast } from 'vant';
import {returngoodsstockdowmprolistApi,returngoodsstockdowmApi} from '@/api/warehousing/cancellation/index.js'
export default {
    props: {

    },
    data() {
        return {
            listLength:0,
            current:1,
            detailData:{},
            currentProduct:{},
            detailedGuigeList:[
                {name:'Specifications',value:''},
                {name:'Supplier',value:''},
                {name:'Batch No.',value:''},
                {name:'Warehouse',value:''},
                {name:'FNSKU',value:''},
                {name:'Qty Canceled',value:''},
                {name:'International No.',value:''},
                {name:'Qty Removed',value:''},
                {name:'Type',value:''},
                {name:'Unit Weight(kg)',value:''},
            ],
        };
    },
    computed: {
        playLeft() {
            return  this.current == 1
        },
        playRight() {
            return  this.current == this.listLength
        }
    },
    created() {

    },
    mounted() {
        this.returngoodsstockdowmprolist(this.$route.query.orderid)
    },
    watch: {
        currentProduct:{
            handler:function(newVal){
                this.setCurrentProduct()
            }
        }
    },
    methods: {
        //搜索框 
        search(val){
            this.productArray.forEach((item,index) => {
                if(item.fnskuCode == val){
                    this.current = index+1
                    this.currentProduct = this.detailData.productList[index]
                }
            });
        },
        //上一个
        cliPlayLeft(){
            if(this.current <=1) return
            this.current--
            this.currentProduct = this.detailData.productList[this.current-1]
        },
        //下一个
        cliPlayRight(){
            if(this.current >= this.listLength) return
            this.current++
            this.currentProduct = this.detailData.productList[this.current-1]
        },
        //下架详情
        returngoodsstockdowmprolist(orderId){
            returngoodsstockdowmprolistApi({orderId}).then(res => {
                if(res.code == 0){
                    this.detailData = res.Data
                    this.productArray = res.Data.productList
                    this.productArray.forEach(ele => {
                        if(ele.typeValue == 1){
                            ele.stockIntype = 'Supply Warehousing Order'
                        }else if(ele.typeValue == 2){
                            ele.stockIntype = 'Transfer Warehousing Order'
                        }else if(ele.typeValue == 3){
                            ele.stockIntype = 'Sales Return Warehousing Order'
                        }else if(ele.typeValue == 4){
                            ele.stockIntype = 'Purchasing Return Ex-warehousing Order'
                        }else if(ele.typeValue == 5){
                            ele.stockIntype = 'Sales Ex-warehousing Order'
                        }else if(ele.typeValue == 6){
                            ele.stockIntype = 'Transfer Ex-warehousing Order'
                        }else{
                            ele.stockIntype = ''
                        }
                    })  
                    this.currentProduct = res.Data.productList[this.current-1]
                    this.listLength = res.Data.productList.length
                    this.setCurrentProduct()
                }
            })
        },
        //确认出库
        returngoodsstockdowm(data){
            returngoodsstockdowmApi(data).then(res => {
                if(res.code == 0){
                    Toast('Successful ex-warehousing')
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },1500)
                }else if(res.code == 1){
                    Toast('The ex-warehousing order is inexistent.')
                }else if(res.code == 2){
                    Toast('It was ex-warehoused. No more operation.')
                }else if(res.code == 3){
                    Toast('IIt was applied for ex-warehousing. No more operation')
                }else if(res.code == 5){
                    Toast('Ex-warehoused! No more operation.')
                }
            })
        },
        //当前商品基本属性
        setCurrentProduct(){
            this.detailedGuigeList[0].value = this.currentProduct.skuValuesTitleEng
            this.detailedGuigeList[1].value = this.currentProduct.businessName
            this.detailedGuigeList[2].value = this.currentProduct.batchNo
            this.detailedGuigeList[3].value = this.currentProduct.warehouseName
            this.detailedGuigeList[4].value = this.currentProduct.fnskuCode
            this.detailedGuigeList[5].value = this.currentProduct.detailNum
            this.detailedGuigeList[6].value = this.currentProduct.intCode
            this.detailedGuigeList[7].value = this.currentProduct.downDetailNum
            this.detailedGuigeList[8].value = this.currentProduct.stockIntype
            this.detailedGuigeList[9].value = this.currentProduct.unitWeight
        },
        //全部出库
        allStock(){
            Dialog.confirm({
                title: 'Tips',
                message: 'Are you sure to ex-warehouse?',
                confirmButtonText:'Yes',
                cancelButtonText:'No'
            }).then(() => {
                let obj = {
                    stockOutOrderId:this.detailData.stockOutOrderId,
                    stockOutOrderType:1
                }
                this.returngoodsstockdowm(obj)
            }).catch(() => {});
        },
        //更改页数
        changeInput(){
            this.current = Math.ceil(this.current)
            if(this.current > this.listLength){
                this.current = this.listLength
            }else if(this.current < 1){
                this.current = 1
            }
            this.currentProduct = this.detailData.productList[this.current-1]
        }
    },
    components: {
        saomiaoHeader
    },
};
</script>

<style scoped lang="less">
.pick-up{
    .pick-up-order{
        line-height: 40px;
        padding: 20px 30px;
        font-size: 26px;
        color: #333;
        background-color: #fff;
        margin-bottom: 20px;
    }
    .order-detail{
        background-color: #fff;
        .detail-header{
            height: 88px;
            line-height: 88px;
            text-align: center;
            border-bottom: 1px solid #F2F3F5;
            .play-left{
                transform:rotate(180deg);
                margin-right:30px;
            }
            .play-right{
                margin-left:30px;
            }
            .num-input{
                width: 120px;
                height: 60px;
                display: inline-block;
                border: 1px solid #DCDCDC;
                text-align: center;
                line-height: 60px;
                input{
                    width: 85%;
                    height: 70%;
                    border:0;
                    text-align: center;
                    font-size: 34px;
                    margin-top:5%
                }
            }
            .ma-35{
                margin: 0 35px;
            }
            .header-font{
                font-size: 34px;
                color: #999;
            }
        }
        .order-product{
            padding: 30px 40px 50px 30px;
            img{
                width: 140px;
                height: 140px;
                vertical-align: top;
                margin-right:21px;
            }
            .product{
                display: inline-block;
                width: 500px;
                font-size:26px;
                line-height:39px;
                color: #333333;
                .guige{
                    margin-top:29px;
                    font-size: 22px;
                    color: #666;
                }
            }
        }
        .detailed{
            font-size: 18px;
            display: flex;
            flex-wrap: wrap;
            .detailed-item{
                width: 46%;
                padding: 20px 0px 20px 30px;
                border-bottom: 1px solid #999;
            }
            .tiji{
                width: 100%;
                padding: 20px 30px 20px 0;
                overflow: hidden;
                color: #999;
                border-bottom: 1px solid #999;
                &:nth-last-child(1){
                    border: 0;
                }
                .kuang{
                    display: inline-block;
                    width: 80px;
                    height: 40px;
                    line-height: 40px;
                    // border: 2px solid #dcdcdc;
                    border-radius:6px;
                    vertical-align: middle;
                    text-align: center;
                }
                .total{
                    width: 100%;
                    text-align: right;
                    margin-top: 25px;
                    .tijitotal{
                        font-size: 22px;
                        color: #333;
                    }
                }
            }
        }
        
    }
    .btns{
        width: 100vw;
        height:110px;
        line-height: 110px;
        text-align: center;
        font-size: 40px;
        position: absolute;
        bottom: 0;
        color: #fff;
        display: flex;
    }
    .shelves-place{
        height: 110px;
    }
    .btn-qbrk{
        width: 100vw;
        background-color: #333;
    }
}
.fs-18{
    font-size: 18px
}
.pl-30{
    padding-left:30px;
}
</style>
