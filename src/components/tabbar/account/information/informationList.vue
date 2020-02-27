<template>
    <div class="information-list">
        <nosaomiao-header></nosaomiao-header>
        <div class="option-list">
            <div class="option-item">
                <span>Name</span>
                <div class="fl-right">{{userinfoPda.username}}</div>
            </div>
            <div class="option-item">
                <span>Gender</span>
                <div class="fl-right">{{userinfoPda.sextxt}}</div>
            </div>
            <!-- <div class="option-item" @click="$router.push({name:'currentPhone'})"> -->
            <div class="option-item">
                <span>Phone</span>
                <div class="fl-right">
                    <span>{{userinfoPda.mobile}}</span>
                    <van-icon name="arrow" size="15" class="arrow" color="#A3A3A3"/>
                </div>
            </div>
            <!-- <div class="option-item" @click="$router.push({name:'eMail'})"> -->
            <div class="option-item">
                <span>Email</span>
                <div class="fl-right">
                    <span>{{userinfoPda.email}}</span>
                    <van-icon name="arrow" size="15" class="arrow" color="#A3A3A3"/>
                </div>
            </div>
            <div class="option-item">
                <span>ID Card</span>
                <div class="fl-right">{{userinfoPda.idnumber}}</div>
            </div>
            <!-- <div class="option-item" @click="$router.push({name:'where'})">
                <span>居住地址</span>
                <div class="fl-right">
                    <van-icon name="arrow" size="15" class="arrow" color="#A3A3A3"/>
                </div>
            </div> -->
            <div class="option-item">
                <span>Position</span>
                <div class="fl-right">{{userinfoPda.position}}</div>
            </div>
            <div class="option-item">
                <span>Logistics Agency</span>
                <div class="fl-right">{{userinfoPda.carrierBusinessName}}</div>
            </div>
            
        </div>
    </div>
</template>

<script>
import nosaomiaoHeader from '@/multiplexing/nosaomiaoHeader.vue'
export default {
    props: {

    },
    data() {
        return {
            userinfoPda:{}
        };
    },
    computed: {

    },
    created() {

    },
    mounted() {
        this.userinfoPda = JSON.parse(localStorage.userinfoPda)
    },
    watch: {

    },
    methods: {

    },
    components: {
        nosaomiaoHeader
    },
};
</script>

<style scoped lang="less">
.information-list{
    .option-list{
        .option-item{
            height: 100px;
            line-height: 100px;
            padding: 0 30px;
            font-size: 30px;
            border-bottom: 1px solid #DCDCDC;
            .arrow{
                vertical-align: middle;
                margin-left:27px;
            }
        }
    }
}
</style>
