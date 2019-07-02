<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // eslint-disable-next-line
    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }

  .tab-wrapper {
    flex-flow: column;
    height: 100vh;
    background: #f5f4f5;
  }

  .sort-items {
    margin-bottom:5rpx;
    padding: 25rpx 30rpx;
    display: flex;
    flex-flow: column;
    background: white;
  }

  .sort-item-image {
    width: 170rpx;
    height: 130rpx;
    margin-left: 20rpx;
  }

  .sort-item-texts {
    display: flex;
    align-items: center;
  }

  .sort-item-title {
    flex-grow: 1;
    opacity: 0.8;
    font-size: 28rpx;
    line-height: 40rpx;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .sort-item-date-wrapper {
    display: flex;
  }

  .sort-item-who {
    margin-top: 20rpx;
    opacity: 0.5;
    font-size: 24rpx;
    line-height: 28rpx;
  }

  .sort-item-date {
    flex: 1;
    text-align: right;
    opacity: 0.5;
    margin-top: 20rpx;
    font-size: 24rpx;
    line-height: 28rpx;
  }
</style>
