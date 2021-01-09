<template>
    <div class="reporting-list">
        <div v-show="!showScreen">
            <saomiao-header @search="search" placeholder="Search for product name/Tsin/fnsku"></saomiao-header>
            <div class="commodity-tab">
                <van-tabs type="card" color="#666666" title-active-color="#333333" @click="onClick" v-model="active">
                    <van-tab :title="tab.name" v-for='(tab,index) in tabList' :key="index">
                        <template #title v-if="tab.name === 'screen'"> screen<van-icon name="filter-o" /> </template>
                        <scroll class="bscroll-wrapper" ref="wrapper" :data="recordGroup" :pulldown="pulldown" :pullup="pullup" @pulldown="_pulldown" @pullup="_pullup">
                            <div class="bscroll-con">
                                <div class="order" v-for="(data,index) in dataList" :key="index" >
                                    <div class="order-header">
                                        <span>Order No.:{{data.orderSn}}</span>
                                    </div>
                                    <div class="flex p-30" @click="toDetail(data.outWarehouseId,data.skuId,data)">
                                        <div>
                                            <img :src="$webUrl+data.skuImg" class="good-img">
                                        </div>
                                        <div class="order-con">
                                            <p>{{data.skuName}}</p>
                                            <p>TSIN：{{data.tsinCode}}</p>
                                            <p>FNSKU：{{data.fnskuCode}}</p>
                                            <!-- 规格属性 -->
                                            <p v-show="data.skuValuesTitleEng">Specifications：{{data.skuValuesTitleEng}}</p>
                                            <!-- 出库时间 -->
                                            <p v-show="data.stockOutTime">Delivery time:{{data.stockOutTime}}</p>
                                            <span class="status-kuang">{{orderStatus(data.outStockType,'statusList')}}</span>
                                        </div>
                                        
                                    </div>
                                    <div class="order-footer">
                                        <div class="btn fl-right" @click="toUpload(data.outWarehouseId,data.skuId,data)">Reporting</div>
                                    </div>
                                </div>
                            </div>
                        </scroll>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <div v-show="showScreen">
            <reporting-screen @reportData="reportData" @closeScreen="closeScreen"></reporting-screen>
        </div>
    </div>
</template>

