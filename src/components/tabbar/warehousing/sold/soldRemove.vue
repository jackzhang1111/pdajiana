<template>
<!-- 下架 -->
    <div class="pick-up">
        <div v-show="!batchNoListStatus">
            <saomiao-header @search="search"></saomiao-header>
            <div class="pick-up-order" v-if="!$route.query.type">Sale No.：{{detailData.shelfDownorderSn}}</div>
            <div class="pick-up-order">saleOrder No.：{{detailData.saleOrderSn}}</div>
            <van-collapse v-model="activeNames" class="collapse" v-if="$route.query.type == 'xiajia'">
                <van-collapse-item>
                    <template #title>
                        <div>
                            <span>Sale No.：</span>
                            <span class="fl-right fs-20">{{detailData.shelfDownorderSn}}</span>
                        </div>
                    </template>
                    <div v-for="(data,index) in dataList" :key="index" class="order-list" @click="toPickUp(data)">
                        <span>{{data.orderSn}}</span> 
                        <div class="fl-right">
                            <van-checkbox v-model="data.checked"></van-checkbox>
                        </div>
                    </div>
                </van-collapse-item>
            </van-collapse>

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
            </div>
            <div class="goods-shelves">
                <div class="set-shelves">
                    <span>Location</span>
                </div>
                <div class="shelves-item" v-for="(warehouse,index) in currentProduct.warehouselist" :key="index">
                    <div class="item-title">
                        <span>{{warehouse.regionName}}</span>
                        <span class="fs-18">(Stock:{{warehouse.canUseNum?warehouse.canUseNum:0}})</span>
                    </div>
                    <div class="item-number">
                        <div>{{warehouse.volume}}m³</div>
                        <div>{{warehouse.takeVolume}}m³</div>
                        <!-- <div class="item-input">
                            <input type="number" v-model="warehouse.downItemNum">
                        </div> -->
                    </div>
                    <div class="item-number" v-for="(batchNolist,index) in warehouse.batchNoList" :key="index">
                        <div>{{batchNolist.inbatchNo}}(Stock:{{batchNolist.canUseNum}})</div>
                        <div class="item-input">
                            <input type="number" v-model="batchNolist.downItemNum" @change="changNum(batchNolist)">
                        </div>
                    </div>
                </div>
            </div>
            <div class="btns">
                <div class="btn-qbrk" @click="allShelves">Remove</div>
            </div>
            <div class="shelves-place"></div>
        </div>
        <div v-if="batchNoListStatus">
            <batch-no-list @choiceStatus="choiceStatus" @batchDatas="batchDatas" :dataObj="dataObj" :checkBatchNo="checkBatchNo"></batch-no-list>
        </div>
    </div>
</template>

