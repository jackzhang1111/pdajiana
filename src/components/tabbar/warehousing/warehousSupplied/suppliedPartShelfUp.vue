<template>
  <!-- 上架 -->
  <div class="pick-up">
    <saomiao-header @search="search"></saomiao-header>
    <div class="pick-up-order">Warehousing No.:{{detailData.supplyStockInOrderSn}}</div>
    <div class="order-detail">
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
        <span class="header-font">{{listLength}}</span>
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
        <div class="product">
          <div class="new-printing-btn" @click="print">
            print batchNo
          </div>

          <div class="new-printing-btn" @click="printfnsku">
            print FNSKU
          </div>
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
          <van-picker
            show-toolbar
            v-if="showPicker"
            :columns="currentProduct.columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
            confirm-button-text="OK"
            cancel-button-text="Cancel"
          />
        </van-popup>
        <van-icon name="play" />
      </div>
      <div
        class="shelves-item"
        v-for="(warehouse,index) in currentProduct.warehouselist"
        :key="index"
      >
        <div class="item-title">
          <span>{{warehouse.fuseName ? warehouse.fuseName : warehouse.regionName}}</span>
          <img src="@/assets/img/lajitong.svg" @click="detailWarehouse(index,warehouse)" />
        </div>
        <div class="item-number">
          <div>{{warehouse.volume}}/{{warehouse.volume-warehouse.takeVolume}}m³</div>
          <div>{{warehouse.upItemNum*currentProduct.unitSize ? accMul(warehouse.upItemNum,currentProduct.unitSize) : 0}}m³</div>
          <div class="item-input">
            <input
              type="number"
              v-model="warehouse.upItemNum"
              @change="changNum(warehouse,'upItemNum')"
            />
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
var device = null,
  main = null,
  BluetoothAdapter = null,
  UUID = null,
  uuid = null,
  BAdapter = null,
  bluetoothSocket = null;
