<template>
  <!-- 上架列表 -->
  <div class="shelve-list">
    <saomiao-header @search="search"></saomiao-header>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="Warehousing No.">
        <div
          @click="toPickUp(data)"
          v-for="(data,index) in dataList"
          :key="index"
          class="order-list"
        >
          <span>{{data.orderSn}}</span>
          <div class="fl-right">
            <van-checkbox v-model="data.checked"></van-checkbox>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <zhezhao v-if="zhezhaoStatus">
      <div class="tishikuang">
        <img src="@/assets/img/icon-03@2x.png" class="xiaolian" />
        <div class="zigao">
          Sorry
          <br />No results
        </div>
        <div class="qd-btn" @click="zhezhaoStatus=false">OK</div>
      </div>
    </zhezhao>
  </div>
</template>

<script>
import saomiaoHeader from "@/multiplexing/saomiaoHeader.vue";
import { waitingforlaunchorderlistApi } from "@/api/warehousing/shelve/index.js";
import zhezhao from "@/multiplexing/zhezhao.vue";
export default {
  props: {},
  data() {
    return {
      activeNames: [],
      dataList: [],
      zhezhaoStatus: false,
      getorderlistforsupplyorder:0,
      supplyorderid:0,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getorderlistforsupplyorder= this.$route.query.getorderlistforsupplyorder;
    this.supplyorderid= this.$route.query.supplyorderid;
    this.waitingforlaunchorderlist();
  },
  watch: {},
  methods: {
    search(value) {
      this.zhezhaoStatus = true;
    },
    toPickUp(orderData) {
      this.$router.replace({
        name: "shelveShelves",
        query: {
          paramId: orderData.orderId,
          typeId: 2,
          type: orderData.type,
          orderSn: orderData.orderSn,
          getorderlistforsupplyorder:this.getorderlistforsupplyorder,
          supplyorderid:this.supplyorderid,
        },
      });
    },
    waitingforlaunchorderlist() {

      var paramsPost={};
      var getorderlistforsupplyorder=0;
      getorderlistforsupplyorder=this.getorderlistforsupplyorder;
      var supplyorderid=0;
      if(getorderlistforsupplyorder==1){
        supplyorderid=this.supplyorderid;

        paramsPost.getorderlistforsupplyorder=1;
        paramsPost.supplyorderid=supplyorderid;
      }

      waitingforlaunchorderlistApi(paramsPost).then((res) => {
        if (res.code == 0) {
          this.dataList = res.Data;
        }
      });
    },
  },
  components: {
    saomiaoHeader,
    zhezhao,
  },
};
</script>

<style scoped lang="less">
.shelve-list {
  /deep/ .van-collapse-item__wrapper {
    .van-collapse-item__content {
      padding: 0;
      padding-bottom: 60px;
    }
  }
  .order-list {
    height: 70px;
    line-height: 70px;
    color: #999;
    font-size: 24px;
    border-bottom: 1px solid #999;
    padding: 0 30px;
    .fl-right {
      margin-top: 14px;
    }
  }
  .tishikuang {
    width: 520px;
    height: 600px;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    margin: 294px 115px 0;
    text-align: center;
    position: relative;
    font-size: 24px;
    .xiaolian {
      width: 220px;
      height: 220px;
      display: inline-block;
      margin-top: 130px;
      margin-bottom: 30px;
    }
    .qd-btn {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 100px;
      font-size: 40px;
      line-height: 100px;
      font-weight: 500;
    }
    .zigao {
      line-height: 36px;
      color: #666;
    }
  }
}
</style>
