<template>
  <div class="sweep-code">
    <div class="fanhui">
      <van-icon name="arrow-left" color="#000" size="30" @click="$router.go(-1)" />
    </div>
    <div id="panel" v-show="panelStatus"></div>
  </div>
</template>

<script>
var scan = null;
var view = null;
var scanBarVew = null;
import { getlogisticsorderbyordersnApi } from "@/api/logistics/index.js";
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
      panelStatus: true,
      code: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    console.log('第二步');
    let query= this.$route.query
    this.code = query.code;
    console.log('323232332',query);
    // 判断是否从老版pda跳转过来自带 条码值
    if(query.barcode){
      if (this.code == 1) {
        this.pdascanningordernoin(query.barcode);
      } else if (this.code == 2) {
        this.pdascanningordernoout(query.barcode);
      } else if (this.code == 3) {
        this.$router.replace({
          name: "orderList",
          query: { fnskuCode: query.barcode },
        });
      } else if (this.code == 4) {

        var stockInOrderType=this.checkStockInOrderType(query.barcode);

        Toast(stockInOrderType);

        //如果是调拨入库单
        if(stockInOrderType==2){
          this.$router.replace({
            name: "allUppershelf",
            query: { orderid: query.barcode },
          });
        }
        //如果是供货入库单
        else if(stockInOrderType==1){
          this.$router.push(
            {
              path: '/warehousing/suppliedList/suppliedPartShelfUp', 
              query: {
                orderid: query.barcode
              }
            }
          )
        }
        else{
          Toast("Warehousing Order barcode not exists");
        }

      }
      // this.startRecognize();
    }else{
      // window.open(`http://192.168.3.59:8082/#/control/warehousing?token=${localStorage.token}&type=1&barcode=BGHD2020111810162400000389`,'_black');
      this.startRecognize();
    }
  },
  beforeDestroy() {
    this.closeScan();
    this.closeView();
  },
  watch: {},
  methods: {
    startRecognize() {
      let that = this;
      var ws = null;
      var filter = [8, 9, 10];
      scan = new plus.barcode.Barcode("panel", filter, {
        frameColor: "#00FF00",
        scanbarColor: "#00FF00",
      });
      ws = plus.webview.currentWebview();
      scan.onmarked = onmarked;
      that.startScan();
      function onmarked(type, result) {
        var text = "no: ";
        switch (type) {
          case plus.barcode.CODE128:
            text = "CODE128: ";
            break;
          case plus.barcode.CODE39:
            text = "CODE39: ";
            break;
        }
        checkbarcodesourceApi({barcode:result}).then(res=>{
          // needJump 是否需要跳转到新的域名（1：是，0：否） 
          if(res.code===0 ){
            if(res.needJump==1){
              // type 扫码类型 barcode 条码
              window.open(`${res.jumpDomainEng}#/control/warehousing?token=${localStorage.token}&type=${that.code}&barcode=${result}`,'_black');
              // window.location.href=`${res.jumpDomainEng}#/control/warehousing?token=${localStorage.token}&type=${that.code}&barcode=${result}`
            }else{
              if (that.code == 1) {
                that.pdascanningordernoin(result);
              } else if (that.code == 2) {
                that.pdascanningordernoout(result);
              } else if (that.code == 3) {
                that.$router.replace({
                  name: "orderList",
                  query: { fnskuCode: result },
                });
              } else if (that.code == 4) {

                var stockInOrderType=that.checkStockInOrderType(result);

                Toast(stockInOrderType);

                //如果是调拨入库单
                if(stockInOrderType==2){
                  that.$router.replace({
                    name: "allUppershelf",
                    query: { orderid: result },
                  });
                }
                //如果是供货入库单
                else if(stockInOrderType==1){
                  that.$router.push(
                    {
                      path: '/warehousing/suppliedList/suppliedPartShelfUp', 
                      query: {
                        orderid: result
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
        // alert(text + result);
        that.closeScan();
      }
      // 创建子窗口
      function createSubview() {
        view = new plus.nativeObj.View(
          "nbutton",
          {
            bottom: "25%",
            left: "0%",
            width: "100%",
            height: "44px",
          },
          [
            {
              tag: "font",
              id: "text",
              text: "Scan the barcode",
              textStyles: {
                color: "#FFFFFF",
              },
            },
          ]
        );
        ws.append(view);
      }
      function createView() {
        scanBarVew = new plus.nativeObj.View("test", {
          bottom: "60px",
          left: "10%",
          height: "44px",
          width: "80%",
          backgroundColor: "#fff",
        });
        scanBarVew.drawRect(
          "#fff",
          { top: "25%", left: "25%", width: "50%", height: "50%" },
          "test"
        );
        scanBarVew.drawText(
          "Manual Input",
          { bottom: "0px", height: "44px" },
          { color: "#333333" },
          "font2"
        );
        scanBarVew.show();
        scanBarVew.interceptTouchEvent(true);
        scanBarVew.addEventListener("click", function (e) {
          that.$router.replace({
            name: "orderInput",
            query: { code: that.code },
          });
        });
      }
      createSubview();
      createView();
    },
    //开始扫描
    startScan() {
      if(scan){
        scan.start();
      }
    },
    //关闭条码识别控件
    closeScan() {
      if(scan){
        scan.close();
        this.closeView();
        this.panelStatus = false;
      }
    },
    //关闭视图控件
    closeView() {
      if(view){
        view.close();
      }
      if(scanBarVew){
        scanBarVew.close();
      }
    },

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
  },
  components: {},
};
</script>

<style scoped lang="less">
.sweep-code {
  position: relative;
  .fanhui {
    height: 100px;
    padding: 30px 20px;
  }
  #panel {
    width: 100%;
    height: 92%;
    position: fixed;
    left: 0;
    top: 8%;
    background: rgba(0, 0, 0, 1);
    z-index: 9;
  }
}
</style>
