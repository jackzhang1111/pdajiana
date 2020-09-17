<template>
  <div class="no-order">
    <nosaomiao-header :title="detailStatus"></nosaomiao-header>
    <img src="@/assets/img/nosearch.png" />
    <p>{{tips}}</p>
  </div>
</template>

<script>
import nosaomiaoHeader from "@/multiplexing/nosaomiaoHeader.vue";
export default {
  props: {},
  data() {
    return {
      detailStatus: "scan result",
      tips: "",
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.$toast.clear();
    if (this.$route.query.type == 1) {
      this.tips = "Invalid Item,Please Scan Others";
    } else if (this.$route.query.type == 2) {
      this.tips = "No Need to Warehousing Please Scan Others";
    } else if (this.$route.query.type == 3) {
      this.tips = "Invalid,Please Scan Others";
    } else if (this.$route.query.type == 4) {
      this.tips = "Please warehousing first";
    } else if (this.$route.query.type == 5) {
      this.tips = "Already Shelved,No Need to Repeat";
    }
  },
  watch: {},
  methods: {},
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
}
</style>
