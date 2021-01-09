<template>
  <!-- 入库 -->
  <div>
    <div class="pick-up" v-show="showPickUp">
      <saomiao-header @search="search"></saomiao-header>
      <div class="pick-up-order">
        <span>Supply No.：{{detailData.supplyOrderSn}}</span>
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
            :key="index">
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
          <div class="detailed-item">
            <span class="c-999">Unit Weight(kg)</span>&nbsp;&nbsp;&nbsp;
            <input
              type="number"
              v-model="currentProduct.unitWeight"
              style="width:50px"
              @input="changDecimal(currentProduct,'unitWeight',3)"
            />
          </div>
          <div class="detailed-item">
            <span class="c-999">Gross Weight/Carton(kg)</span>&nbsp;&nbsp;&nbsp;
            <input
              type="number"
              v-model="currentProduct.boxWeight"
              style="width:50px"
              @input="changDecimal(currentProduct,'boxWeight',3)"
            />
            
          </div>

          <div class="tiji">
            <div class="clearfix">
                <span class="pl-30">Product Dimensions L*W*H(cm)</span>
                <div class="fl-right">
                    <div class="kuang">
                        <input type="number" v-model="currentProduct.unitLength" @input="changDecimal(currentProduct,'unitLength',1)">
                    </div>
                    <span>X</span>
                    <div class="kuang">
                        <input type="number" v-model="currentProduct.unitWidth" @input="changDecimal(currentProduct,'unitWidth',1)">
                    </div>
                    <span>X</span>
                    <div class="kuang">
                        <input type="number" v-model="currentProduct.unitHeight" @keyup="changDecimal(currentProduct,'unitHeight',1)">
                    </div>
                </div>
            </div>
            <div class="total">
                <span>Volume:</span>
                <span class="tijitotal">{{computVolume(currentProduct.unitLength,currentProduct.unitWidth,currentProduct.unitHeight)}}</span>
                <span>m³</span>
            </div>
          </div>

          <div class="tiji">
            <div class="clearfix">
                <span class="pl-30">Carton Dimensions L*W*H(cm)</span>
                <div class="fl-right">
                    <div class="kuang">
                        <input type="number" v-model="currentProduct.boxLength" @input="changDecimal(currentProduct,'boxLength',1)">
                    </div>
                    <span>X</span>
                    <div class="kuang">
                        <input type="number" v-model="currentProduct.boxWidth" @input="changDecimal(currentProduct,'boxWidth',1)">
                    </div>
                    <span>X</span>
                    <div class="kuang">
                        <input type="number" v-model="currentProduct.boxHeight" @keyup="changDecimal(currentProduct,'boxHeight',1)">
                    </div>
                </div>
            </div>
            <div class="total">
                <span>Volume:</span>
                <span class="tijitotal">{{computVolume(currentProduct.boxLength,currentProduct.boxWidth,currentProduct.boxHeight)}}</span>
                <span>m³</span>
            </div>
          </div>

        </div>
      </div>
      <div class="btns">
        <div class="btn-smtm" @click="showSweepCode(false)">Scan the Barcode</div>
        <div class="btn-qbrk" @click="inStock">Warehouse</div>
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
  getsupplyinstockorderconfirminfoApi,
  confirmsupplyinstockorderApi,
} from "@/api/warehousing/warehousSupplied/index.js";
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
        { name: "Specifications", value: "" },
        { name: "Qty Supplied", value: "" },
        { name: "Supplier", value: "" },
        { name: "Cartons Supplied", value: "" },
        { name: "Batch No.", value: "" },
        { name: "Pcs/Carton", value: "" },
        { name: "International No.", value: "" },
        { name: "Qty of Warehousing", value: "" },
        { name: "Type", value: "" },
        { name: "Warehouse", value: "" },
        { name: "Remaining Qty to Warehouse", value: "" },
      ],
      productList: [
        { type: 1, name: "Supply Warehousing Order" },
        { type: 2, name: "Transfer Warehousing Order" },
        { type: 3, name: "Sales Return Warehousing Order" },
      ],
      currentArray: [],
      productlist: [],
      supplyOrderObj: {
        batchList: [],
        supplyOrderId: 0,
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
    this.getsupplyinstockorderconfirminfo(obj);
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

        this.detailedGuigeList[0].value = this.currentProduct.skuValuesTitleEng;
        this.detailedGuigeList[1].value = this.currentProduct.detailNum;
        this.detailedGuigeList[2].value = this.currentProduct.businessName;
        this.detailedGuigeList[3].value = this.currentProduct.detailBoxNum;
        this.detailedGuigeList[4].value = this.currentProduct.batchNo;
        this.detailedGuigeList[5].value = this.currentProduct.goodnumPerBox;
        this.detailedGuigeList[6].value = this.currentProduct.intCode;
        this.detailedGuigeList[7].value = this.currentProduct.hasInDetailNum;
        this.detailedGuigeList[8].value = this.orderStatus(
          this.currentProduct.stockInOrderType,
          "productList"
        );
        this.detailedGuigeList[9].value = this.currentProduct.inWarehouseName;
        this.detailedGuigeList[10].value = this.currentProduct.maxCanStockInNum;        

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
    inStock() {
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
          this.supplyOrderObj.batchList = arr;
          if (this.currentArray.length < this.listLength) {
            Dialog.confirm({
              title: "Tips",
              message:
                "The product qty is insufficient. Are you sure to continue warehousing?",
              confirmButtonText: "Yes",
              cancelButtonText: "No",
            })
              .then(() => {
                this.confirmsupplyinstockorder(this.supplyOrderObj);
              })
              .catch(() => {});
          } else {
            this.confirmsupplyinstockorder(this.supplyOrderObj);
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
    //修改数量,digit:保留位数
    changDecimal(val,name,digit) {

      //debugger;

      var valuesInput=val[name];

      if(valuesInput==''){
        valuesInput=0;
      }

      if(valuesInput<0){
        valuesInput=0;
      }

      valuesInput=valuesInput+"";
      
      var reg = /[a-zA-Z]/g;
      valuesInput=valuesInput.replace(reg,"");
      
      switch(digit)
      {
        case 1:
          valuesInput = valuesInput.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3'); //只能输入1个小数
          break;
        case 3:
          valuesInput = valuesInput.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3'); //只能输入3个小数
          break;
        default:
          valuesInput = valuesInput.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入2个小数
          break;
      }

      val[name]=valuesInput;
    },
    //入库详情
    getsupplyinstockorderconfirminfo(data) {
      getsupplyinstockorderconfirminfoApi(data).then((res) => {
        if (res.code == 0) {
          this.detailData = res.orderModel;
          this.supplyOrderObj.supplyOrderId =
            res.orderModel.supplyOrderId;
          this.productlist = res.orderModel.batchList.map((o) =>
            Object.assign({}, o)
          );
          setTimeout(() => {
            this.currentProduct = this.currentArray[this.current - 1];
          }, 0);
          this.listLength = res.orderModel.batchList.length;
        } else if (res.code == 1) {
          Toast("Parameter 'Request Model' Required");
        } else if (res.code == 2) {
          Toast("Supply No. ID must be greater than 0");
        } else if (res.code == 3) {
          Toast("Invalid Supply No.");
        } else if (res.code == 4) {
          Toast("Can't Supply warehousing,Need to deliver the goods First");
        } else if (res.code == 5) {
          Toast("None Items to be Warehousing");
        } else if (res.code == 6) {
          Toast("All Done,No need to Confirm warehousing Again");
        } else if (res.code == 7) {
          Toast("The barcode does not exist in the supply order");
        }else if (res.code == 8) {
          Toast("All Done,No need to Confirm warehousing Again");
        }else if (res.code == 9) {
          Toast("Related Warehousing Order haven't confirm warehousing.If you want to warehousing here,pls cancel it on PC first.");
        }else {
          Toast("error");
        }
      });
    },
    //确认供货入库
    confirmsupplyinstockorder(data) {
      confirmsupplyinstockorderApi(data).then((res) => {
        if (res.code == 0) {
          //Toast("Success,Print Batch No.");
          setTimeout(() => {
            Dialog.alert({
              message: `Identification : ${
                JSON.parse(res.resdata).orderAidId
              } <br /> Please write the Warehouse identification on the box , and you can enter the identification to put the goods on the shelves !`,
            }).then(() => {
              //this.$router.go(-1);
              this.$router.push({path: '/control/warehousing'});
            });
          }, 1500);
          this.print(JSON.parse(res.resdata).orderAidSn);
        } else if (res.code == 99) {
          Toast("Frequent operation,please try again!");//请重试
        } else if (res.code == 101) {
          Toast(
            "The Warehousing Qty exceeds the Maximum Available Qty(Qty Supplied - Warehousing Order created Qty)"
          );
        } else if (res.code == 107) {
          Toast("All Done,No need to Confirm Again");
        } else if (res.code == -5) {
          Toast(
            "Total Warehousing Qty of Product Batch must be greater than 0"
          );
        } else if (res.code == -6) {
          Toast("The ID of supply detail Id must be more than 0");
        } else if (res.code == -8) {
          Toast("Warehousing Qty can not be less than 0");
        } else if (res.code == -9) {
          Toast(
            "Warehousing Qty can not exceed the Maximum Warehousing Quantity"
          );
        } else if (res.code == -21) {
          Toast("Parameter 'Request Model' Required");
        } else if (res.code == -22) {
          Toast("Supply No. ID must be greater than 0");
        } else if (res.code == -23) {
          Toast("Pls Select Warehousing Products");
        } else if (res.code == -31) {
          Toast("The supply order does not exist");
        }else if (res.code == -32) {
          Toast("Can't Supply warehousing,Need to deliver the goods First");
        }else if (res.code == -33) {
          Toast("The supply order has been put into the warehouse and put on the shelf, so there is no need to repeat the operation");
        }else if (res.code == -34) {
          Toast("All the goods have been confirmed to be put into the warehouse, so there is no need to confirm the goods to be put into the warehouse again");
        }
        
        else if (res.code == -10) {
          Toast("Gross Weight/Carton(kg) must be greater than 0");
        }

        else if (res.code == -11) {
          Toast("Carton Dimensions L*W*H(cm) must be greater than 0");
        }

        else if (res.code == -12) {
          Toast("Unit Weight(kg) must be greater than 0");
        }

        else if (res.code == -13) {
          Toast("Product Dimensions L*W*H(cm) must be greater than 0");
        }

        else if (res.code == 108) {
          Toast("The submitted goods have been confirmed to be stored in the warehouse, and there is no need to repeat the operation");
        }
        
        else {
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
      if(list!=null){
        if (list.length === 1) {
          list[0].inDetailNum = value;
        }
      }
    },
    // 浮点数数组相乘
    accMulArr(arr){
        console.log(arr);

        var m=0;
        var n=1;
        
        for(var i=0;i<arr.length;i++)
        {
          try
          {
            m+=(arr[i]+'').split(".")[1].length;
          }
          catch(e){}
        }
        
        
        for(var i=0;i<arr.length;i++)
        {
          n=(n*Number((arr[i]+'').replace(".","")));
        }
        n=n/Math.pow(10,m);
        
        return n;
    },
    //计算体积
    computVolume(length,width,height){
        //return (length*100)*(width*100)*(height*100)/Math.pow(10,12)
        var mularr=[];
        mularr.push(length);
        mularr.push(width);
        mularr.push(height);
        mularr.push(0.01);
        mularr.push(0.01);
        mularr.push(0.01);
        var volume=this.accMulArr(mularr);
        return volume;
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
