<template>
<!-- 入库 -->
    <div>
        <div class="pick-up" v-show="showPickUp">
            <saomiao-header @search="search"></saomiao-header>
            <div class="pick-up-order">
                <span>Supply No.：{{detailData.orderSn}}</span>
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
                    <div class="detailed-item" v-for="(detailedGuige,index) in detailedGuigeList" :key="index">
                        <span class="c-999">{{detailedGuige.name}}</span>&nbsp;&nbsp;&nbsp;
                        <span class="c-666">{{detailedGuige.value}}</span>
                    </div>
                    <div class="detailed-item">
                        <span class="c-999">Warehousing Qty</span>&nbsp;&nbsp;&nbsp;
                        <div class="item-input">
                            <input type="number" v-model="currentProduct.inDetailNum" @change="changNum(currentProduct,'yes','inDetailNum')">
                        </div>
                    </div>
                    <div class="detailed-item">
                        <span class="c-999">Type</span>&nbsp;&nbsp;&nbsp;
                        <span class="c-666">{{orderStatus(currentProduct.typeValue,'stockIntypeList')}}</span>
                    </div>
                    <div class="detailed-item">
                        <span class="c-999">Unit Weight(kg)</span>&nbsp;&nbsp;&nbsp;
                        <div class="item-input">
                            <input type="number" v-model="currentProduct.unitWeight"  @change="changNum(currentProduct,'no','unitWeight')">
                        </div>
                    </div>
                    <div class="detailed-item">
                        <span class="c-999">Warehouse</span>&nbsp;&nbsp;&nbsp;
                        <span class="c-666">{{currentProduct.stockInWarehouse}}</span>
                    </div>
                    <div class="detailed-item">
                        <span class="c-999">Gross Weight/Carton(kg)</span>&nbsp;&nbsp;&nbsp;
                        <div class="item-input">
                            <input type="number" v-model="currentProduct.boxWeight"  @change="changNum(currentProduct,'no','boxWeight')">
                        </div>
                    </div>
                    <div class="tiji">
                        <div class="clearfix">
                            <span class="pl-30">Product Dimensions L*W*H(cm)</span>
                            <div class="fl-right">
                                <div class="kuang">
                                    <input type="number" v-model="currentProduct.unitLength" @change="changNum(currentProduct,'no','unitLength')">
                                </div>
                                <span>X</span>
                                <div class="kuang">
                                    <input type="number" v-model="currentProduct.unitWidth" @change="changNum(currentProduct,'no','unitWidth')">
                                </div>
                                <span>X</span>
                                <div class="kuang">
                                    <input type="number" v-model="currentProduct.unitHeight" @change="changNum(currentProduct,'no','unitHeight')">
                                </div>
                            </div>
                        </div>
                        <div class="total">
                            <span>Volume:</span>
                            <span class="tijitotal">{{computVolume(currentProduct.unitLength,currentProduct.unitWidth,currentProduct.unitHeight)}}</span>
                            <span>m³</span>
                        </div>
                    </div>
                    <div class="tiji">
                        <div class="clearfix">
                            <span class="pl-30">Carton Dimensions L*W*H(cm)</span>
                            <div class="fl-right">
                                <div class="kuang">
                                    <input type="number" v-model="currentProduct.boxLength" @change="changNum(currentProduct,'no','boxLength')">
                                </div>
                                <span>X</span>
                                <div class="kuang">
                                    <input type="number" v-model="currentProduct.boxWidth" @change="changNum(currentProduct,'no','boxWidth')">
                                </div>
                                <span>X</span>
                                <div class="kuang">
                                    <input type="number" v-model="currentProduct.boxHeight" @change="changNum(currentProduct,'no','boxHeight')">
                                </div>
                            </div>
                        </div>
                        <div class="total">
                            <span>Volume:</span>
                            <span class="tijitotal">{{computVolume(currentProduct.boxLength,currentProduct.boxWidth,currentProduct.boxHeight)}}</span>
                            <span>m³</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btns">
                <div class="btn-smtm" @click="showSweepCode(false)">Scan the Barcode</div>
                <div class="btn-qbrk" @click="outStock">Warehouse</div>
            </div>
        </div>
        <div class="shelves-place"></div>
        <div v-if="!showPickUp">
            <sweep-code @search="search" @showSweepCode="showSweepCode"></sweep-code>
        </div>
    </div>
