<template>
    <div class="reporting-upload">
        <nosaomiao-header title="upload"></nosaomiao-header>
        <div class="good-position" v-for="(position,index) in positionList" :key="index">
            <div class="m-b-20" v-if="positionList.length > 0">position {{index+1}}:{{position.regionName}}</div>
            <div class="m-b-20" v-else>The current system available inventory is 0, unable to display specific location information</div>
            <div>
                <span>stock:</span>
                <input type="number" v-model="position.reportUseNum"/>
            </div>
        </div>
        <div class="kongbai"></div>
        <div class="submit-btn" @click="submit">submit</div>
    </div>
</template>

<script>
import nosaomiaoHeader from '@/multiplexing/nosaomiaoHeader.vue'
import {addreportModelApi,queryRegionNameListApi} from '@/api/warehousing/reporting/index.js'
import { Toast } from 'vant';
export default {
    props: {

    },
    data() {
        return {
            uploadData:{},
            positionList:[],
            detail:{}
        };
    },
    computed: {

    },
    created() {

    },
    mounted() {
        this.queryRegionNameList({skuId:Number(this.$route.query.skuId),outWarehouseId:Number(this.$route.query.outWarehouseId)})
        this.detail = JSON.parse(localStorage.reportingData)
    },
    watch: {

    },
    methods: {
        addreportModel(data){
            addreportModelApi(data).then(res => {
                if(res.code == 0){
                    Toast('success')
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },1000)
                }
            })
        },
        //上报详情
        queryRegionNameList(data){
            queryRegionNameListApi(data).then(res => {
                if(res.code == 0){
                    this.positionList = res.Data
                    
                    
                }
            })
        },
        //提交
        submit(){
            //库位id不知道
            let arr = []
            let obj = JSON.parse(JSON.stringify(this.detail));
            let sysNum = 0,reportNum=0,differNum=0
            this.positionList.forEach(item => {
                item.reportUseNum = item.reportUseNum ? item.reportUseNum : 0
                item.canUseNum = item.canUseNum ? item.canUseNum : 0
                sysNum += Number(item.canUseNum)
                reportNum += Number(item.reportUseNum)
            })
            differNum = reportNum-sysNum
            obj.sysNum = sysNum
            obj.reportNum = reportNum
            obj.differNum = differNum
            obj.detailList = this.positionList.map(o => Object.assign({}, o));
            // console.log(obj);
            this.addreportModel(obj)
        }
    },
    components: {
        nosaomiaoHeader
    },
};
</script>

<style scoped lang="less">
.reporting-upload{
    padding-top: 30px;
    height: 100vh;
    position: relative;
    box-sizing: border-box;
    .good-position{
        background: #FFFFFF;
        opacity: 1;
        border-radius: 10px;
        padding: 30px;
        font-size: 26px;
        margin: 0px 30px;
    }
    .submit-btn{
        height: 108px;
        background-color: #000;
        color: #fff;
        font-size: 36px;
        text-align: center;
        line-height: 108px;
        position: fixed;
        bottom: 0;
        width: 100%;
    }
    .m-b-20{
        margin-bottom: 20px;
    }
    .kongbai{
        height: 108px;
    }
}
</style>
