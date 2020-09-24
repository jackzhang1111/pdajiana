<template>
  <!-- 调拨列表 -->
  <div class="supplied-list">
    <saomiao-header @search="search"></saomiao-header>
    <div class="commodity-tab">
      <van-tabs
        type="card"
        color="#666666"
        title-active-color="#333333"
        v-model="activeOne"
        @change="changeOneTab"
      >
        <van-tab :title="tab.name" v-for="(tab,index) in oneList" :key="index">
          <van-tabs
            type="card"
            color="#666666"
            title-active-color="#333333"
            @click="onClick"
            v-model="active"
            class="padding0"
          >
            <van-tab :title="tab.name" v-for="(tab,index) in tabList" :key="index">
              <scroll
                class="bscroll-wrapper"
                ref="wrapper"
                :data="recordGroup"
                :pulldown="pulldown"
                :pullup="pullup"
                @pulldown="_pulldown"
                @pullup="_pullup"
              >
                <div class="bscroll-con">
                  <div class="order" v-for="(data,index) in dataList" :key="index">
                    <div class="order-header">
                      <span>{{data.orderSn}}</span>
                      <div class="fl-right">
                        <span>{{orderStatus(data.orderStatus,'statusList')}}</span>
                      </div>
                    </div>
                    <div
                      class="order-con"
                      @click="toDetail(data.orderId,data.orderStatus,0)"
                      v-if="activeOne == 0"
                    >
                      <p>Type:&nbsp;&nbsp;{{orderStatus(data.typeValue,'typeStatus')}}</p>
                      <p>Out:&nbsp;&nbsp;{{data.outWarehouseName}}</p>
                      <p>In:&nbsp;&nbsp;{{data.inWarehouseName}}</p>
                      <p>Qty of Ex-warehousing:&nbsp;&nbsp;{{data.totalNum}}</p>
                    </div>
                    <div
                      class="order-con"
                      @click="toDetail(data.orderId,data.orderStatus,1)"
                      v-else
                    >
                      <p>Type:&nbsp;&nbsp;{{orderStatus(data.typeValue,'typeStatus')}}</p>
                      <p>In:&nbsp;&nbsp;{{data.inWarehouseName}}</p>
                      <p>Ex-warehouse No.:&nbsp;&nbsp;{{data.outorderSn}}</p>
                      <p>Qty of Warehousing:&nbsp;&nbsp;{{data.totalNum}}</p>
                    </div>
                    <div class="order-footer" v-if="data.orderStatus != 2">
                      <div v-if="activeOne == 0">
                        <!-- <div class="btn fl-right" v-if="data.orderStatus == 0 || data.orderStatus == 1">打印出库单</div> -->
                        <div
                          class="btn fl-right"
                          v-if="data.orderStatus == 0"
                          @click="toRemove(data.orderId)"
                        >Remove</div>
                        <div
                          class="btn fl-right"
                          v-if="data.orderStatus == 1"
                          @click="toOutstock(data.orderId)"
                        >Ex-warehouse</div>
                      </div>
                      <div v-else>
                        <!-- <div class="btn fl-right" v-if="data.orderStatus == 0 || data.orderStatus == 1">打印出库单</div> -->
                        <div
                          class="btn fl-right"
                          v-if="data.orderStatus == 0"
                          @click="toInstorage(data.orderId)"
                        >Warehouse</div>
                        <div class="btn fl-right" @click="print(data.orderAidSn)">print</div>
                        <div
                          class="btn fl-right"
                          v-if="data.orderStatus == 1"
                          @click="toUppershelf(data.orderSn)"
                        >Shelve</div>
                      </div>
                    </div>
                  </div>
                </div>
              </scroll>
            </van-tab>
          </van-tabs>
        </van-tab>
      </van-tabs>
    </div>
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
  transferinstockorderlistApi,
  transferoutstockorderlistApi,
} from "@/api/warehousing/allocation/index.js";
import BTool from "@/static/js/BluetoothTool.js";
export default {
  props: {},
  data() {
    return {
      oneList: [
        { name: "Ex-warehousing", value: -1 },
        { name: "Warehousing", value: 0 },
      ],
      tabList: [
        { name: "All", value: -1 },
        { name: "Not removed", value: 0 },
        { name: "Not ex-warehoused", value: 1 },
        { name: "Ex-warehoused", value: 2 },
        {},
      ],
      statusList: [
        { name: "Not removed", type: 0 },
        { name: "Not ex-warehoused", type: 1 },
        { name: "Ex-warehoused", type: 2 },
        {},
      ],
      typeStatus: [
        { name: "Supply Warehousing Order", type: 1 },
        { name: "Transfer Warehousing Order", type: 2 },
        { name: "Sales Return Warehousing Order", type: 3 },
        { name: "Purchasing Return Ex-warehousing Order", type: 4 },
        { name: "Sales Ex-warehousing Order", type: 5 },
        { name: "Transfer Ex-warehousing Order", type: 6 },
      ],
      activeOne: 0,
      active: 0,
      recordGroup: [],
      pulldown: true,
      pullup: true,
      guanmengou: true,
      totalCount: 0,
      dataList: [],
      formData: {
        orderSn: "",
        pdaorderStatus: -1,
        page: 1,
        limit: 10,
      },
    };
  },
  computed: {},
  created() {
    setTimeout(() => {
      this.getBluetooth();
    }, 500);
  },
  mounted() {
    if (sessionStorage.getItem("activeIndex")) {
      this.active = Number(sessionStorage.getItem("activeIndex")) + 1;
      this.activeOne = Number(sessionStorage.getItem("activeOne"));
      this.formData.pdaorderStatus = Number(
        sessionStorage.getItem("activeIndex")
      );
    }
    this.refreshOrder();
  },
  watch: {
    activeOne: {
      handler: function (newVal) {
        if (newVal == 0) {
          this.tabList[1].name = "Not removed";
          this.tabList[2].name = "Not ex-warehoused";
          this.tabList[3].name = "Ex-warehoused";

          this.statusList[0].name = "Not removed";
          this.statusList[1].name = "Not ex-warehoused";
          this.statusList[2].name = "Ex-warehoused";
        } else {
          this.tabList[1].name = "Not Stored";
          this.tabList[2].name = "Not added";
          this.tabList[3].name = "Warehoused";

          this.statusList[0].name = "Not Stored";
          this.statusList[1].name = "Not added";
          this.statusList[2].name = "Warehoused";
        }
      },
    },
  },
  methods: {
    //搜索框
    search(value) {
      this.$router.push({
        name: "allocationSearch",
        query: { expressNo: value, type: this.activeOne },
      });
    },
    //切换第一层tab
    changeOneTab(index) {
      this.active = 0;
      this.formData.pdaorderStatus = -1;
      sessionStorage.setItem("activeOne", index);
      this.pulldown = true;
      this.refreshOrder();
    },
    //切换tab
    onClick(index) {
      this.formData.pdaorderStatus = index - 1;
      sessionStorage.setItem("activeIndex", index - 1);
      this.pulldown = true;
      this.refreshOrder();
    },
    //下拉刷新
    _pulldown() {
      setTimeout(() => {
        this.refreshOrder();
      }, 500);
    },
    //上拉加载
    _pullup() {
      if (!this.pullup) return;
      //不知道为什么触发两次,使用关门狗拦截
      if (this.guanmengou) {
        this.formData.page++;
        if (this.activeOne == 0) {
          this.transferoutstockorderlist(this.formData, false);
        } else {
          this.transferinstockorderlist(this.formData, false);
        }
        this.guanmengou = false;
      }
      setTimeout(() => {
        this.guanmengou = true;
      }, 500);
    },
    //刷新页面
    refreshOrder() {
      this.formData.page = 1;
      this.formData.limit = 10;
      this.pullup = true;
      if (this.activeOne == 0) {
        this.transferoutstockorderlist(this.formData, true);
      } else {
        this.transferinstockorderlist(this.formData, true);
      }
    },
    //调拨入库列表信息接口
    transferinstockorderlist(data, flag) {
      transferinstockorderlistApi(data).then((res) => {
        if (res.code == 0) {
          if (flag) {
            this.dataList = res.Data.list;
          } else {
            this.dataList = this.dataList.concat(res.Data.list);
          }
          this.totalCount = res.Data.totalCount;
          if (this.dataList.length > 0) {
            if (this.dataList.length >= this.totalCount) {
              this.pullup = false;
            }
          } else {
            this.pulldown = false;
            this.pullup = false;
          }
        }
      });
    },
    //调拨出库列表信息接口
    transferoutstockorderlist(data, flag) {
      transferoutstockorderlistApi(data).then((res) => {
        if (res.code == 0) {
          if (flag) {
            this.dataList = res.Data.list;
          } else {
            this.dataList = this.dataList.concat(res.Data.list);
          }
          this.totalCount = res.Data.totalCount;
          if (this.dataList.length > 0) {
            if (this.dataList.length >= this.totalCount) {
              this.pullup = false;
            }
          } else {
            this.pulldown = false;
            this.pullup = false;
          }
        }
      });
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
    //去到详情
    toDetail(orderid, orderStatus, status) {
      this.$router.push({
        name: "allocationDetail",
        query: { orderid, type: orderStatus, status },
      });
    },
    //去到下架
    toRemove(orderid) {
      this.$router.push({ name: "allocationRemove", query: { orderid } });
    },
    //去出库
    toOutstock(orderid) {
      this.$router.push({ name: "allocationOutstock", query: { orderid } });
    },
    //去入库
    toInstorage(orderid) {
      this.$router.push({ name: "allocationInstorage", query: { orderid } });
    },
    //去上架
    toUppershelf(orderid) {
      this.$router.push({ name: "allUppershelf", query: { orderid } });
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
  },
  components: {
    saomiaoHeader,
  },
};
</script>

<style scoped lang="less">
.bscroll-wrapper {
  height: calc(100vh - 300px);
}
.supplied-list {
  .commodity-tab {
    /deep/ .van-tabs__content {
      position: relative;
      overflow: hidden;
    }
  }
  /deep/ .van-tabs--card {
    padding: 0 30px;
    .van-tabs__wrap {
      margin: 17px 0 20px;
    }
    .van-tabs__nav--card {
      margin: 0;
    }
    .van-tabs__nav {
      .van-tab {
        flex-basis: 20% !important;
      }
    }
  }
  .padding0 {
    padding: 0;
    /deep/ .van-tabs__nav {
      .van-tab {
        &:nth-child(1) {
          flex-basis: 15% !important;
        }
        &:nth-child(2) {
          flex-basis: 30% !important;
        }
        &:nth-child(3) {
          flex-basis: 45% !important;
        }
        &:nth-child(4) {
          flex-basis: 35% !important;
        }
        &:nth-child(5) {
          display: none;
        }
      }
    }
  }
  .order {
    background-color: #fff;
    font-size: 24px;
    overflow: hidden;
    border-bottom: 1px solid #f2f3f5;
    margin-bottom: 20px;
    .order-header {
      line-height: 40px;
      border-bottom: 1px solid #f2f3f5;
      padding: 20px 30px;
      overflow: hidden;
    }
    .order-con {
      padding: 30px 30px 19px;
      border-bottom: 1px solid #f2f3f5;
      overflow: hidden;
      p {
        font-size: 22px;
        color: #333;
        line-height: 40px;
      }
    }
    .order-footer {
      overflow: hidden;
      padding: 30px 30px 19px;
      .btn {
        height: 48px;
        border: 2px solid #666666;
        border-radius: 6px;
        line-height: 48px;
        text-align: center;
        margin-left: 20px;
        padding: 0 20px;
      }
    }
  }
}
</style>
