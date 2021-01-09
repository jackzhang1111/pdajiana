<template>
  <div class="order-input">
    <nosaomiao-header></nosaomiao-header>
    <div class="input-line">
      <input type="text" placeholder="Enter the barcode" v-model="orderNum" />
    </div>
    <div class="qd-btn" @click="submit">Confirm</div>
  </div>
</template>

<script>
import nosaomiaoHeader from "@/multiplexing/nosaomiaoHeader.vue";
import {
  pdascanningordernoinApi,
  pdascanningordernooutApi,
  checkbarcodesourceApi
} from "@/api/warehousing/warehousSupplied/index.js";
import { Dialog, Toast } from "vant";
export default {
  props: {},
  data() {
    return {
      orderNum: "",
      code: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.code = this.$route.query.code;
  },
  watch: {},
  methods: {
    //PDA扫描入库
    pdascanningordernoin(orderSn) {
      pdascanningordernoinApi({ orderSn }).then((res) => {
        if (res.code == 0) {
          if (res.Data.type == 1) {
            /*this.$router.replace({
              name: "suppliedPickUp",
              query: { orderid: res.Data.orderId, code: "sweepCode" },
            });*/
            this.$router.replace({name:'suppliedPartStockIn',query:{orderId:res.Data.orderId}})
          } else if (res.Data.type == 2) {
            this.$router.replace({
              name: "allocationInstorage",
              query: { orderid: res.Data.orderId, code: "sweepCode" },
            });
          } else if (res.Data.type == 3) {
            this.$router.replace({
              name: "warehouSalesPickUp",
              query: { backOrderId: res.Data.orderId, code: "sweepCode" },
            });
          }
        } else if (res.code == 1) {
          Toast("Inexistence! Scan again");
        } else if (res.code == 2) {
          Toast("Warehoused! No more operation");
        } else if (res.code == 3) {
          Toast("Warehoused! Please put it away");
        } else if (res.Data.type == 1 && res.code == 5) {
          Toast("Related Warehousing Order haven't confirm warehousing.If you want to warehousing here,pls cancel it on PC first.");
        } 
      });
    },
    //PDA扫描出库
    pdascanningordernoout(orderSn) {
      pdascanningordernooutApi({ orderSn }).then((res) => {
        if (res.code == 0) {
          if (res.Data.type == 1) {
            this.$router.replace({
              name: "soldRemove",
              query: { orderid: res.Data.orderId, code: "sweepCode" },
            });
          } else if (res.Data.type == 2) {
            this.$router.replace({
              name: "allocationRemove",
              query: { orderid: res.Data.orderId, code: "sweepCode" },
            });
          } else if (res.Data.type == 3) {
            this.$router.replace({
              name: "cancellationRemove",
              query: { orderid: res.Data.orderId, code: "sweepCode" },
            });
          }
        } else if (res.code == 1) {
          Toast("Inexistence! Scan again");
        } else if (res.code == 2) {
          Toast("Ex-warehoused! No more operation");
        } else if (res.code == 3) {
          Toast("Removed! Please finish the ex-warehousing");
        } else if (res.code == 4) {
          Toast("There are sales ex-warehousing orders applied for refund");
        }
      });
    },
    //根据条码格式判断入库单类型
    checkStockInOrderType(barcode){
      if(barcode==null||barcode==undefined){
        barcode='';
      }
      var barcodeStr=barcode.trim().toLowerCase();

      if((/^(bgrd)\d{22}$/).test(barcodeStr)){
        return 1;
      }

      if((/^(bgrd)\d{8}$/).test(barcodeStr)){
        return 1;
      }

      if((/^(bgr)\d{1,8}$/).test(barcodeStr)){
        return 1;
      }


      if((/^(ghrkd)\d{22}$/).test(barcodeStr)){
        return 1;
      }

      if((/^(grd)\d{8}$/).test(barcodeStr)){
        return 1;
      }

      if((/^(gr)\d{1,8}$/).test(barcodeStr)){
        return 1;
      }



      if((/^(bdrd)\d{22}$/).test(barcodeStr)){
        return 2;
      }

      if((/^(bdrd)\d{8}$/).test(barcodeStr)){
        return 2;
      }

      if((/^(bdr)\d{1,8}$/).test(barcodeStr)){
        return 2;
      }


      if((/^(dbrkd)\d{22}$/).test(barcodeStr)){
        return 2;
      }

      if((/^(dbrkd)\d{8}$/).test(barcodeStr)){
        return 2;
      }

      if((/^(dr)\d{1,8}$/).test(barcodeStr)){
        return 2;
      }



      return -1;
    },
    submit() {
      checkbarcodesourceApi({barcode:this.orderNum}).then(res=>{
        // needJump 是否需要跳转到新的域名（1：是，0：否） 
        if(res.code===0 ){
          if(res.needJump==1){
            // type 扫码类型 barcode 条码
            window.open(`${res.jumpDomainEng}#/control/warehousing?token=${localStorage.token}&type=${this.code}&barcode=${this.orderNum}`,'_black');
            // window.location.href=`${res.jumpDomainEng}#/control/warehousing?token=${localStorage.token}&type=${that.code}&barcode=${this.orderNum}`
          }else{
            if (this.code == 1) {
              this.pdascanningordernoin(this.orderNum);
            } else if (this.code == 2) {
              this.pdascanningordernoout(this.orderNum);
            } else if (this.code == 3) {
              this.$router.replace({
                name: "orderList",
                query: { fnskuCode: this.orderNum },
              });
            } else if (this.code == 4) {
              
              /*this.$router.replace({
                name: "allUppershelf",
                query: { orderid: this.orderNum },
              });*/

              var stockInOrderType=this.checkStockInOrderType(this.orderNum);

              //Toast(stockInOrderType);

              //如果是调拨入库单
              if(stockInOrderType==2){
                this.$router.replace({
                  name: "allUppershelf",
                  query: { orderid: this.orderNum },
                });
              }
              //如果是供货入库单
              else if(stockInOrderType==1){
                this.$router.push(
                  {
                    path: '/warehousing/suppliedList/suppliedPartShelfUp', 
                    query: {
                      orderid: this.orderNum
                    }
                  }
                )
              }
              else{ 
                Toast("Warehousing Order barcode not exists");
              }

            }
          }
        }
      })
    },
  },
  components: {
    nosaomiaoHeader,
  },
};
</script>

<style scoped lang="less">
.order-input {
  padding: 0 30px;
  .input-line {
    padding: 30px;
    border-bottom: 1px solid #dcdcdc;
    margin-bottom: 60px;
    input {
      width: 100%;
      font-size: 30px;
      border: 0;
      background-color: #f8f8fa;
    }
  }
  .qd-btn {
    background-color: #333333;
    color: #fff;
    font-size: 40px;
    text-align: center;
    line-height: 88px;
    border-radius: 44px;
  }
}
</style>