</template>

<script>
import saomiaoHeader from '@/multiplexing/saomiaoHeader.vue'
import { Dialog ,Toast } from 'vant';
import {confirmationStockInApi,scanproductbarcodeApi} from '@/api/warehousing/warehousSupplied/index.js'
import sweepCode from './itemComponents/sweepCode.vue'
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
                {name:'Qty Supplied',value:''},
                {name:'Supplier',value:''},
                {name:'Cartons Supplied',value:''},
                {name:'Batch No.',value:''},
                {name:'Pcs/Carton',value:''},
                {name:'FNSKU',value:''},
                {name:'Qty Warehoused',value:''},
                {name:'International No.',value:''},
            ],
            currentArray:[],
            productlist:[],
            outStockObj:{   
                productList:[],
                remark:'',
                sourceType:2,
                stockInOrderId:null
            },
            showPickUp:true,
            stockIntypeList:[
                {type:1,name:'Supply Warehousing Order'},
                {type:2,name:'Transfer Warehousing Order'},
                {type:3,name:'Sales Return Warehousing Order'}
            ]
        };
    },
    computed: {
        playLeft() {
            return  this.current == 1
        },
        playRight() {
            return  this.current == this.currentArray.length
        },
    },
    mounted() {
        this.confirmationStockIn(this.$route.query.orderid)
    },
    watch: {
        currentProduct:{
            handler:function(newVal){
                this.setCurrentProduct()
            }
        },
        productlist:{
            handler:function(newVal){
                this.productlist.forEach(item => {
                    if(item.display == 1){
                        this.currentArray.push(item)
                    }
                });
            }
        }
    },
    methods: {
        //搜索框 
        search(val){
            this.productlist.forEach((item,index) => {
                if(item.fnskuCode == val && item.display == 0){
                    item.display = 1
                    this.currentArray.push(item)
                    this.currentProduct = this.currentArray[this.currentArray.length-1]
                    this.current = this.currentArray.length
                }else if(item.fnskuCode == val && item.display == 1){
                    this.current = index + 1
                    this.currentProduct = this.currentArray[index]
                    this.currentProduct.inDetailNum++
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
        confirmationStockIn(orderId){
            confirmationStockInApi({orderId}).then(res => {
                if(res.code == 0){
                    this.detailData = res.Data
                    this.productlist = res.Data.productlist.map(o => Object.assign({}, o));
                    setTimeout(()=>{this.currentProduct = this.currentArray[this.current-1]},0)
                    this.listLength = res.Data.productlist.length
                    this.outStockObj.stockInOrderId = res.Data.stockInOrderId
                }else if(res.code == -100){
                    Toast('The supply code is inexistent.')
                }else if(res.code == -110){
                    Toast('The supply code is a draft. It cannot be warehoused.')
                }else if(res.code == -115){
                    Toast('The supply code undergoing approval process.')
                }else if(res.code == -120){
                    Toast('The supply code is pending delivery.')
                }else if(res.code == -130){
                    Toast('The supply code was warehoused. Please finish the pending putaway process and don’t operate it repeatedly.')
                }else if(res.code == -140){
                    Toast('The supply code was warehoused and putaway. Don’t operate it repeatedly.')
                }else if(res.code == -150){
                    Toast('The supply code was canceled.')
                }else if(res.code == -160){
                    Toast('The application of the supply code was rejected.')
                }
            })
        },
        //当前商品基本属性
        setCurrentProduct(){
            try{
                this.detailedGuigeList[0].value = this.currentProduct.skuValuesTitleEng
                this.detailedGuigeList[1].value = this.currentProduct.detailNum
                this.detailedGuigeList[2].value = this.currentProduct.businessName
                this.detailedGuigeList[3].value = this.currentProduct.inDetailBoxNum
                this.detailedGuigeList[4].value = this.currentProduct.batchNo
                this.detailedGuigeList[5].value = this.currentProduct.goodnumPerBox
                this.detailedGuigeList[6].value = this.currentProduct.fnskuCode
                this.detailedGuigeList[7].value = this.currentProduct.hasInDetailNum
                this.detailedGuigeList[8].value = this.currentProduct.intCode
            }catch(err){console.log(err)}
            
        },
        //计算体积
        computVolume(length,width,height){
            return (length*100)*(width*100)*(height*100)/Math.pow(10,12)
        },
        outStock(){
            Dialog.confirm({
                title: 'Tips',
                message: 'Are you sure to warehouse?',
                confirmButtonText:'Yes',
                cancelButtonText:'No'
            }).then(() => {
                let arr = []
                this.currentArray.forEach(good => {
                    let obj = {
                        inBoxHeight:good.boxHeight,//装箱高度
                        inBoxLength:good.boxLength, //装箱长度
                        inBoxWeight:good.boxWeight, //装箱重量
                        inBoxWidth: good.boxWidth,  //装箱长度
                        inDetailNum: good.inDetailNum, //数量
                        inUnitHeight: good.unitHeight, //单位高度
                        inUnitLength: good.unitLength, //单位长度
                        inUnitWeight: good.unitWeight, //单位重量
                        inUnitWidth: good.unitWidth,  //单位宽度
                        orderDetailId: good.orderDetailId //供货单明细表id
                    }
                    arr.push(obj)
                })
                this.outStockObj.productList = arr
                if(this.currentArray.length < this.listLength){
                    Dialog.confirm({
                        title: 'Tips',
                        message: 'The product qty is insufficient. Are you sure to continue warehousing?',
                        confirmButtonText:'Yes',
                        cancelButtonText:'No'
                    }).then(()=>{
                        this.scanproductbarcode(this.outStockObj)
                    }).catch(()=>{})
                }else{
                    this.scanproductbarcode(this.outStockObj)
                }
            }).catch(() => {});
        },
        //扫描供货单再扫描商品编码后的确定全部入库操作
        scanproductbarcode(data){
            scanproductbarcodeApi(data).then(res => {
                if(res.code == 0){
                    Toast('Success!')
                    if(this.$route.query.code == 'sweepCode'){
                        this.$router.replace({name:'suppliedShelves',query:{paramId:this.$route.query.orderid,typeId:1}})
                    }else{
                        setTimeout(()=>{
                            this.$router.go(-1)
                        },1500)
                    }
                }else if(res.code == 1){
                    Toast('The current warehousing product qty exceeds the maximum qty of available warehousing products (by subtracting the product qty of the created warehousing order from the supply qty)')
                }else if(res.code == 2){
                    Toast('Repeated supply orders')
                }else if(res.code == 3){
                    Toast('The store-in warehouse of the supply order is inconsistent.')
                }else if(res.code == 4){
                    Toast('It has been put into storage, no repeat operation is required. ')
                }else if(res.code == 5){
                    Toast('The are supply orders with the current warehousing qty being less than o.')
                }else if(res.code == 6){
                    Toast('The warehousing order isn’t pending warehousing. It cannot be changed.')
                }else if(res.code == 7){
                    Toast('One supply order can only have one supply warehousing order.')
                }
            })
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
            console.log(this.current,'this.current');
        },
        //修改数量
        changNum(val,type,name){
            //大于0
            val[name] < 0 ? val[name] = 0 : val[name]
            if(type == 'no') return
            //取整
            val[name] = Math.ceil(val[name])
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
        saomiaoHeader,
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
                .item-input{
                    display: inline-block;
                    width: 100px;
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
                    border: 2px solid #dcdcdc;
                    border-radius:6px;
                    vertical-align: middle;
                    text-align: center;
                    font-size: 18px;
                    input{
                        width: 85%;
                        height: 70%;
                        border:0;
                        text-align: center;
                    }
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
    .btn-qbrk{
        width: 50%;
        background-color: #333;
    }
    .btn-smtm{
        width: 50%;
        background-color: #c9c9c9;
        color: #333;
    }
}
.fs-22{
    font-size: 22px
}
.shelves-place{
    height: 110px;
}
.pl-30{
    padding-left:30px;
}
</style>
