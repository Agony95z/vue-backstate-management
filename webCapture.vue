<template>
  <div class="" ref="submitPayModalRef" id="submitPayModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content pt-5">
        <!-- <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              @click="handleClose"
            ></button>
        </div> -->
        <div class="modal-body">
          <div class="position-relative">
            <div class="d-flex justify-content-center align-items-center">
              <video
                id="videoCamera"
                style="border-radius: 50%;"
                :width="videoWidth"
                :height="videoHeight"
                autoplay
              ></video>
              <canvas
                style="display: none;border-radius: 50%;"
                id="canvasCamera"
                :width="videoWidth"
                :height="videoHeight"
              ></canvas>
            </div>
            <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" v-if="photoFlag">
              < img :src="photoSrc" alt="" class="rounded-circle">
            </div>
            <p v-if="countDownFlag" class="text-white display-1 fw-bold position-absolute translate-middle top-50 start-50">{{second}}</p >
          </div>
          <div class="mt-4">
            <div class="d-flex justify-content-center" v-if="retErrMsg!==''">{{retErrMsg}}</div>
          </div>
          <div v-if="payErrFlag" class="text-center px-3 translate-middle top-50 start-50 position-absolute alert alert-warning alert-dismissible fade show" role="alert">
            摄像头异常，请打开摄像头或选择微信支付
          </div>
        </div>
        <div class="modal-footer justify-content-center">
          <button type="button" @click="handleClose" class="btn btn-secondary border-0">取消</button>
          <button
            type="button"
            class="btn btn-primary border-0"
            :disabled="btnNotAllowFlag"
            @click="handleScanAgain()"
          >
            <!-- <span
                :class="{
                  'spinner-border': second > 0,
                  'spinner-border-sm': second > 0,
                }"
            ></span> -->
            再次识别
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/api";
import { Base64 } from 'js-base64';
/* eslint-disable */
export default {
  data() {
    return {
      videoWidth: 250,
      videoHeight: 250,
      // imgSrc: "",
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      openVideo: false,
      payErrFlag: false,
      countDownFlag: false,
      second: 5,
      retErrMsg: '', // 人脸对比失败错误提示
      ybIcon: require("../../assets/image/pay-yb.png"),
      timeCount: 0,
      timer: null, // 定时器标志位
      photoSrc: '', // 拍照
      photoFlag: false,
      btnNotAllowFlag: true,
    };
  },
  props: {
    purchaseInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    console.log(this.purchaseInfo, '打印用户信息');
    //this.getCompetence() // 进入页面就调用摄像头
  },
  methods: {
    // 再次识别
    handleScanAgain() {
      this.photoSrc = ''; // 清空上次照片
      this.photoFlag = false; // 清空上次照片
      this.btnNotAllowFlag = true; // 再次识别按钮禁止点击
      // this.setImage();
      this.getCompetence();
    },
    // 关闭弹窗
    handleClose() {
      this.thisVideo.srcObject && this.stopNavigator(); // 关闭摄像头
      this.$emit('close');
      // this.handleRouterLink();
    },
    // 读秒倒计时
    handleCountDown() {
      this.countDownFlag = true;
      this.second = 5;
      let countDownTimer = setInterval(() => {
        this.second--;
        if (this.second <= 0) {
          clearInterval(countDownTimer);
          this.countDownFlag = false;
          this.setImage();
        }
      }, 1000)
    },
    // 设备异常提示
    deviceErrTootips() {
      this.payErrFlag = true;
    },
    // 调用权限（打开摄像头功能）
    getCompetence() {
      var _this = this;
      _this.thisCancas = document.getElementById("canvasCamera");
      _this.thisContext = this.thisCancas.getContext("2d");
      _this.thisVideo = document.getElementById("videoCamera");
      _this.thisVideo.style.display = "block";
      // 获取媒体属性，旧版本浏览器可能不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          var getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.getUserMedia;
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            //不存在则报错
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      var constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          transform: "scaleX(-1)",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in _this.thisVideo) {
            _this.thisVideo.srcObject = stream;
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream);
          }
          _this.thisVideo.onloadedmetadata = function (e) {
            _this.thisVideo.play();
            _this.handleCountDown(); // 打开倒计时提示语, 倒计时结束调用摄像头
            // _this.setImage(); // 5s后执行拍照
          };
        })
        .catch((err) => {
          _this.deviceErrTootips(); // 异常提示
        });
    },
    //  绘制图片（拍照功能）
    setImage() {
      // canvas画图
      this.thisContext.drawImage(
        this.thisVideo,
        0,
        0,
        this.videoWidth,
        this.videoHeight
      );
      // 获取图片base64链接
      let image = this.thisCancas.toDataURL("image/png");
      this.photoSrc = image;
      this.photoFlag = true;
      // 删除字符串前面的提示信息 "data:image/png;base64,"
      let img64 = image.substring(22);
      let itemData = this.purchaseInfo;
      const { transactionId } = this.$route.params;
      let params = {
        faceImage: img64,
        userName: itemData.name,
        transactionId: transactionId, // 交易流水号
        // oldTransactionId: null,
        // businessCode: '', // 赋值业务场景编码
        // encryption: '', // 业务场景编码、密钥、用户身份证号码 md5散列加密
        userId: Base64.encode(itemData.certNo), // 用户证件号 base64 证件号
      }
      this.handlePersonfacediscern(params); // 调用接口
    },
    // 路由跳转
    handleRouterLink() {
      // this.$emit('close');
      this.handleClose(); // 关闭弹窗和摄像头
      setTimeout(() => {
        const { transactionId } = this.$route.params;
        const payMode = "a"
        this.$router.push({
          path: '/order-details',
          query: {
            id: transactionId,
            pay: payMode
          }
        });
      }, 300);

    },
    // 关闭摄像头
    stopNavigator() {
      this.thisVideo.srcObject.getTracks()[0].stop();
      this.thisVideo.style.display = "none";
    },
    // 人脸识别
    handlePersonfacediscern(params) {
      return api.personfacediscern(params).then(res => {
        if (res.code === "200") {
          if (res.data.success === true) {
            this.handleRouterLink();
          }
        } else {
          this.retErrMsg = res.msg; // 错误提示信息
          this.btnNotAllowFlag = false; // 允许点击再次识别
        }
      }).finally(() => {
        this.btnNotAllowFlag = false; // 允许点击再次识别
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.order-code {
  font-size: 15px;
  color: #666666;
  letter-spacing: 1px;
  line-height: 30px;
  font-weight: 400;
  text-align: center;
}
</style>