<script>
import saomiaoHeader from '@/multiplexing/saomiaoHeader.vue'
import { Dialog ,Toast} from 'vant';
import {queryreportListApi} from '@/api/warehousing/reporting/index.js'
import reportingScreen from './reportingScreen'
export default {
    props: {

    },
    data() {
        return {
            tabList:[
                {name:'today',value:0},
                {name:'yesterday',value:1},
                {name:'screen',value:2},
            ],
            statusList:[
                {name:'Sales Delivery',type:1},
                {name:'Goods returned from warehouse',type:2},
            ],
            active:0,
            pulldown:true,
            pullup:true,
            guanmengou:true,
            totalCount:0,
            dataList:[],
            recordGroup:[],
            formData:{
                inputNmae:'',
                inputType:0,
                inputday:1,
                page:1,
                limit:10,
                timestart:'',//开始时间
                timeend:''//结束时间
            },
            showScreen:false,//是否显示筛选
        };
    },
    computed: {

    },
    created() {

    },
    mounted() {
        this.refreshOrder()
    },
    watch: {

    },
    methods: {
        //搜索框 
        search(value){
            this.formData.inputNmae = value
            this.formData.inputType = 0
            this.formData.inputday = ''
            this.formData.timestart = ''
            this.formData.timeend = ''
            this.refreshOrder()
        },
         //下拉刷新
        _pulldown(){
            setTimeout(()=>{
                this.refreshOrder()
            },500)
        },
        //上拉加载
        _pullup() {
            if(!this.pullup) return
            //不知道为什么触发两次,使用关门狗拦截
            if(this.guanmengou){
                this.formData.page++
                this.queryreportList(this.formData,false)
                this.guanmengou = false
            }
            setTimeout(()=>{
                this.guanmengou = true
            },500)
        },
        //刷新页面
        refreshOrder(){
            this.formData.page = 1
            this.formData.limit = 10
            this.queryreportList(this.formData,true)
            this.pullup = true
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
        //供货入库列表
        queryreportList(data,flag){
            queryreportListApi(data).then(res => {
                if(res.code == 0){
                    if(flag){
                        this.dataList = res.Data.list
                    }else{
                        this.dataList = this.dataList.concat(res.Data.list);
                    }
                    this.totalCount = res.Data.totalCount
                    if(this.dataList.length > 0){
                        if(this.dataList.length >= this.totalCount){
                            this.pullup = false
                        }
                    }else{
                        this.pulldown = false
                        this.pullup = false
                    }
                }
            })
        },
        //切换tab
        onClick(index) {
            if(index == 2){
                // this.$router.push({name:'reportingScreen'})
                this.showScreen = true
                return
            }
            this.formData.inputNmae = ''
            this.formData.inputday = index+1
            this.formData.timestart = ''
            this.formData.timeend = ''
            this.refreshOrder()
        },
        //筛选传回来的值
        reportData(data){
            this.showScreen = false
            this.formData.inputType = data.currenIndex
            this.formData.inputday = ''
            this.formData.timestart = data.startTxt
            this.formData.timeend = data.endTxt
            this.refreshOrder()
            console.log(data);
        },
        //去详情
        toDetail(outWarehouseId,skuId,data){
            localStorage.reportingData = JSON.stringify(data)
            this.$router.push({name:"reportingDetail",query:{outWarehouseId,skuId}})
        },
        //去上报
        toUpload(outWarehouseId,skuId,data){
             this.$router.push({name:"reportingUpload",query:{outWarehouseId,skuId}})
        },
        //关闭筛选
        closeScreen(){
            this.showScreen = false
        },
    },
    components: {
        saomiaoHeader,
        reportingScreen
    },
};
</script>

<style scoped lang="less">
.bscroll-wrapper{
    height: calc(100vh - 230px);
}
.reporting-list{
    .commodity-tab{
        /deep/ .van-tabs__content{
            position: relative;
            overflow: hidden;
        }
    }
    /deep/ .van-tabs--card{
        padding: 0 30px;

        .van-tabs__wrap{
            margin:35px 0 20px;
        }
        .van-tabs__nav--card{
            margin:0;
        }
        .van-tabs__nav{
            .van-tab {
                &:nth-child(1){
                    flex-basis:15% !important; 
                }
                &:nth-child(2){
                    flex-basis:28% !important; 
                }
                &:nth-child(3){
                    flex-basis:28% !important; 
                }
                &:nth-child(4){
                    flex-basis:28% !important; 
                }
                &:nth-child(5){
                    flex-basis:28% !important; 
                }
            }
        }
    }
    .order{
        background-color: #fff;
        font-size: 24px;
        overflow: hidden;
        margin-bottom: 20px;
        .order-header{
            line-height: 40px;
            padding:20px 30px;
            overflow: hidden;
        }
        .order-con{
            padding: 30px 30px;
            overflow: hidden;
            p{
                font-size: 24px;
                color: #333;
                line-height: 50px;
            }
            .status-kuang{  
                display: inline-block;
                margin-top:10px;
                padding: 10px;
                border: 1px solid #D2A835;
                color: #D2A835;
            }
        }
        
        .good-img{
            width: 140px;
            height: 140px;
        }
        .order-footer{
            overflow: hidden;
            padding: 30px 30px 19px;
            .btn{
                height:48px;
                border:2px solid #666666;
                border-radius:6px;
                line-height: 48px;
                text-align: center;
                margin-left:20px;
                padding: 0 20px;
            }
        }
    }
    .p-30{
        padding: 0 30px;
        border: 1px solid #F2F3F5;
    }
}
</style>
