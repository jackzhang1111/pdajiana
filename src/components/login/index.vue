<template>
  <div class="login">
    <div class="login-top"></div>
    <div class="login-con">
      <div class="logo-wap">
        <img src="@/assets/img/logo.png" class="logo" />
      </div>
      <div class="tian">
        <div class="user-name">
          <img src="@/assets/img/user@2x.png" class="user-name-icon" />
          <div class="kuang">
            <input
              type="text"
              class="name-input"
              placeholder="phone number"
              v-model="formData.username"
            />
          </div>
        </div>
        <div class="pass-word">
          <img src="@/assets/img/password@2x.png" class="user-name-icon" />
          <div class="kuang">
            <input
              :type="inputType"
              class="name-input"
              placeholder="Password"
              v-model="formData.password"
              autocomplete="off"
            />
            <van-icon :name="eyeName" size="18" @click="iconStatus = !iconStatus" />
          </div>
        </div>
      </div>
    </div>
    <div class="login-bottom">
      <div class="mima">
        <van-checkbox v-model="checked"></van-checkbox>
        <span class="c-999">Remember password</span>
        <span class="fl-right">Forgot password?</span>
      </div>
      <div class="login-btn" @click="denglu">Log In</div>
    </div>
  </div>
</template>

<script>
import { loginApi } from "@/api/login/index.js";
import { Toast } from "vant";
export default {
  props: {},
  data() {
    return {
      checked: false,
      formData: {
        username: "",
        password: "",
      },
      eyeName: "closed-eye",
      inputType: "password",
      iconStatus: false,
    };
  },
  computed: {},
  created() {},
  mounted() {
    window.addEventListener("keyup", this.keyupEnter, false);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.keyupEnter, false);
  }, //生命周期 - 销毁之前
  destroyed() {
    window.removeEventListener("keyup", this.keyupEnter, false);
  }, //生命周期 - 销毁完成
  watch: {
    iconStatus: {
      handler: function (newVal) {
        this.eyeName = newVal ? "eye-o" : "closed-eye";
        this.inputType = newVal ? "text" : "password";
      },
    },
  },
  methods: {
    //登录
    denglu() {
      if (this.formData.username == "" || this.formData.password == "") {
        Toast("Name/Password cannot be empty");
        return;
      }
      this.login(this.formData);
    },
    //登录接口
    login(data) {
      loginApi(data).then((res) => {
        if (res.code == 0) {
          localStorage.token = res.token;
          localStorage.userinfoPda = JSON.stringify(res.user);
          // 英文版本信息
          localStorage.relateDomainListEng = JSON.stringify(res.relateDomainListEng);
          if (res.user.personnelId) {
            this.$router.push({ name: "logistics" });
          } else {
            this.$router.push({ name: "warehousing" });
          }
        }
      });
    },
    //回车键
    keyupEnter() {
      if (window.event.keyCode == 13) {
        //执行登录方法
        this.denglu();
      }
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.login {
  position: relative;
  height: 100vh;
  background-color: #fff;
  .login-top {
    height: 420px;
    width: 100vw;
    background-color: #f8f8fa;
  }
  .login-bottom {
    width: 100vw;
    .mima {
      height: 50px;
      line-height: 50px;
      font-size: 26px;
      margin: 400px 75px 0;
      position: relative;
      top: 0;
      .van-checkbox {
        display: inline-block;
        vertical-align: middle;
        margin-right: 20px;
      }
    }
    .login-btn {
      width: 600px;
      height: 88px;
      background-color: #333;
      border-radius: 44px;
      margin-left: 75px;
      font-size: 40px;
      text-align: center;
      line-height: 88px;
      color: #fff;
      margin-top: 117px;
    }
  }
  .login-con {
    width: 600px;
    background-color: #fff;
    padding-bottom: 30px;
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0px 10px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    .logo-wap {
      width: 300px;
      height: 300px;
      text-align: center;
      padding: 60px 150px 0;
      margin-bottom: 60px;
      .logo {
        padding: 50px 18px;
      }
    }
    .tian {
      padding: 0 80px 0 63px;
      .user-name,
      .pass-word {
        margin-bottom: 70px;
        .user-name-icon {
          width: 35px;
          height: 35px;
          margin-right: 32px;
          vertical-align: middle;
        }
      }
    }
    .kuang {
      width: 350px;
      height: 60px;
      border-bottom: 1px solid #dcdcdc;
      display: inline-block;
      .name-input {
        width: 280px;
        border: 0;
        font-size: 30px;
      }
    }
  }
}
</style>
