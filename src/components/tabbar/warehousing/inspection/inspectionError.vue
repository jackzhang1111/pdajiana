<template>
  <div class="container">
    <nosaomiao-header title="Inspection Error"></nosaomiao-header>
    <div class="inspection-error">
      <p class="c-666">
        <span style="color: red">*</span>
        <span>Processing instructions</span>
      </p>
      <div class="textarea-con">
        <van-field
          v-model="message"
          rows="10"
          type="textarea"
          placeholder="Please enter abnormal inventory handling scheme"
          show-word-limit
        />
      </div>
    </div>
    <div class="submit-btn" @click="submit">submit</div>
  </div>
</template>

<script>
import nosaomiaoHeader from "@/multiplexing/nosaomiaoHeader.vue";
import { updatereportObjectApi } from "@/api/warehousing/inspection/index.js";
import { Dialog, Toast } from "vant";
export default {
  props: {},
  data() {
    return {
      message: "",
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    //稽查错误上报
    updatereportObject(data) {
      updatereportObjectApi(data).then((res) => {
        if (res.code == 0) {
          Toast("success");
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        }
      });
    },
    //提交
    submit() {
      if (!this.message) {
        Toast("Please fill in the handling instructions");
        return;
      }
      this.updatereportObject({
        reportId: this.$route.query.reportId,
        handleRemarks: this.message,
      });
    },
  },
  components: {
    nosaomiaoHeader,
  },
};
</script>

<style scoped lang="less">
.container {
  height: 100vh;
  position: relative;
}
.inspection-error {
  margin: 40px 30px;
  background-color: #fff;
  height: 600px;
  padding: 30px;
  font-size: 26px;
  border-radius: 40px;
  .textarea-con {
    margin-top: 20px;
    border: 4px solid #999;
    border-radius: 8px;
  }
}
.submit-btn {
  height: 108px;
  background-color: #000;
  color: #fff;
  font-size: 36px;
  text-align: center;
  line-height: 108px;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