<script>
import saomiaoHeader from '@/multiplexing/saomiaoHeader.vue'
import batchNoList from './batchNoList.vue'
import { Dialog ,Toast } from 'vant';
import {saleoutorderstockdowmprolistApi,saleoutorderstockdowmprobatchRegionApi} from '@/api/warehousing/sold/index.js'
import {returngoodsstockdowmAllApi} from '@/api/warehousing/cancellation/index.js'
import {waitingfordismountingorderlistApi} from '@/api/warehousing/shelve/index.js'
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
                {name:'Warehouse',value:''},
                {name:'FNSKU',value:''},
                {name:'Qty Ex-warehoused',value:''},
                {name:'International No.',value:''},
                {name:'Qty Removed',value:''},
                {name:'Type',value:''},
                {name:'Unit Weight(kg)',value:''},
            ],
            removeData:{
                productlist:[],
                shelfDownOrderId:'',
                sourceType:2,
                isUpdate:0,
                logisticsOrderId:'',
                outWarehouseId:'',
                stockOutOrderId:''
            },
            productArray:[],
            batchNoListStatus:false,
            dataObj:{
                outWarehouseId:'',
                skuId:''
            },

            activeNames:[],
            dataList:[],
            checkBatchNo:''
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
        this.saleoutorderstockdowmprolist(this.$route.query.orderid)
        if(this.$route.query.type == 'xiajia'){
            this.waitingfordismountingorderlist()
        }
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
        //下架详情接口
        saleoutorderstockdowmprolist(orderId){
            saleoutorderstockdowmprolistApi({orderId}).then(res => {
                if(res.code == 0){
                    this.detailData = res.Data
                    this.currentProduct = res.Data.productList[this.current-1]
                    this.listLength = res.Data.productList.length
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
                    this.removeData.shelfDownOrderId = this.detailData.shelfDownOrderId
                    this.removeData.logisticsOrderId = this.detailData.logisticsOrderId
                    this.removeData.outWarehouseId = this.detailData.outWarehouseId
                    this.removeData.stockOutOrderId = this.detailData.stockOutOrderId

                    this.dataObj.outWarehouseId = res.Data.outWarehouseId
                    this.setCurrentProduct()
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
        //全部下架
        allShelves(){
            let arr = []
            let Obj = {}
            //循环商品
            this.productArray.forEach(ele => {
                //将商品的批次号,转化成数组
                let itemBatchNo = ele.batchNo.split(',')
                //如果有多个批次号
                if(itemBatchNo.length>1){
                    
                    //批次号循环
                    itemBatchNo.forEach(itemBatch => {
                        let obj = {
                            skuId:ele.skuId,
                            stockOutOrderType:3,
                            proRegion:[],
                            stockOutOrderDetailId:'',
                            logisticsOrderDetailId:ele.logisticsOrderDetailId
                        }
                        //库区循环
                        ele.warehouselist.forEach(warehouse => {
                            
                            warehouse.batchNoList.forEach(item => {
                                
                                //如果库区里面是有值的
                                if(Number(item.downItemNum)>0){
                                    
                                    //批次号等于该库区的批次号
                                    if(item.inbatchNo == itemBatch){
                                        // console.log(item.inbatchNo,'item.inbatchNo');
                                        obj.batchNo = itemBatch
                                        obj.stockOutOrderDetailId = item.stockOutOrderDetailId
                                        let proRegionObj = {
                                            downItemNum:Number(item.downItemNum),
                                            regionId:warehouse.regionId,
                                            stockOutOrderDetailId:item.stockOutOrderDetailId,
                                            stockOutOrderType:3,
                                            inventoryBatchId:item.inventoryBatchId
                                        }
                                        // console.log(proRegionObj,'proRegionObj');
                                        obj.proRegion.push(proRegionObj)
                                    }
                                }
                            })
                            
                        })
                        if(obj.batchNo){
                            arr.push(obj)
                        }
                    })
                }else{
                    let obj = {
                        batchNo:ele.batchNo,
                        skuId:ele.skuId,
                        stockOutOrderType:3,
                        stockOutOrderDetailId:'',
                        proRegion:[],
                        logisticsOrderDetailId:ele.logisticsOrderDetailId
                    }
                    ele.warehouselist.forEach(warehouse => {
                        warehouse.batchNoList.forEach(item => {
                            if(Number(item.downItemNum)>0){
                                obj.stockOutOrderDetailId = item.stockOutOrderDetailId
                                let proRegionObj = {
                                    downItemNum:Number(item.downItemNum),
                                    regionId:warehouse.regionId,
                                    stockOutOrderDetailId:item.stockOutOrderDetailId,
                                    stockOutOrderType:3,
                                    inventoryBatchId:item.inventoryBatchId
                                }
                                obj.proRegion.push(proRegionObj)
                            }
                        })
                        if(obj.proRegion.length > 0){
                            arr.push(obj)
                        }
                    })
                    
                }
                
            });
            //去重
            arr = arr.reduce((cur,next) => {
                Obj[next.batchNo] ? "" : Obj[next.batchNo] = true && cur.push(next);
                return cur;
            },[]) //设置cur默认类型为数组，并且初始值为空的数组

            this.removeData.productlist = arr
            Dialog.confirm({
                title: 'Tips',
                message: 'Are you sure to remove?',
                confirmButtonText:'Yes',
                cancelButtonText:'No'
            }).then(() => {
                let productIndex, proRegionIndex,flag = true
                if(this.productArray.length > this.removeData.productlist.length){
                    flag = false
                }
                if(flag){
                    let num = 0,num2 = 0
                    this.productArray.forEach(ele => {
                        num += ele.detailNum
                    })
                    this.removeData.productlist.forEach(ele => {
                        ele.proRegion.forEach(item => {
                            num2 += item.downItemNum
                        })
                    })
                    if(num != num2){
                        flag = false
                    }
                }
                if(!flag){
                    Toast('All removing quantities are incorrect.')
                    return
                }
                if(this.removeData.productlist.length == 0){
                    Toast('Please select removing products')
                    return
                }
                this.returngoodsstockdowmAll(this.removeData)
            }).catch(() => {});
        },
        //下架
        returngoodsstockdowmAll(data){
            returngoodsstockdowmAllApi(data).then(res => {
                if(res.code == 0){
                    Toast('Successful removing')
                    if(this.$route.query.code == 'sweepCode'){
                        this.$router.replace({name:'soldOutstock',query:{orderid:this.$route.query.orderid}})
                    }else{
                        setTimeout(()=>{
                            this.$router.go(-1)
                        },1500)
                    }
                }else if(res.code == 1){
                    Toast('The current removing product qty exceeds the maximum qty of available removing products (by subtracting the product qty of created removing order from the ex-warehousing product qty of the ex-warehousing order)')
                }else if(res.code == 2){
                    Toast('Sales ex-warehousing can’t remove inferior products')
                }else if(res.code == 3){
                    Toast('The warehouse of the ex-warehousing order is inconsistent')
                }else if(res.code == 4){
                    Toast('There are ex-warehousing orders with the status being non Pending Remove.')
                }else if(res.code == 6){
                    Toast('The current removing qty exceeds the maximum qty of available removing products (by subtracting the pending removing product qty of the created removing order from the available inventory)')
                }else if(res.code == 7){
                    Toast('The removing order isn’t pending removing. It cannot be changed')
                }else if(res.code == 8){
                    Toast('There are sales ex-warehousing orders applied for refund')
                }else if(res.code == 9){
                    Toast('It was removed. No more operation')
                }else if(res.code == 11){
                    Toast('The source ex-warehousing order is inexistent.')
                }else if(res.code == 12){
                    Toast('The removing qty cannot be less than 0.')
                }else if(res.code == 13){
                    Toast('It cannot be operated because of the counting of goods at target location. ')
                }
            })
        },
        //更换批次
        replaceBatchNo(value){
            if(value != 'Batch No.') return
            this.dataObj.skuId = this.currentProduct.skuId
            this.batchNoListStatus = true
            this.checkBatchNo = this.currentProduct.batchNo
        },
        //点击回退
        choiceStatus(status){
            this.batchNoListStatus = status
        },
        //点击确定
        batchDatas(batchArr){
            this.removeData.isUpdate = 1
            this.detailedGuigeList[2].value = batchArr.join(', ')
            this.currentProduct.batchNo = batchArr.join(',')
            let obj = {
                outWarehouseId:this.dataObj.outWarehouseId,
                inbatchNo:batchArr,
                orderId:this.$route.query.orderid
            }
            this.saleoutorderstockdowmprobatchRegion(obj)
        },
        //销售下架获取所有商品入库批次对应的库位列表信息
        saleoutorderstockdowmprobatchRegion(data){
            saleoutorderstockdowmprobatchRegionApi(data).then(res => {
                if(res.code == 0){
                    this.currentProduct.warehouselist = res.Data
                }
            })
        },
        waitingfordismountingorderlist(){
            waitingfordismountingorderlistApi().then(res => {
                if(res.code == 0){
                    this.dataList = res.Data
                    this.dataList.forEach(item => {
                        item.checked = false
                        if(item.orderId == this.$route.query.orderid){
                            item.checked = true
                        }
                    })
                }
            })
        },
        //选择单号
        toPickUp(orderData){
            if(this.$route.query.orderid == orderData.orderId) return
            this.dataList.forEach(item => {
                item.checked = false
            })
            orderData.checked = true
            if(orderData.type == 1){
                this.$router.replace({name:'cancellationRemove',query:{orderid:orderData.orderId,type:'xiajia'}})
            }else if(orderData.type == 2){
                this.$router.replace({name:'allocationRemove',query:{orderid:orderData.orderId,type:'xiajia'}})
            }else{
                this.$router.replace({name:'soldRemove',query:{orderid:orderData.orderId,type:'xiajia'}})
                this.saleoutorderstockdowmprolist(orderData.orderId)
            }
            this.$forceUpdate()
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
        },
        //修改数量
        changNum(val){
            val.downItemNum < 0 ? val.downItemNum = 0 : val.downItemNum
            val.downItemNum = Math.ceil(val.downItemNum)
            this.removeData.isUpdate = 1
        }
    },
    components: {
        saomiaoHeader,
        batchNoList
    },
};
</script>

<style scoped lang="less">
.pick-up{
    .collapse{
        margin-bottom: 20px;
    }
    /deep/ .van-collapse-item__wrapper{
        .van-collapse-item__content{
            padding: 0;
            padding-bottom: 60px;
        }
    }
    .order-list{
        height: 70px;
        line-height: 70px;
        color: #999;
        font-size: 24px;
        border-bottom: 1px solid #999;
        padding: 0 30px;
        .fl-right{
            margin-top:14px;
        }
    }
    .pick-up-order{
        height: 68px;
        line-height: 68px;
        padding: 0 30px;
        font-size: 26px;
        color: #333;
        background-color: #fff;
        margin-bottom: 20px;
        &:nth-child(2){
            margin:0
        }
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
                    margin-top:5%;
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
                padding-top: 10px;
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
                padding: 20px 0;
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
                        margin-top:5%;
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
.fs-20{
    font-size: 20px
}
.pl-30{
    padding-left:30px;
}
</style>
