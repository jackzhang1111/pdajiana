<template>
  <div class="no-order">
    <nosaomiao-header :title="detailStatus"></nosaomiao-header>
    <div>
      <van-radio-group v-model="orderNo">
        <van-radio
          :name="order.orderSn"
          v-for="(order,index) in orderList"
          :key="index"
        >{{order.orderSn}}</van-radio>
      </van-radio-group>
    </div>
    <div class="saomiao-btn" @click="toAllInstorage">
      <span>OK</span>
    </div>
  </div>
</template>

<script>
import nosaomiaoHeader from "@/multiplexing/nosaomiaoHeader.vue";
import { Dialog, Toast } from "vant";
import { getwillstockinorderlistbyfnskucodeApi } from "@/api/warehousing/allocation/index.js";
export default {
  props: {},
  data() {
    return {
      detailStatus: "Please select the document",
      orderNo: null,
      orderList: [],
    };
  },
  computed: {},
  created() {},
  mounted() {

    this.getwillstockinorderlistbyfnskucode({
      fnskuCode: this.$route.query.fnskuCode,
    });
  },
  watch: {},
  methods: {

    getOrderModel(orderSn){
      var orderSelect=null;
      for(var i=0;i<this.orderList.length;i++){
        if(this.orderList[i].orderSn==this.orderNo){
          return this.orderList[i];
        }
      }
      return null;
    },

    //去调拨入库或供货入库页面
    toAllInstorage() {

      debugger;

      var orderType='';
      var orderSelect=this.getOrderModel(this.orderNo);
      //调拨入库
      if(orderSelect!=null&&orderSelect.orderType=='DBCKD'){

        this.$router.replace({
          name: "allInstorage",
          query: {
            orderId: orderSelect.orderId,
            fnskuCode: this.$route.query.fnskuCode,
          },
        });

      }
      //供货入库
      else if(orderSelect!=null&&orderSelect.orderType=='GHD'){
        this.$router.push(
          {
            path: '/warehousing/suppliedList/suppliedPartStockIn', 
            query: {
              orderId: orderSelect.orderId,
              fnskuCode: this.$route.query.fnskuCode,
            }
          }
        )
      }
      else{
        Toast("orderSelect is null or error order type");
      }

    },
    //通过扫描得到的商品条码（fnsku条码）得到待入库的单据列表
    getwillstockinorderlistbyfnskucode(data) {
      getwillstockinorderlistbyfnskucodeApi(data).then((res) => {
        if (res.code == 0) {
          this.orderList = res.willStockInOrderList;
        } else if (res.code == 2) {
          this.$router.replace({ name: "noOrder", query: { type: 1 } });
        } else if (res.code == 3) {
          this.$router.replace({ name: "noOrder", query: { type: 1 } });
        } else if (res.code == 4) {
          this.$router.replace({ name: "noOrder", query: { type: 2 } });
        }
      });
    },
  },
  components: {
    nosaomiaoHeader,
  },
};
</script>
<style scoped lang="less">
.no-order {
  text-align: center;
  img {
    margin: 300px 0 50px;
    width: 380px;
  }
  /deep/ .van-radio-group {
    .van-radio {
      padding-left: 20px;
      height: 70px;
      border-top: 2px solid #000;
      border-bottom: 0;
      &:nth-last-child(1) {
        border-bottom: 2px solid #000;
      }
    }
  }
  .saomiao-btn {
    margin: 100px 30px 0;
    height: 88px;
    line-height: 88px;
    font-size: 36px;
    color: #fff;
    text-align: center;
    background-color: #333;
    border-radius: 44px;
  }
}
</style>

