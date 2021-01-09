<template>
    <div class="reporting-screen">
        <div class="nosaomiao-header">
            <van-icon name="arrow-left" size="20" class="arrow-left" @click="close"/>
            <span>screen</span>
        </div>
        <div class="place"></div>
        <div class="xuanze">Select The Time</div>
        <div class="flex_space">
            <div class="flex">
                <div class="start-btn fs-26" @click="startShow = true">
                    <span v-if="!startTxt">start</span>
                    <span v-else>{{startTxt}}</span>
                    <img src="@/assets/img/riqi.svg" class="riqi-img">
                </div>
            </div>
            <div class="flex">
                <div class="start-btn fs-26" @click="endShow = true">
                    <span v-if="!endTxt">end</span>
                    <span v-else>{{endTxt}}</span>
                    <img src="@/assets/img/riqi.svg" class="riqi-img">
                </div>
            </div>
        </div>
        <div class="xuanze m-t-60">Delivery Type</div>
        <div class="flex flex_warp">
            <div class="type-btn fs-26" v-for="(type,index) in typeList" :key="index" @click="changeIndex(index)" :class='{ "curren-style":index===currenIndex}'>{{type.name}}</div>
        </div>
        <div class="footer-btns flex_space">
            <div class="reset-btn" @click="reset">reset</div>
            <div class="confirm-btn" @click="submit">confirm</div>
        </div>


        <div class="xuanze m-t-60">Status</div>
        <div class="flex flex_warp">
            <div class="type-btn fs-26" v-for="(status,index) in statusList" :key="index" @click="changeStatusIndex(index)" :class='{ "curren-style":index===statusIndex}'>{{status.name}}</div>
        </div>

        <van-action-sheet v-model="startShow">
            <div class="content">
                <van-datetime-picker v-model="startDate" type="date" @cancel="startShow=false" @confirm="startConfirm" confirm-button-text="OK" cancel-button-text="cancel"/>
            </div>
        </van-action-sheet>
        <van-action-sheet v-model="endShow">
            <div class="content">
                <van-datetime-picker v-model="endDate" type="date" @cancel="endShow=false" @confirm="endConfirm" confirm-button-text="OK" cancel-button-text="cancel"/>
            </div>
        </van-action-sheet>
        
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            startDate: '',
            startTxt:'',
            endTxt:'',
            endDate: new Date(),
            startShow:false,
            endShow:false,
            typeList:[
                {name:'All',stype:0},
                {name:'Sales Delivery',stype:1},
                {name:'Goods returned from warehouse',stype:2}
            ],
            statusList:[
                {name:'All',stype:0},
                {name:'error',stype:1},
                {name:'success',stype:2},
                {name:'processed',stype:3}
            ],
            currenIndex:0,
            statusIndex:0
        };
    },
    computed: {

    },
    created() {

    },
    mounted() {

    },
    watch: {

    },
    methods: {
        //选择类型
        changeIndex(index){
            this.currenIndex = index
        },
        //选择类型
        changeStatusIndex(index){
            this.statusIndex = index
        },
        //选择开始时间
        startConfirm(time){
            time=time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
            this.startTxt = time
            this.startShow = false
        },
        //选择结束时间
        endConfirm(time){
            time=time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
            this.endTxt = time
            this.endShow = false
        },
        //重置
        reset(){
            this.startTxt = '';
            this.endTxt = '';
            this.currenIndex = 0;
            this.statusIndex = 0;
        },
        //确定
        submit(){
            let data = {
                startTxt:this.startTxt,
                endTxt:this.endTxt,
                currenIndex:this.currenIndex,
                statusIndex:this.statusIndex
            }
            this.$emit('reportData',data)
        },
        //关闭筛选
        close(){
            this.$emit('closeScreen')
        }
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.nosaomiao-header{
    width: 100%;
    height: 88px;
    position: fixed;
    top:0;
    line-height: 88px;
    box-sizing: border-box;
    font-size: 36px;
    text-align: center;
    z-index: 1;
    background-color: #F8F8FA;
    .arrow-left{
        position: absolute;
        left:0px;
        top:50%;
        transform: translateY(-50%);
    }
}
.reporting-screen{
    padding: 64px 30px 0;
    font-size: 32px;
    color: #333;
    box-sizing: border-box;
    height: 100vh;
    position: relative;
    .xuanze{
        margin-bottom: 20px;
    }
    .start-btn{
        min-width: 280px;
        height: 58px;
        background: #F2F3F5;
        opacity: 1;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 14px;
        .riqi-img{
            width: 36px;
            height: 36px;
            float: right;
        }
    }
    .type-btn{
        min-width: 200px;
        text-align: center;
        background: #F2F3F5;
        opacity: 1;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 20px;
        margin: 20px 20px 0 0;
        &.curren-style{
            background-color: #fff;
            border: 1px solid #333;
        }
    }
    .footer-btns{
        height: 100px;
        position: absolute;
        bottom: 20px;
        width: calc(100vw - 60px);
        font-size: 30px;
        .reset-btn{
            width: 220px;
            height: 78px;
            background: #F2F3F5;
            opacity: 1;
            border-radius: 8px;
            text-align: center;
            font-size: 30px;
            line-height: 78px;
        }
        .confirm-btn{
            width: 450px;
            height: 78px;
            background: #333;
            opacity: 1;
            border-radius: 8px;
            text-align: center;
            font-size: 30px;
            line-height: 78px;
            color: #fff;
        }
    }
    .m-t-60{
        margin-top: 60px;
    }
    .fs-26{
        font-size: 26px;
    }
}
</style>
