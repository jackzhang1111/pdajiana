<template>
<!-- 上架 -->
    <div class="pick-up">
        <saomiao-header @search="search"></saomiao-header>
        <div class="pick-up-order">Warehousing No.：{{detailData.stockInOrderSn}}</div>
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
                <div class="tiji">
                    <div class="clearfix">
                        <span class="pl-30">Carton Dimensions L*W*H(cm)</span>
                        <div class="fl-right">
                            <span class="kuang">{{currentProduct.boxLength}}</span>
                            <span>X</span>
                            <span class="kuang">{{currentProduct.boxWidth}}</span>
                            <span>X</span>
                            <span class="kuang">{{currentProduct.boxHeight}}</span>
                        </div>
                    </div>
                    <div class="total">
                        <span>Volume:</span>
                        <span class="tijitotal">{{currentProduct.boxSize}}</span>
                        <span>m³</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="goods-shelves">
            <div class="set-shelves">
                <span @click="showPicker = true">Set a Location</span>
                <van-popup v-model="showPicker" position="bottom">
                    <van-picker show-toolbar v-if="showPicker" :columns="currentProduct.columns" @cancel="showPicker = false" @confirm="onConfirm" confirm-button-text="OK" cancel-button-text="Cancel"/>
                </van-popup>
                <van-icon name="play"/>
            </div>
            <div class="shelves-item" v-for="(warehouse,index) in currentProduct.warehouselist" :key="index">
                <div class="item-title">
                    <span>{{warehouse.fuseName ? warehouse.fuseName : warehouse.regionName}}</span>
                    <img src="@/assets/img/lajitong.svg" @click="detailWarehouse(index,warehouse)">
                </div>
                <div class="item-number">
                    <div>{{warehouse.volume}}/{{warehouse.volume-warehouse.takeVolume}}m³</div>
                    <div>{{warehouse.upItemNum*currentProduct.unitSize ? accMul(warehouse.upItemNum,currentProduct.unitSize) : 0}}m³</div>
                    <div class="item-input">
                        <input type="number" v-model="warehouse.upItemNum" @change="changNum(warehouse,'upItemNum')">
                    </div>
                </div>
            </div>
        </div>
        <div class="btns">
            <div class="btn-qbrk" @click="finishPicking">Shelve</div>
        </div>
        <div class="shelves-place"></div>
    </div>
</template>