import saomiaoHeader from "@/multiplexing/saomiaoHeader.vue";
import { Dialog, Toast } from "vant";
import {
  getsupplyshelfuporderconfirminfoApi,
  getcanupregionlistApi,
  confirmsupplyshelfuporderApi,
} from "@/api/warehousing/warehousSupplied/index.js";
import BTool from "@/static/js/BluetoothTool.js";
export default {
  props: {},
  data() {
    return {
      listLength: 0,
      current: 1,
      detailData: {},
      currentProduct: {},
      detailedGuigeList: [
        { name: "Specifications", value: "" },
        { name: "Supplier", value: "" },
        { name: "Batch No.", value: "" },
        { name: "Qty of Warehousing", value: "" },
        { name: "FNSKU", value: "" },
        { name: "Pcs/Carton", value: "" },
        { name: "International No.", value: "" },
        { name: "Qty Shelved", value: "" },
        { name: "Type", value: "" },
        { name: "Unit Weight(kg)", value: "" },
        { name: "Warehouse", value: "" },
        { name: "Gross Weight/Carton(kg)", value: "" },
        { name: "category", value: "" },
        { name: "remaining Qty to be put on shelves", value: "" },
      ],
      productList: [
        { type: 1, name: "Supply Warehousing Order" },
        { type: 2, name: "Transfer Warehousing Order" },
        { type: 3, name: "Sales Return Warehousing Order" },
      ],
      shelvesData: {},
      productArray: [],
      showPicker: false,
      columns: [],
      goodsShelves: [], //接口货架货位
    };
  },
  computed: {
    playLeft() {
      return this.current == 1;
    },
    playRight() {
      return this.current == this.listLength;
    },
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
  mounted() {
    this.getsupplyshelfuporderconfirminfo({ orderSn: this.$route.query.orderid });
  },
  watch: {
    currentProduct: {
      handler: function (newVal) {
        this.setCurrentProduct();
      },
    },
  },
  methods: {

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
      debugger;
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

    print() {
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
        var size = `! 0 200 200 210 1\r\nBARCODE-TEXT 7 2 5\r\nBARCODE 128 1 1 50 100 80 ${this.currentProduct.batchNo}\r\nFORM\r\nPRINT\r\n`;
        bytes = plus.android.invoke(size, "getBytes", "gb18030");
        outputStream.write(bytes);
        outputStream.flush();
      } else {
        Toast("Failed Bluetooth connection");
      }
    },

    printfnsku() {
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
        var size = `! 0 200 200 210 1\r\nBARCODE-TEXT 7 2 5\r\nBARCODE 128 1 1 50 100 80 ${this.currentProduct.fnskuCode}\r\nFORM\r\nPRINT\r\n`;
        bytes = plus.android.invoke(size, "getBytes", "gb18030");
        outputStream.write(bytes);
        outputStream.flush();
      } else {
        Toast("Failed Bluetooth connection");
      }
    },

    //搜索框
    search(val) {
      this.productArray.forEach((item, index) => {
        if (item.fnskuCode == val) {
          this.current = index + 1;
          this.currentProduct = this.detailData.batchList[index];
        }
      });
    },
    //上一个
    cliPlayLeft() {
      if (this.current <= 1) return;
      this.current--;
      this.currentProduct = this.detailData.batchList[this.current - 1];
    },
    //下一个
    cliPlayRight() {
      if (this.current >= this.listLength) return;
      this.current++;
      this.currentProduct = this.detailData.batchList[this.current - 1];
    },
    //上架详情
    getsupplyshelfuporderconfirminfo(data) {
      getsupplyshelfuporderconfirminfoApi(data).then((res) => {
        if (res.code == 0) {
          this.detailData = res.orderModel;
          this.detailData.batchList.forEach((item) => {
            item.regionList = [];
          });
          this.currentProduct = res.orderModel.batchList[this.current - 1];
          this.listLength = res.orderModel.batchList.length;
          this.productArray = res.orderModel.batchList;
          this.setCurrentProduct();
          this.getcanupregionlist({
            warehouseId: this.detailData.inWarehouseId,
          });
        } else if (res.code == 3) {
          this.$router.replace({ name: "noOrder", query: { type: 3 } });
        } else if (res.code == 4) {
          this.$router.replace({ name: "noOrder", query: { type: 5 } });
        } else if (res.code == 6) {
          this.$router.replace({ name: "noOrder", query: { type: 4 } });
        } else if (res.code == 1) {
          Toast("Parameter 'request Model' Required");
        } else if (res.code == 2) {
          Toast("Warehousing Barcode Required");
        } else if (res.code == 5) {
          Toast("Nothing is pending to putaway");
        } else if (res.code == 7) {
          Toast(
            "Related Putaway Order hasn't finished. If you want to putaway here,pls cancel it on PC first."
          );
        } else {
          Toast(res.msg);
        }
      });
    },
    //当前商品基本属性
    setCurrentProduct() {
      this.detailedGuigeList[0].value = this.currentProduct.skuValuesTitleEng;
      this.detailedGuigeList[1].value = this.currentProduct.businessName;;
      this.detailedGuigeList[2].value = this.currentProduct.batchNo;
      this.detailedGuigeList[3].value = this.currentProduct.inDetailNum;
      this.detailedGuigeList[4].value = this.currentProduct.fnskuCode;
      this.detailedGuigeList[5].value = this.currentProduct.goodnumPerBox;
      this.detailedGuigeList[6].value = this.currentProduct.intCode;
      this.detailedGuigeList[7].value = this.currentProduct.hasUpDetailNum;
      this.detailedGuigeList[8].value = this.orderStatus(
        this.currentProduct.stockInOrderType,
        "productList"
      );
      this.detailedGuigeList[9].value = this.currentProduct.unitWeight;
      this.detailedGuigeList[10].value = this.currentProduct.inWarehouseName;
      this.detailedGuigeList[11].value = this.currentProduct.boxWeight;
      this.detailedGuigeList[12].value = this.currentProduct.categoryNamesRealEng;
      this.detailedGuigeList[13].value = this.currentProduct.maxCanShelfUpNum;
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
    //全部上架
    finishPicking() {
      let arr = [];
      this.shelvesData = this.$fn.deepCopy(this.detailData);
      this.shelvesData.batchList.forEach((ele) => {
        ele.warehouselist.forEach((item) => {
          let obj = {
            regionId: item.regionId,
            upItemNum: item.upItemNum,
          };
          ele.regionList.push(obj);
        });
      });
      Dialog.confirm({
        title: "tips",
        message: "Are you sure to shelve?",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
        .then(() => {
          this.confirmsupplyshelfuporder(this.shelvesData);
        })
        .catch(() => {});
    },
    //小数点计算
    accMul(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {}
      try {
        m += s2.split(".")[1].length;
      } catch (e) {}
      return (
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        Math.pow(10, m)
      );
    },
    //库区货位选择
    onConfirm(value, valueIndexs) {
      let threeShel = null,
        twoShel = null,
        currIndex = null,
        isOne = null;
      if (this.currentProduct.columns.length == 0) return;

      if(value!=null&&value.length>0&&(value[0]==null||value[0]==undefined)){
        return;
      }

      if(value!=null&&value.length>1&&(value[1]==null||value[1]==undefined)){
        return;
      }

      if(value!=null&&value.length>2&&(value[2]==null||value[2]==undefined)){
        return;
      }
      
      twoShel = this.currentProduct.columns[valueIndexs[0]].children[
        valueIndexs[1]
      ];
      threeShel = this.currentProduct.columns[valueIndexs[0]].children[
        valueIndexs[1]
      ].children[valueIndexs[2]];
      this.currentProduct.warehouselist.push(this.$fn.copy(threeShel));
      this.showPicker = false;
      this.currentProduct.columns.forEach((one, oneIndex) => {
        let oneId = one.regionId;
        one.children.forEach((two, twoIndex) => {
          two.children.forEach((three, threeIndex) => {
            if (three.regionId == threeShel.regionId) {
              currIndex = threeIndex;
              if (three.regionId == oneId) {
                //只有库区
                isOne = true;
              }
            }
          });
        });
      });
      if (currIndex != null && !isOne) {
        //货架货区
        twoShel.children.splice(valueIndexs[2], 1);
      } else {
        //只有货区
        this.currentProduct.columns.splice(valueIndexs[0], 1);
      }
    },
    //垃圾桶
    detailWarehouse(index, item) {
      Dialog.confirm({
        title: "tips",
        message: "Are you sure to delete the location?",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
        .then(() => {
          this.currentProduct.warehouselist.splice(index, 1);
          let onecolumnIndex = null,
            twocolumnIndex;
          if (item.parentRegionId) {
            this.currentProduct.columns.forEach((column, columnIndex) => {
              column.children.forEach((two, twoIndex) => {
                if (two.regionId == item.parentRegionId) {
                  onecolumnIndex = columnIndex;
                  twocolumnIndex = twoIndex;
                  item.upItemNum = 0;
                  two.children.push(item);
                }
              });
            });
            this.currentProduct.columns[onecolumnIndex].children[
              twocolumnIndex
            ].children.sort(this.$fn.compare("regionId"));
          } else {
            let ele = null;
            this.goodsShelves.forEach((good) => {
              if (good.regionId == item.regionId) {
                ele = good;
                ele.upItemNum = 0;
              }
            });
            this.currentProduct.columns.push(ele);
          }
          this.$forceUpdate();
        })
        .catch(() => {});
    },
    //更改页数
    changeInput() {
      this.current = Math.ceil(this.current);
      if (this.current > this.listLength) {
        this.current = this.listLength;
      } else if (this.current < 1) {
        this.current = 1;
      }
      this.currentProduct = this.detailData.batchList[this.current - 1];
    },
    //修改数量
    changNum(val, name) {
      //大于0
      val[name] < 0 ? (val[name] = 0) : val[name];
      //取整
      val[name] = Math.ceil(val[name]);
    },
    //通过入库仓库Id获取可上架的位置
    getcanupregionlist(data) {
      getcanupregionlistApi(data).then((res) => {
        if (res.code == 0) {
          res.Data.forEach((one, oneIndex) => {
            one.text = one.regionName;
            //货区不可摆放
            if (one.canShelf == 0) {
              if (one.children.length > 0) {
                one.children.forEach((two, twoIndex) => {
                  two.text = two.regionName;
                  if (two.children.length > 0) {
                    two.children.forEach((three, threeIndex) => {
                      three.text = three.regionName;
                      three.fuseName =
                        one.regionName +
                        "-" +
                        two.regionName +
                        "-" +
                        three.regionName;
                    });
                    if (twoIndex == one.children.length - 1) {
                      this.goodsShelves.push(one);
                    }
                  }
                });
              }
            } else {
              let obj = {
                canShelf: one.canShelf,
                children: null,
                isShelf: one.isShelf,
                parentRegionId: one.parentRegionId,
                regionId: one.regionId,
                regionName: one.regionName,
                regionNo: one.regionNo,
                regionType: one.regionType,
                text: one.regionName,
                takeVolume: one.takeVolume,
                upItemNum: one.upItemNum,
                useStatus: one.useStatus,
                volume: one.volume,
                warehouseId: one.warehouseId,
                warehouseNo: one.warehouseNo,
                warehouseType: one.warehouseType,
              };
              one.children.push({
                children: [obj],
                regionName: one.regionName,
                text: one.regionName,
              });
              this.goodsShelves.push(one);
            }
          });
          this.productArray.forEach((ele) => {
            ele.warehouselist = new Array();
            ele.columns = this.$fn.copy(this.goodsShelves);
          });
        }
      });
    },
    //供货入库确认上架（支持部分上架）
    confirmsupplyshelfuporder(data) {
      confirmsupplyshelfuporderApi(data).then((res) => {
        if (res.code == 0) {
          Toast("success");
          setTimeout(() => {
            //this.$router.go(-1);
            this.$router.push({path: '/control/warehousing'});
          }, 1500);
        } else if (res.code == -5) {
          Toast("SKU ID must be greater than 0");
        } else if (res.code == -6) {
          Toast("Product Batch Required");
        } else if (res.code == -7) {
          Toast("Unit Volume of Products cannot be less than 0");
        } else if (res.code == -8) {
          Toast("Location (Stock Area) ID must be greater than 0");
        } else if (res.code == -9) {
          Toast(
            "Total Putaway Number of Product Batches must be greater than 0"
          );
        } else if (res.code == -10) {
          Toast("Putaway Qty can not exceed than the Maximum avaliable Qty");
        } else if (res.code == -11) {
          Toast(
            "Related Putaway Order haven't finished.If you want to putaway here,pls cancel it on PC first."
          );
        } else if (res.code == -12) {
          Toast("Done in Warehoused and Putaway");
        } else if (res.code == -13) {
          Toast("Putaway Qty can not exceed than the Maximum avaliable Qty");
        } else if (res.code == -21) {
          Toast("Parameter 'Request Model' Required");
        } else if (res.code == -22) {
          Toast("Warehousing No. ID must be greater than 0");
        } else if (res.code == -23) {
          Toast("Pls Select Warehousing Products");
        } else if (res.code == -24) {
          Toast("Pls Select Warehousing Products Batch");
        } else if (res.code == 99 || res.code == 999) {
          //Toast("error");
          Toast("Frequent operation,please try again!");//请重试
        } else if (res.code == 113) {
          Toast(
            "Can't OperateThe goods at the target location are in stocktaking."
          );
        } else if (res.code == 102) {
          Toast("Putaway Qty can not exceed than the Maximum avaliable Qty");
        } else if (res.code == 106) {
          Toast(
            "The product volume exceeds the Maximum available volume of the current area.(Area available volume - volume of pending putaway products -volume of pending transfer products"
          );
        } else {
          Toast(res.msg);
        }
      });
    },
  },
  components: {
    saomiaoHeader,
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
          // border: 2px solid #dcdcdc;
          border-radius: 6px;
          vertical-align: middle;
          text-align: center;
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
        text-align: center;
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
  .shelves-place {
    height: 110px;
  }
  .btn-qbrk {
    width: 100vw;
    background-color: #333;
  }
}
.fs-18 {
  font-size: 18px;
}
.pl-30 {
  padding-left: 30px;
}

.new-printing-btn {
  /*position: absolute;
  right: 20px;
  top: 20px;*/
  height: 50px;
  border: 1px solid;
  padding: 0 10px;
  line-height: 50px;
  width: 26vw;
  text-align:center;
  margin-top:1vw;
  float:left;
  margin-right:1vw;
}

</style>
