<template>
<!-- 售后入库 -->
    <div class="pick-up">
        <div v-show="showPickUp">
            <div v-show="!batchNoListStatus">
                <saomiao-header @search="search"></saomiao-header>
                <div class="pick-up-order">
                   <span>Return No.：{{detailData.orderSn}}</span>
                   <span class="fl-right">{{listLength}}</span>
                </div>
                <div class="order-detail" v-if="currentArray.length > 0">
                    <div class="detail-header">
                        <van-icon name="play" class="play-left" :color="playLeft ? '#DCDCDC':'#333'" @click="cliPlayLeft"/>
                        <div class="num-input">
                            <input type="number" v-model="current" @change="changeInput">
                        </div>
                        <span class="ma-35 header-font">/</span>
                        <span class="header-font">{{currentArray.length}}</span>
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
                        <div class="detailed-item" v-for="(detailedGuige,index) in detailedGuigeList" :key="index" @click="replaceBatchNo(detailedGuige.name)">
                            <div class="c-999">{{detailedGuige.name}}</div>&nbsp;&nbsp;&nbsp;
                            <div class="c-666">
                                <span>{{detailedGuige.value}}</span>
                                <van-icon name="play" v-if="detailedGuige.sanjiao"/>
                            </div>
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
                    <div class="goods-shelves">
                        <div class="set-shelves">
                            <span>Batch No.</span>
                        </div>
                        <div class="shelves-item" v-for="(batch,index) in currentProduct.batchList" :key="index">
                            <div class="item-title">
                                <span class="fs-18">(Maximum Stock:{{batch.outProNum ? batch.outProNum : 0}})</span>
                            </div>
                            <div class="item-number">
                                <div>{{batch.batchNo}}</div>
                                <div class="item-input">
                                    <input type="number" v-model="batch.inProNum" @change="changNum(batch,'inProNum')">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="btns">
                    <div class="btn-smtm" @click="showSweepCode(false)">Scan the Barcode</div>
                    <div class="btn-qbrk" @click="outStock">Warehouse</div>
                </div>
                <div class="shelves-place"></div>
            </div>
        </div>

        <div v-show="batchNoListStatus">
            <batch-no-list @choiceStatus="choiceStatus" @batchDatas="batchDatas" :dataList="dataList" :typeName="typeName"></batch-no-list>
        </div>
        <div v-if="!showPickUp">
            <sweep-code @search="search" @showSweepCode="showSweepCode"></sweep-code>
        </div>
    </div>
</template>