<script>
import saomiaoHeader from '@/multiplexing/saomiaoHeader.vue'
import { Dialog ,Toast } from 'vant';
import {transferinstockdowmproshelvesApi} from '@/api/warehousing/allocation/index.js'
import {stockInToShelvesAllApi,getwarehouseregionIDApi} from '@/api/warehousing/warehousSupplied/index.js'
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
                {name:'Qty of Warehousing',value:''},
                {name:'FNSKU',value:''},
                {name:'Pcs/Carton',value:''},
                {name:'International No.',value:''},
                {name:'Qty Shelved',value:''},
                {name:'Type',value:''},
                {name:'Unit Weight(kg)',value:''},
                {name:'Warehouse',value:''},
                {name:'Gross Weight/Carton(kg)',value:''},
            ],
            removeData:{
                productlist:[],
                shelfDownOrderId:'',
                sourceType:2
            },
            shelvesData:{
                shelvesOrderId:0,
                sourceType:2,
                productlist:[]
            },
            paraObj:{
                typeId:1,
                paramId:''
            },
            productArray:[],
            value: '',
            showPicker: false,
            columns: [],
            goodsShelves:[],//接口货架货位
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
        this.paraObj.paramId = this.$route.query.orderid
        this.transferinstockdowmproshelves(this.paraObj)
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
        //上架详情
        transferinstockdowmproshelves(data){
            transferinstockdowmproshelvesApi(data).then(res => {
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
                    this.shelvesData.shelvesOrderId = res.Data.shelvesOrderId
                    this.setCurrentProduct()
                    if(!res.Data.shelvesOrderId){
                        this.getwarehouseregionID({warehouseId:res.Data.warehouseId},true)
                    }else{
                        this.getwarehouseregionID({warehouseId:res.Data.warehouseId},false)
                        res.Data.productList.forEach(ele => {
                            ele.warehouselist.forEach(item => {
                                item.text = 'wms'
                            })
                        })
                    }
                }
            })
        },
        //当前商品基本属性
        setCurrentProduct(){
            this.detailedGuigeList[0].value = this.currentProduct.skuValuesTitleEng
            this.detailedGuigeList[1].value = this.currentProduct.businessName
            this.detailedGuigeList[2].value = this.currentProduct.batchNo
            this.detailedGuigeList[3].value = this.currentProduct.detailNum
            this.detailedGuigeList[4].value = this.currentProduct.fnskuCode
            this.detailedGuigeList[5].value = this.currentProduct.goodnumPerBox
            this.detailedGuigeList[6].value = this.currentProduct.intCode
            this.detailedGuigeList[7].value = this.currentProduct.hasInDetailNum
            this.detailedGuigeList[8].value = this.currentProduct.stockIntype
            this.detailedGuigeList[9].value = this.currentProduct.unitWeight
            this.detailedGuigeList[10].value = this.currentProduct.stockInWarehouse
            this.detailedGuigeList[11].value = this.currentProduct.boxWeight
        },
        //全部上架
        finishPicking(){
            let arr = []
            this.productArray.forEach(ele => {
                let obj = {
                    batchNo:ele.batchNo,
                    skuId:ele.skuId,
                    stockInOrderType:2,
                    orderDetailId:ele.orderDetailId,
                    unitSize:ele.unitSize,
                    proRegion:[]
                }
                ele.warehouselist.forEach(item => {
                    if(Number(item.upItemNum)>0){
                        let proRegionObj = {
                            regionId:item.regionId,
                            orderDetailId:ele.orderDetailId,
                            stockInOrderType:2,
                            upItemNum:Number(item.upItemNum),
                        }
                        obj.proRegion.push(proRegionObj)
                    }
                })
                if(obj.proRegion.length > 0){
                    arr.push(obj)
                }
                this.shelvesData.productlist = arr
            });
            Dialog.confirm({
                title: 'Tips',
                message: 'Are you sure to shelve?',
                confirmButtonText:'Yes',
                cancelButtonText:'No'
            }).then(() => {
                let productIndex, proRegionIndex,flag = true
                if(this.productArray.length != this.shelvesData.productlist.length){
                    flag = false
                }
                if(flag){
                    for (productIndex = 0; productIndex < this.shelvesData.productlist.length; productIndex++) { 
                        let num = 0,allNum = 0
                        for(proRegionIndex = 0; proRegionIndex < this.shelvesData.productlist[productIndex].proRegion.length; proRegionIndex++){
                            num += this.shelvesData.productlist[productIndex].proRegion[proRegionIndex].upItemNum
                        }
                        if(this.productArray[productIndex].hasInDetailNum != num){
                            flag = false
                        }
                    }
                }
                if(!flag){
                    Toast('All putaway quantities are incorrect')
                    return
                }
                if(this.shelvesData.productlist.length == 0){
                    Toast('Please select an inventory area for putaway')
                    return
                }
                this.stockInToShelvesAll(this.shelvesData)
            }).catch(() => {});
        },
        //小数点计算
        accMul(arg1,arg2){
            var m=0,s1=arg1.toString(),s2=arg2.toString();
            try{m+=s1.split(".")[1].length}catch(e){}
            try{m+=s2.split(".")[1].length}catch(e){}
            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
        },
        onConfirm(value,valueIndexs) {
            let threeShel = null,  twoShel = null, currIndex = null, isOne = null
            if(this.currentProduct.columns.length == 0) return
            twoShel = this.currentProduct.columns[valueIndexs[0]].children[valueIndexs[1]]
            threeShel = this.currentProduct.columns[valueIndexs[0]].children[valueIndexs[1]].children[valueIndexs[2]]
            this.currentProduct.warehouselist.push(this.$fn.copy(threeShel))  
            this.showPicker = false;

            this.currentProduct.columns.forEach((one,oneIndex) => {
                let oneId = one.regionId
                one.children.forEach((two,twoIndex) => {
                    two.children.forEach((three,threeIndex) => {
                        if(three.regionId == threeShel.regionId){
                            currIndex = threeIndex
                            if(three.regionId == oneId){
                                //只有库区
                                isOne = true
                            }
                        }
                    })
                })
            })
            if(currIndex != null && !isOne){
                //货架货区
                twoShel.children.splice(valueIndexs[2],1)
            }else{
                //只有货区
                this.currentProduct.columns.splice(valueIndexs[0],1)
            }
        },
        //全部上架
        stockInToShelvesAll(data){
            stockInToShelvesAllApi(data).then(res => {
                if(res.code == 0){
                    Toast('Successful putaway')
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },1500)
                }else if(res.code == 1){
                    Toast('The current putaway qty exceeds the maximum qty of available putaway products (by subtracting the product qty of the created putaway order from the warehousing product qty of the warehousing order)')
                }else if(res.code == 2){
                    Toast('Repeated warehousing orders!')
                }else if(res.code == 3){
                    Toast('Inconsistent warehouse!')
                }else if(res.code == 4){
                    Toast('Finished putaway! No more operation!')
                }else if(res.code == 5){
                    Toast('There are warehousing order with 0 adding')
                }else if(res.code == 6){
                    Toast('The adding volume exceeds the available maximum volume(by subtracting the volume of created Not-Added order from the available volume)')
                }else if(res.code == 7){
                    Toast('It  isn’t pending putaway order and cannot be changed.')
                }else if(res.code == 8){
                    Toast('The putaway location must be an inventory area without shelf or a location.')
                }else if(res.code == 9){
                    Toast('It cannot be putaway in the superior area of non-site warehouse.')
                }else if(res.code == 11){
                    Toast('The details of original warehousing order are inexistent.')
                }else if(res.code == 12){
                    Toast('The putaway qty cannot be less than 0.')
                }else if(res.code == 13){
                    Toast('It cannot be operated because of the counting of goods at target location.  ')
                }
            })
        },
        //垃圾桶
        detailWarehouse(index,item){
            Dialog.confirm({
                title: 'Tips',
                message: 'Are you sure to delete the location?',
                confirmButtonText:'Yes',
                cancelButtonText:'No'
            }).then(() => {
                this.currentProduct.warehouselist.splice(index,1)
                let onecolumnIndex = null,twocolumnIndex
                if(item.parentRegionId){
                    this.currentProduct.columns.forEach((column,columnIndex) => {
                        column.children.forEach((two,twoIndex) => {
                            if(two.regionId == item.parentRegionId){
                                onecolumnIndex = columnIndex
                                twocolumnIndex = twoIndex
                                item.upItemNum = 0
                                if(item.text == 'wms') return
                                two.children.push(item)
                            }
                        })
                    })
                    this.currentProduct.columns[onecolumnIndex].children[twocolumnIndex].children.sort(this.$fn.compare('regionId'))
                }else{
                    let ele = null
                    this.goodsShelves.forEach(good => {
                        if(good.regionId == item.regionId){
                            ele = good
                            ele.upItemNum = 0
                        }
                    })
                    if(item.text == 'wms') return
                    this.currentProduct.columns.push(ele)
                }
            }).catch(() => {});
        },
         //PDA获取所有库位信息接口
        getwarehouseregionID(data,flag){
            getwarehouseregionIDApi(data).then(res => {
                if(res.code == 0){
                    res.Data.forEach((one,oneIndex) => {
                        one.text = one.regionName
                        //货区不可摆放
                        if(one.canShelf == 0){
                            if(one.children.length > 0){                            
                                one.children.forEach((two,twoIndex) => {
                                    two.text = two.regionName
                                    if(two.children.length > 0){
                                        two.children.forEach((three,threeIndex) => {
                                            three.text = three.regionName
                                            three.fuseName = one.regionName + '-' + two.regionName + '-' + three.regionName
                                        })
                                        if(twoIndex == (one.children.length - 1)){
                                            this.goodsShelves.push(one)
                                        }
                                    }
                                })
                            }
                        }else{
                            let obj = {
                                canShelf: one.canShelf,
                                children: null,
                                isShelf: one.isShelf,
                                parentRegionId: one.parentRegionId,
                                regionId: one.regionId,
                                regionName: one.regionName,
                                regionNo: one.regionNo,
                                regionType: one.regionType,
                                text:one.regionName,
                                takeVolume: one.takeVolume,
                                upItemNum: one.upItemNum,
                                useStatus: one.useStatus,
                                volume: one.volume,
                                warehouseId: one.warehouseId,
                                warehouseNo: one.warehouseNo,
                                warehouseType: one.warehouseType,
                            }
                            one.children.push({children:[obj],regionName:one.regionName,text:one.regionName})
                            this.goodsShelves.push(one)
                        }
                    })
                    this.productArray.forEach(ele => {
                        if(flag){
                            ele.warehouselist = new Array()
                        }
                        ele.columns = this.$fn.copy(this.goodsShelves) 
                    })
                }
            })
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
        changNum(val,name){
            //大于0
            val[name] < 0 ? val[name] = 0 : val[name]
            //取整
            val[name] = Math.ceil(val[name])
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
                text-align: center;
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
