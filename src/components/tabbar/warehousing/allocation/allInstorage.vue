<template>
  <!-- 入库 -->
  <div>
    <div class="pick-up" v-show="showPickUp">
      <saomiao-header @search="search"></saomiao-header>
      <div class="pick-up-order">
        <span>Ex-warehouse No.：{{detailData.transferStockOutOrderSn}}</span>
        <span class="fl-right">{{listLength}}</span>
      </div>
      <div class="order-detail" v-if="currentArray.length > 0">
        <div class="detail-header">
          <van-icon
            name="play"
            class="play-left"
            :color="playLeft ? '#DCDCDC':'#333'"
            @click="cliPlayLeft"
          />
          <div class="num-input">
            <input type="number" v-model="current" @change="changeInput" />
          </div>
          <span class="ma-35 header-font">/</span>
          <span class="header-font">{{currentArray.length}}</span>
          <van-icon
            name="play"
            class="play-right"
            :color="playRight ? '#DCDCDC':'#333'"
            @click="cliPlayRight"
          />
        </div>
        <div class="order-product">
          <img :src="$webUrl+currentProduct.skuImg" />
          <div class="product">
            <p>{{currentProduct.skuName}}</p>
            <p class="guige">TSIN：{{currentProduct.tsinCode}}</p>
            <p class="c-666">FNSKU：{{currentProduct.fnskuCode}}</p>
            <p class="c-666">Seller's SKU：{{currentProduct.skuCode}}</p>
          </div>
        </div>
        <div class="detailed">
          <div
            class="detailed-item"
            v-for="(detailedGuige,index) in detailedGuigeList"
            :key="index"
          >
            <span class="c-999">{{detailedGuige.name}}</span>&nbsp;&nbsp;&nbsp;
            <span class="c-666">{{detailedGuige.value}}</span>
          </div>
          <div class="detailed-item">
            <span class="c-999">Current stock Qty</span>&nbsp;&nbsp;&nbsp;
            <input
              type="number"
              v-model="currentProduct.inDetailNum"
              style="width:50px"
              @input="changeInDetailNum(currentProduct.inDetailNum,currentProduct.batchList)"
            />
          </div>
        </div>
      </div>
      <div class="goods-shelves">
        <div class="set-shelves">
          <span @click="showPicker = true">Batch No.</span>
        </div>
        <div class="shelves-item" v-for="(batch,index) in currentProduct.batchList" :key="index">
          <div class="item-title">
            <span>Maximum Warehousing Qty:{{batch.maxCanStockInNum}}</span>
          </div>
          <div class="item-number">
            <div>
              <span>{{batch.batchNo}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span @click="see(batch)" style="color:#3983FF">see</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span
                @click="print(batch.batchNo)"
                style="color:#3983FF"
              >print</span>
            </div>
            <div class="item-input">
              <input type="number" v-model="batch.inDetailNum" />
            </div>
          </div>
        </div>
      </div>
      <div class="btns">
        <div class="btn-smtm" @click="showSweepCode(false)">Scan the Barcode</div>
        <div class="btn-qbrk" @click="outStock">Warehouse</div>
      </div>
    </div>
    <div class="shelves-place"></div>
    <div v-if="!showPickUp">
      <sweep-code @search="search" @showSweepCode="showSweepCode"></sweep-code>
    </div>
    <van-dialog
      v-model="dialogShow"
      title="Item Data"
      show-cancel-button
      confirmButtonText="OK"
      cancelButtonText="cancel"
    >
      <div class="dialog-shuxing">
        <span class="shuxing-left">Carton Qty:</span>
        <span>{{seeItem.outDetailBoxNum}}</span>
      </div>
      <div class="dialog-shuxing">
        <span class="shuxing-left">Pcs/Carton:</span>
        <span>{{seeItem.goodnumPerBox}}</span>
      </div>
      <div class="dialog-shuxing">
        <span class="shuxing-left">Unit Weight(kg):</span>
        <span>{{seeItem.unitWeight}}</span>
      </div>
      <div class="dialog-shuxing">
        <span class="shuxing-left">Gross Weight(kg):</span>
        <span>{{seeItem.boxWeight}}</span>
      </div>
      <div class="dialog-tiji">
        <div class="clearfix">
          <span class="pl-30">Product Dimensions L*W*H(cm)</span>
          <div class="fl-right">
            <span class="kuang">{{seeItem.unitLength}}</span>
            <span>X</span>
            <span class="kuang">{{seeItem.unitWidth}}</span>
            <span>X</span>
            <span class="kuang">{{seeItem.unitHeight}}</span>
          </div>
        </div>
        <div class="total">
          <span>Volume:</span>
          <span class="tijitotal">{{seeItem.unitSize}}</span>
          <span>m³</span>
        </div>
      </div>
      <div class="dialog-tiji" style="margin-bottom:20px">
        <div class="clearfix">
          <span class="pl-30">Carton Dimensions L*W*H(cm)</span>
          <div class="fl-right">
            <span class="kuang">{{seeItem.boxLength}}</span>
            <span>X</span>
            <span class="kuang">{{seeItem.boxWidth}}</span>
            <span>X</span>
            <span class="kuang">{{seeItem.boxHeight}}</span>
          </div>
        </div>
        <div class="total">
          <span>Volume:</span>
          <span class="tijitotal">{{seeItem.boxSize}}</span>
          <span>m³</span>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
var device = null,
  main = null,
  BluetoothAdapter = null,
  UUID = null,
  uuid = null,
  BAdapter = null,
  bluetoothSocket = null;
import saomiaoHeader from "@/multiplexing/saomiaoHeader.vue";
import { Dialog, Toast } from "vant";
import { scanproductbarcodeApi } from "@/api/warehousing/warehousSupplied/index.js";
import {
  gettransferinstockorderconfirminfoApi,
  confirmtransferinstockorderApi,
} from "@/api/warehousing/allocation/index.js";
import sweepCode from "./itemComponents/sweepCode.vue";
import BTool from "@/static/js/BluetoothTool.js";
export default {
  props: {},
  data() {
    return {
      dialogShow: false,
      listLength: 0,
      current: 1,
      detailData: {},
      currentProduct: {},
      detailedGuigeList: [
        { name: "Batch No.", value: "" },
        { name: "Specifications", value: "" },
        { name: "Supplier", value: "" },
        { name: "International No.", value: "" },
        { name: "Qty of Ex-warehousing", value: "" },
        { name: "type", value: "" },
        { name: "Qty of Warehousing", value: "" },
        { name: "Warehouse", value: "" },
        { name: "Remaining Qty to Shelve", value: "" },
      ],
      productList: [
        { type: 1, name: "Supply Warehousing Order" },
        { type: 2, name: "Transfer Warehousing Order" },
        { type: 3, name: "Sales Return Warehousing Order" },
      ],
      currentArray: [],
      productlist: [],
      outStockObj: {
        skuList: [],
        transferStockOutOrderId: 0,
      },
      showPickUp: true,
      seeItem: {},
    };
  },
  computed: {
    playLeft() {
      return this.current == 1;
    },
    playRight() {
      return this.current == this.currentArray.length;
    },
  },
  mounted() {
    let obj = {
      orderId: this.$route.query.orderId,
      fnskuCode: this.$route.query.fnskuCode,
    };
    this.gettransferinstockorderconfirminfo(obj);
  },
  created() {
    setTimeout(() => {
      this.getBluetooth();
    }, 500);
  },
  beforeDestroy() {
    try {
      device = null; //这里关键
      bluetoothSocket.close();
    } catch (err) {
      console.log(err, "beforeDestroy");
    }
  },
  watch: {
    currentProduct: {
      handler: function (newVal) {
        this.setCurrentProduct();
      },
    },
    productlist: {
      handler: function (newVal) {
        this.productlist.forEach((item) => {
          if (item.isShow == 1) {
            this.currentArray.push(item);
          }
        });
      },
    },
  },
  methods: {
    //搜索框
    search(val) {
      let flag = true;
      this.productlist.forEach((item, index) => {
        if (item.fnskuCode == val && item.isShow == 0) {
          item.isShow = 1;
          this.currentArray.push(item);
          this.currentProduct = this.currentArray[this.currentArray.length - 1];
          this.current = this.currentArray.length;
          flag = false;
        } else if (item.fnskuCode == val && item.isShow == 1) {
          this.currentArray.forEach((ele, eleIndex) => {
            if (ele.fnskuCode == item.fnskuCode) {
              this.current = eleIndex + 1;
              this.currentProduct = item;
              this.currentProduct.inDetailNum++;
            }
          });
          flag = false;
        }
      });
      if (flag) Toast("Invalid Item,Please Scan Others");
    },
    //上一个
    cliPlayLeft() {
      if (this.current <= 1) return;
      this.current--;
      this.currentProduct = this.currentArray[this.current - 1];
    },
    //下一个
    cliPlayRight() {
      if (this.current >= this.currentArray.length) return;
      this.current++;
      this.currentProduct = this.currentArray[this.current - 1];
    },
    //当前商品基本属性
    setCurrentProduct() {
      try {
        this.detailedGuigeList[0].value = this.currentProduct.allBatchNos;
        this.detailedGuigeList[1].value = this.currentProduct.skuValuesTitle;
        this.detailedGuigeList[2].value = this.currentProduct.businessName;
        this.detailedGuigeList[3].value = this.currentProduct.intCode;
        this.detailedGuigeList[4].value = this.currentProduct.outDetailNum;
        this.detailedGuigeList[5].value = this.orderStatus(
          this.currentProduct.stockInOrderType,
          "productList"
        );
        this.detailedGuigeList[6].value = this.currentProduct.hasInDetailNum;
        this.detailedGuigeList[7].value = this.currentProduct.inWarehouseName;
        this.detailedGuigeList[8].value = this.currentProduct.maxCanStockInNum;
      } catch (err) {
        console.log(err);
      }
    },
    //编译状态
    orderStatus(type, list) {
      let name = "";
      this[list].forEach((statu) => {
        if (statu.type == type) {
          name = statu.name;
        }
      });
      return name;
    },
    outStock() {
      Dialog.confirm({
        title: "Tips",
        message: "Are you sure to warehouse?",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
        .then(() => {
          let arr = [];
          this.currentArray.forEach((good) => {
            arr.push(good);
          });
          this.outStockObj.skuList = arr;
          if (this.currentArray.length < this.listLength) {
            Dialog.confirm({
              title: "Tips",
              message:
                "The product qty is insufficient. Are you sure to continue warehousing?",
              confirmButtonText: "Yes",
              cancelButtonText: "No",
            })
              .then(() => {
                this.confirmtransferinstockorder(this.outStockObj);
              })
              .catch(() => {});
          } else {
            this.confirmtransferinstockorder(this.outStockObj);
          }
        })
        .catch(() => {});
    },
    //扫描开关
    showSweepCode(flag) {
      this.showPickUp = flag;
    },
    //更改页数
    changeInput() {
      this.current = Math.ceil(this.current);
      if (this.current > this.currentArray.length) {
        this.current = this.currentArray.length;
      } else if (this.current < 1) {
        this.current = 1;
      }
      this.currentProduct = this.currentArray[this.current - 1];
    },
    //修改数量
    changNum(val, type, name) {
      //大于0
      val[name] < 0 ? (val[name] = 0) : val[name];
      if (type == "no") return;
      //取整
      val[name] = Math.ceil(val[name]);
    },
    //入库详情
    gettransferinstockorderconfirminfo(data) {
      gettransferinstockorderconfirminfoApi(data).then((res) => {
        if (res.code == 0) {
          this.detailData = res.orderModel;
          this.outStockObj.transferStockOutOrderId =
            res.orderModel.transferStockOutOrderId;
          this.productlist = res.orderModel.skuList.map((o) =>
            Object.assign({}, o)
          );
          setTimeout(() => {
            this.currentProduct = this.currentArray[this.current - 1];
          }, 0);
          this.listLength = res.orderModel.skuList.length;
        } else if (res.code == 1) {
          Toast("Parameter 'Request Model' Required");
        } else if (res.code == 2) {
          Toast("Transfer Ex-warehousing No. ID must be greater than 0");
        } else if (res.code == 3) {
          Toast("Invalid Ex-warehouseing No.");
        } else if (res.code == 4) {
          Toast("Can't Allocate,Need to finish Ex-warehousing First");
        } else if (res.code == 5) {
          Toast("None Items to be Warehousing");
        } else if (res.code == 6) {
          Toast("All Done,No need to Confirm warehousing Again");
        } else {
          Toast("error");
        }
      });
    },
    //确认调拨入库
    confirmtransferinstockorder(data) {
      confirmtransferinstockorderApi(data).then((res) => {
        if (res.code == 0) {
          Toast("Success,Print Batch No.");
          setTimeout(() => {
            Dialog.alert({
              message: `${
                JSON.parse(res.resdata).orderAidId
              },Please write the Warehouse identification on the box`,
            }).then(() => {
              this.$router.go(-1);
            });
          }, 1500);
          this.print(JSON.parse(res.resdata).orderAidSn);
        } else if (res.code == 99) {
          Toast("error");
        } else if (res.code == 101) {
          Toast(
            "The Warehousing Qty exceeds the Maximum Available Qty(Transfer Ex-warehousing Qty-Warehousing No. created Qty)"
          );
        } else if (res.code == 107) {
          Toast("All Done,No need to Confirm Again");
        } else if (res.code == 105) {
          Toast("Can't Warehousing,Need to finish Ex-warehousing First");
        } else if (res.code == -5) {
          Toast(
            "Total Warehousing Qty of Product Batch must be greater than 0"
          );
        } else if (res.code == -6) {
          Toast("The ID of transfer Ex-warehousing detail must be more than 0");
        } else if (res.code == -7) {
          Toast(
            "SKU Warehousing Qty must be equal to the sum of SKU Product Batch Warehousing Qty"
          );
        } else if (res.code == -8) {
          Toast("Warehousing Qty can not be less than 0");
        } else if (res.code == -9) {
          Toast(
            "Warehousing Qty can not exceed the Maximum Warehousing Quantity"
          );
        } else if (res.code == -21) {
          Toast("Parameter 'Request Model' Required");
        } else if (res.code == -22) {
          Toast("Transfer Ex-warehousing No. ID must be greater than 0");
        } else if (res.code == -23) {
          Toast("Pls Select Warehousing Products");
        } else if (res.code == -24) {
          Toast("Pls Select Warehousing Products Batch");
        } else {
          Toast(res.msg);
        }
      });
    },
    //查看
    see(item) {
      this.seeItem = item;
      this.dialogShow = true;
    },
    //初始化打印机参数
    getReady() {
      main = plus.android.runtimeMainActivity();
      BluetoothAdapter = plus.android.importClass(
        "android.bluetooth.BluetoothAdapter"
      );
      UUID = plus.android.importClass("java.util.UUID");
      uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB"); //不需要更改
      BAdapter = BluetoothAdapter.getDefaultAdapter();
      BAdapter.cancelDiscovery(); //停止扫描
      device = BAdapter.getRemoteDevice(this.address); //这里是蓝牙打印机的蓝牙地址
      plus.android.importClass(device);
      bluetoothSocket = device.createInsecureRfcommSocketToServiceRecord(uuid);
      plus.android.importClass(bluetoothSocket);
    },
    //初始化寻找打印机参数
    getBluetooth() {
      var that = this;
      var onPlusReady = function () {
        that.bluetoothTool = BTool.BluetoothTool();
        that.bluetoothState = that.bluetoothTool.state;
        that.getPairedDevices();
      };
      if (typeof plus != "undefined") {
        onPlusReady();
      }
    },
    //获取蓝牙地址
    getPairedDevices: function () {
      try {
        this.pairedDevices = this.bluetoothTool.getPairedDevices();
        this.address = this.pairedDevices[0].address;
        this.getReady();
      } catch (error) {
        Toast("Please re-connect the Bluetooth");
        console.log(error, "error");
      }
    },
    print(data) {
      if (!bluetoothSocket.isConnected()) {
        try {
          bluetoothSocket.connect();
        } catch (error) {
          Toast("It’s disconnected with printer!Re-connecting now.");
          this.getReady();
        }
      }

      if (bluetoothSocket.isConnected()) {
        var outputStream = bluetoothSocket.getOutputStream();
        plus.android.importClass(outputStream);
        var s = plus.android.importClass("java.lang.String");
        var bytes;
        var size = `! 0 200 200 210 1\r\nBARCODE-TEXT 7 2 5\r\nBARCODE 128 1 1 50 100 80 ${data}\r\nFORM\r\nPRINT\r\n`;
        bytes = plus.android.invoke(size, "getBytes", "gb18030");
        outputStream.write(bytes);
        outputStream.flush();
      } else {
        Toast("Failed Bluetooth connection");
      }
    },
    //当前入库数量修改
    changeInDetailNum(value, list) {
      value = value.replace(/[^\d]/g, "");
      this.currentProduct.inDetailNum = value;
      if (list.length === 1) {
        list[0].inDetailNum = value;
      }
    },
  },
  components: {
    saomiaoHeader,
    sweepCode,
  },
};
</script>

<style scoped lang="less">
.pick-up {
  .pick-up-order {
    height: 68px;
    line-height: 68px;
    padding: 0 30px;
    font-size: 26px;
    color: #333;
    background-color: #fff;
    margin-bottom: 20px;
  }
  .order-detail {
    background-color: #fff;
    .detail-header {
      height: 88px;
      line-height: 88px;
      text-align: center;
      border-bottom: 1px solid #f2f3f5;
      .play-left {
        transform: rotate(180deg);
        margin-right: 30px;
      }
      .play-right {
        margin-left: 30px;
      }
      .num-input {
        width: 120px;
        height: 60px;
        display: inline-block;
        border: 1px solid #dcdcdc;
        text-align: center;
        line-height: 60px;
        input {
          width: 85%;
          height: 70%;
          border: 0;
          text-align: center;
          font-size: 34px;
        }
      }
      .ma-35 {
        margin: 0 35px;
      }
      .header-font {
        font-size: 34px;
        color: #999;
      }
    }
    .order-product {
      padding: 30px 40px 50px 30px;
      img {
        width: 140px;
        height: 140px;
        vertical-align: top;
        margin-right: 21px;
      }
      .product {
        display: inline-block;
        width: 500px;
        font-size: 26px;
        line-height: 39px;
        color: #333333;
        .guige {
          margin-top: 29px;
          font-size: 22px;
          color: #666;
        }
      }
    }
    .detailed {
      font-size: 18px;
      display: flex;
      flex-wrap: wrap;
      .detailed-item {
        width: 46%;
        padding: 20px 0px 20px 30px;
        border-bottom: 1px solid #999;
        .item-input {
          display: inline-block;
          width: 100px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px #dcdcdc solid;
          padding-top: 2px;
          input {
            width: 90%;
            height: 85%;
            border: 0;
            text-align: center;
          }
        }
      }
      .tiji {
        width: 100%;
        padding: 20px 30px 20px 0;
        overflow: hidden;
        color: #999;
        border-bottom: 1px solid #999;
        &:nth-last-child(1) {
          border: 0;
        }
        .kuang {
          display: inline-block;
          width: 80px;
          height: 40px;
          line-height: 40px;
          border: 2px solid #dcdcdc;
          border-radius: 6px;
          vertical-align: middle;
          text-align: center;
          font-size: 18px;
          input {
            width: 85%;
            height: 70%;
            border: 0;
            text-align: center;
          }
        }
        .total {
          width: 100%;
          text-align: right;
          margin-top: 25px;
          .tijitotal {
            font-size: 22px;
            color: #333;
          }
        }
      }
    }
  }
  .btns {
    width: 100vw;
    height: 110px;
    line-height: 110px;
    text-align: center;
    font-size: 40px;
    position: absolute;
    bottom: 0;
    color: #fff;
    display: flex;
  }
  .btn-qbrk {
    width: 50%;
    background-color: #333;
  }
  .btn-smtm {
    width: 50%;
    background-color: #c9c9c9;
    color: #333;
  }
  .goods-shelves {
    margin-top: 20px;
    padding: 30px 0 0;
    background-color: #fff;
    margin-bottom: 100px;
    .set-shelves {
      margin: 0 30px;
      background-color: #dddddd;
      height: 68px;
      line-height: 68px;
      text-align: center;
      font-size: 30px;
      color: #333;
      margin-bottom: 20px;
      .van-icon-play {
        transform: rotate(90deg);
      }
    }
    .shelves-item {
      padding: 30px;
      border-bottom: 1px solid #999;
      &:nth-last-child(1) {
        border: 0;
      }
      .item-title {
        padding-top: 10px;
        font-size: 26px;
        color: #333;
        // text-align: center;
        overflow: hidden;
        margin-bottom: 26px;
        img {
          width: 40px;
          vertical-align: middle;
          float: right;
        }
      }
      .item-number {
        display: flex;
        justify-content: space-between;
        font-size: 20px;
        color: #333;
        .item-input {
          width: 140px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px #dcdcdc solid;
          padding-top: 2px;
          input {
            width: 90%;
            height: 85%;
            border: 0;
            text-align: center;
          }
        }
      }
    }
  }
}
.dialog-shuxing {
  padding: 10px 20px 10px 30px;
  border-bottom: 1px solid #333;
  font-size: 24px;
  .shuxing-left {
    display: inline-block;
    width: 200px;
  }
}
.dialog-tiji {
  width: 100%;
  padding: 20px 30px 20px 0;
  overflow: hidden;
  font-size: 24px;
  border-bottom: 1px solid #999;
  &:nth-last-child(1) {
    border: 0;
  }
  .kuang {
    display: inline-block;
    width: 80px;
    height: 40px;
    line-height: 40px;
    vertical-align: middle;
    text-align: center;
    font-size: 18px;
    input {
      width: 85%;
      height: 70%;
      border: 0;
      text-align: center;
    }
  }
  .total {
    width: 100%;
    text-align: right;
    margin-top: 25px;
    .tijitotal {
      font-size: 22px;
      color: #333;
    }
  }
}
.fs-22 {
  font-size: 22px;
}
.shelves-place {
  height: 110px;
}
.pl-30 {
  padding-left: 30px;
}
</style>