<script>
import saomiaoHeader from '@/multiplexing/saomiaoHeader.vue'
import { Dialog ,Toast } from 'vant';
import {customerservicebackorderApi,customerservicebackorderinstockAllApi} from '@/api/warehousing/warehouAfterSales/index.js'
import batchNoList from './batchNoList.vue'
import sweepCode from '@/components/tabbar/warehousing/warehousSupplied/itemComponents/sweepCode.vue'
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
                {name:'Batch No.',value:'',sanjiao:true},
                {name:'Warehouse',value:'',sanjiao:true},
                {name:'FNSKU',value:''},
                {name:'Qty Returned',value:''},
                {name:'International No',value:''},
                {name:'Qty Warehoused',value:''},
                {name:'Type',value:''},
                {name:'Unit Weight(kg)',value:''},
            ],
            batchNoListStatus:false,
            dataList:[],
            typeName:'',
            outStockObj:{
                saleBackOrderId:'',//退货入库表ID
                sourceType:2,//来源：1.WMS/2.PDA',
                inWarehouseId:'',//入库的仓库ID
                stockInOrderId:'',//退货单ID
                outBatchList:[]
            },
            currentArray:[],
            produclist:[],
            showPickUp:true
        };
    },
    computed: {
        playLeft() {
            return  this.current == 1
        },
        playRight() {
           return  this.current == this.currentArray.length
        }
    },
    created() {

    },
    mounted() {
        this.customerservicebackorder(this.$route.query.backOrderId)
    },
    watch: {
        currentProduct:{
            handler:function(newVal){
                this.setCurrentProduct()
            }
        },
        produclist:{
            handler:function(newVal){
                this.produclist.forEach(item => {
                    let arr = []
                    if(item.display == 1){
                        this.currentArray.push(item)
                    }
                    item.outBatchList.forEach(ele => {
                        ele.checked = ele.isCheck
                        if(ele.isCheck == 1){
                            arr.push(ele)
                        }
                        item.batchList = arr
                    })
                    
                });
            }
        }
    },
    methods: {
        //搜索框 
        search(val){
            this.produclist.forEach((item,index) => {
                if(item.fnskuCode == val && item.display == 0){
                    item.display = 1
                    this.currentArray.push(item)
                    this.currentProduct = this.currentArray[this.currentArray.length-1]
                    this.current = this.currentArray.length
                }else if(item.fnskuCode == val && item.display == 1){
                    this.current = index + 1
                    this.currentProduct = this.currentArray[index]
                    this.currentProduct.inDetailNum++
                    this.setCurrentProduct()
                }
            });
        },
        //上一个
        cliPlayLeft(){
            if(this.current <=1) return
            this.current--
            this.currentProduct = this.currentArray[this.current-1]
        },
        //下一个
        cliPlayRight(){
            if(this.current >= this.currentArray.length) return
            this.current++
            this.currentProduct = this.currentArray[this.current-1]
        },
        //入库信息
        customerservicebackorder(backOrderId){
            customerservicebackorderApi({backOrderId}).then(res => {
                if(res.code == 0){
                    this.detailData = res.Data
                    this.produclist = res.Data.produclist.map(o => Object.assign({}, o));
                    setTimeout(()=>{this.currentProduct = this.currentArray[this.current-1]},0)
                    this.listLength = res.Data.produclist.length
                    this.produclist.forEach(ele => {
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
                    this.outStockObj.stockInOrderId = res.Data.stockInOrderId
                    this.outStockObj.saleBackOrderId = this.detailData.produclist[0].saleBackOrderId
                    this.outStockObj.inWarehouseId = this.detailData.produclist[0].inWarehouseId
                    if(this.detailData.produclist[0].warehouseName){
                        this.detailData.warehouselist.forEach(item => {
                            if(item.warehouseId == this.detailData.produclist[0].inWarehouseId){
                                item.checked = true
                            }
                        })
                    }
                   
                }
            })
        },
        //当前商品基本属性
        setCurrentProduct(){
            try{
                this.detailedGuigeList[0].value = this.currentProduct.skuValuesTitleEng
                this.detailedGuigeList[1].value = this.currentProduct.businessName
                this.detailedGuigeList[2].value = this.currentProduct.batchNo
                this.detailedGuigeList[3].value = this.currentProduct.warehouseName
                this.detailedGuigeList[4].value = this.currentProduct.fnskuCode
                this.detailedGuigeList[5].value = this.currentProduct.detailNum
                this.detailedGuigeList[6].value = this.currentProduct.intCode
                this.detailedGuigeList[7].value = this.currentProduct.inDetailNum
                this.detailedGuigeList[8].value = this.currentProduct.stockIntype
                this.detailedGuigeList[9].value = this.currentProduct.unitWeight
            }catch(err){console.log(err)}
            
        },
        //全部入库
        customerservicebackorderinstockAll(data){
            customerservicebackorderinstockAllApi(data).then(res => {
                if(res.code == 0){
                    this.$router.push({name:'warehouSalesUppershelf',query:{paramId:this.$route.query.backOrderId,typeId:1}})
                }else if(res.code == 1){
                    let txt = ''
                    JSON.parse(res.resdata).forEach(item => {
                        txt+=`Batch No.：${item.batchNo},Maximum Warehousing Qty：${item.maxCanStockInNum}.`
                    })
                    Toast(`The warehousing qty cannot exceed the available qty of warehousing products(by subtracting the products of created warehousing order from the sales ex-warehousing qty). ${txt}`)
                }else if(res.code == 2){
                    Toast('Warehousing qty must be equal to return qty')
                }else if(res.code == 6){
                    Toast('The warehousing order isn’t pending warehousing. It cannot be changed.')
                }else if(res.code == 7){
                    Toast('Warehoused! No more operation!')
                }else if(res.code == 8){
                    Toast('The refund order has associated warehousing order. It cannot be used repeatedly.')
                }
            })
        },
        //更换批次
        replaceBatchNo(value){
            if(value == 'Batch No.'){
                this.batchNoListStatus = true
                this.dataList = this.currentProduct.outBatchList
                this.typeName = 'pici'
            }else if(value == 'Warehouse'){
                this.batchNoListStatus = true
                this.dataList = this.detailData.warehouselist
                this.typeName = 'cangku'
            }
            
        },
        //点击回退
        choiceStatus(status){
            this.batchNoListStatus = status
        },
        //点击确定
        batchDatas(batchArr){
            let batchList = []
            if(this.typeName == 'cangku'){
                this.detailedGuigeList[3].value = batchArr[0].warehouseName
                this.detailData.produclist.forEach(ele => {
                    ele.inStockType = batchArr[0].warehouseName
                });
                this.produclist.forEach(item => {
                    item.warehouseName = batchArr[0].warehouseName
                })
                this.outStockObj.inWarehouseId = batchArr[0].warehouseId
            }else{
                this.detailedGuigeList[2].value = batchArr.join(', ')
                this.currentProduct.batchNo = batchArr.join(',')
                this.currentProduct.outBatchList.forEach(ele => {
                    if(ele.checked){
                        batchList.push(ele)
                        this.currentProduct.batchList = batchList
                        this.currentProduct.saleStockOutOrderDetailId = ele.saleStockOutOrderDetailId
                    }
                })
            }
        },
        //出库
        outStock(){
            if(this.currentArray.length == 0){
                Toast('Please select product')
                return
            }
            try{
                let arr = []
                this.currentArray.forEach(produc => {
                    produc.batchList.forEach(batchItem => {
                        let obj = {
                            inDetailNums:batchItem.inProNum,
                            saleBackOrderDetailIds:produc.saleBackOrderDetailId,
                            saleStockOutOrderDetailIds:batchItem.saleStockOutOrderDetailId,
                            maxNumber:batchItem.outProNum
                        }
                        arr.push(obj)
                    })
                    
                })
                this.outStockObj.outBatchList = arr
            }catch(error){
                Toast('Please select batch No')
                return
            }
            Dialog.confirm({
                title: 'Tips',
                message: 'Are you sure to warehouse?',
                confirmButtonText:'Yes',
                cancelButtonText:'No'
            }).then(() => {
                let flag = true
                if(this.outStockObj.inWarehouseId){
                    this.outStockObj.outBatchList.forEach(outBatch => {
                        if(!outBatch.saleStockOutOrderDetailIds){
                            flag = false
                        }
                        if(outBatch.maxNumber < outBatch.inProNum){
                            flag = false
                        }
                    })
                }else{
                    flag = false
                }

                if(flag){
                    this.customerservicebackorderinstockAll(this.outStockObj)
                }else{
                    Toast('The batch No. or store-in warehouse are wrong.')
                }
            }).catch(() => {});
        },
        //扫描开关
        showSweepCode(flag){
            this.showPickUp = flag
        },
        //更改页数
        changeInput(){
            this.current = Math.ceil(this.current)
            if(this.current > this.currentArray.length){
                this.current = this.currentArray.length
            }else if(this.current < 1){
                this.current = 1
            }
            this.currentProduct = this.currentArray[this.current-1]
        },
        //修改数量
        changNum(val,name){
            //大于0
            val[name] < 0 ? val[name] = 0 : val[name]
            //取整
            val[name] = Math.ceil(val[name])
        }
    },
    components: {
        saomiaoHeader,
        batchNoList,
        sweepCode
    },
};
</script>

<style scoped lang="less">
.pick-up{
    .pick-up-order{
        height: 68px;
        line-height: 68px;
        padding: 0 30px;
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
                div{
                    display: inline-block;
                    word-wrap:break-word;
                    vertical-align: middle;
                    &:nth-child(2){
                        width: 50%;
                    }
                }
                .van-icon-play{
                    transform: rotate(90deg);
                }
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
        width: 50%;
        background-color: #333;
    }
    .btn-smtm{
        width: 50%;
        background-color: #c9c9c9;
        color: #333;
    }
    .goods-shelves{
        margin-top:20px;
        padding: 30px 0 0;
        background-color: #fff;
        margin-bottom: 100px;
        .set-shelves{
            margin:0 30px;
            background-color: #DDDDDD;
            height: 68px;
            line-height: 68px;
            text-align: center;
            font-size: 30px;
            color: #333;
            margin-bottom: 20px;
            .van-icon-play{
                transform: rotate(90deg);
            }
        }
        .shelves-item{
            padding: 30px;
            border-bottom: 1px solid #999;
            &:nth-last-child(1){
                border:0
            }
            .item-title{
                font-size:26px;
                color: #333;
                text-align: left;
                overflow: hidden;
                margin-bottom: 26px;
                img{
                    width: 40px;
                    vertical-align: middle;
                    float: right;
                }
            }
            .item-number{
                display: flex;
                justify-content: space-between;
                font-size: 20px;
                color: #333;
                .item-input{
                    width: 140px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    border: 1px #dcdcdc solid;
                    padding-top: 2px;
                    input{
                        width: 90%;
                        height: 85%;
                        border:0;
                        text-align: center;
                    }
                }
            }
        }   
    }
}
.fs-22{
    font-size: 22px
}
.pl-30{
    padding-left:30px;
}
</style>
