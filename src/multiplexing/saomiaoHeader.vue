<!--
 * @Author: your name
 * @Date: 2020-11-16 16:14:52
 * @LastEditTime: 2020-11-18 14:41:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pdajiana\src\multiplexing\saomiaoHeader.vue
-->
<template>
  <div>
    <div class="saomiao-header">
      <van-icon
        name="arrow-left"
        size="20"
        class="v-middle"
        @click="$router.go(-1)"
      />
      <van-search
        :placeholder="placeholder"
        v-model="searchName"
        class="v-middle"
        @search="onSearch"
      />
      <img src="@/assets/img/saomiao2.svg" class="v-middle" />
    </div>
    <div class="place"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder:{
      type: String,
      default: "Enter key word",
    }
  },
  data() {
    return {
      searchName: "",
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.searchName = this.value;
  },
  watch: {},
  methods: {
    //搜索
    onSearch(value) {
      this.$emit("search", value);
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.saomiao-header {
  width: 100%;
  height: 88px;
  position: fixed;
  top: 0;
  line-height: 88px;
  padding: 0 30px;
  box-sizing: border-box;
  z-index: 1;
  background-color: #f8f8fa;
  .van-search {
    display: inline-block;
    padding: 0;
    width: 550px;
    height: 58px;
    line-height: 58px;
    background: rgba(255, 255, 255, 1);
    border-radius: 29px;
    margin: 0 20px 0 10px;
    .van-search__content {
      width: 550px;
      height: 58px;
      line-height: 58px;
      background: rgba(255, 255, 255, 1);
      border-radius: 29px;
    }
  }
}
.v-middle {
  vertical-align: middle;
}
</style>
