<template>
  <div class='tab-wrapper'>
    <div class='item-card' @click='copyGithub'>
      <i class='iconfont icongithub:before'></i>
      <span class='item-text'>Github</span>
      <i class='iconfont iconyoujiantou:before'></i>
    </div>
    <a href="about" class='item-card'>
      <i class='iconfont iconguanyu:before'></i>
      <span class='item-text'>关于</span>
      <i class='iconfont iconyoujiantou:before'></i>
    </a>
    <div class='button-wrapper'>
      <div class='item-card'>
        <i class='iconfont iconedit:before'></i>
        <span class='item-text'>意见反馈</span>
        <i class='iconfont iconyoujiantou:before'></i>
      </div>
      <button class='button' open-type='feedback'></button>
    </div>
  </div>
</template>

<script>
  import '../icon/iconfont.css'

  export default {
    config: {
      'navigationBarTitleText': '我的'
    },

    methods: {
      copyGithub () {
        wx.setClipboardData({
          data: 'https://github.com/fujianlian',
          success: function () {
            wx.getClipboardData({
              success: function () {
                wx.showToast({
                  title: '已复制'
                })
              }
            })
          }
        })
      }
    }
  }
</script>

<style>
.item-card {
  display: flex;
  align-items: center;
  height: 110rpx;
  background: white;
  margin-bottom: 5rpx;
  padding: 0 30rpx;
}

.button-wrapper {
  position: relative;
}

.button {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  z-index: 99;
}

button:focus {
  outline: 0;
}

button::after {
  border: none;
}

.item-text {
  font-size: 32rpx;
  margin-left: 25rpx;
  flex-grow: 1;
}
</style>
