<template>
  <div class='tab-wrapper'>
    <div class='content'>
      <span class='title'>{{desc}}</span>
      <span class='explan'>由于小程序暂不支持个人类型打开web-view组件，请点击下方复制按钮，到浏览器打开。</span>
      <span class='url-text'>{{url}}</span>
    </div>
    <div class='operate-card'>
      <div class='operate-btn' @click='copy'>
        <i class='iconfont iconcopy:before'></i>
        <span class='operate-text'>复制</span>
      </div>
      <div class='line'></div>
      <div v-if='isCollect' class='operate-btn' @click='collect'>
        <i class='iconfont iconstar__:before'></i>
        <span class='operate-text'>已收藏</span>
      </div>
      <div v-else class='operate-btn' @click='collect'>
        <i class='iconfont iconstar:before'></i>
        <span class='operate-text'>收藏</span>
      </div>
    </div>
  </div>
</template>

<script>
  import '../icon/iconfont.css'

  export default {
    config: {
      'navigationBarTitleText': '详情'
    },
    data () {
      return {
        _id: '',
        openid: '',
        id: '',
        url: '',
        desc: '',
        time: '',
        type: '',
        who: '',
        image: '',
        isCollect: false
      }
    },
    methods: {
      copy () {
        wx.setClipboardData({
          data: this.url,
          success: function (res) {
            wx.getClipboardData({
              success: function (res) {
                wx.showToast({
                  title: '复制成功'
                })
              }
            })
          }
        })
      },
      collect () {
        if (this.isCollect) {
          this.cancelCollect()
        } else {
          this.addCollect()
        }
      },

      addCollect () {
        const db = wx.cloud.database()
        db.collection('ganks').add({
          data: {
            id: this.id,
            title: this.desc,
            link: this.url,
            time: this.time,
            type: this.type,
            who: this.who,
            image: this.image,
            createTime: this.getCurrentTime()
          },
          success: res => {
            this._id = res._id
            this.isCollect = true
            wx.showToast({
              title: '收藏成功'
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '收藏失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      },

      cancelCollect () {
        const db = wx.cloud.database()
        db.collection('ganks').doc(this._id).remove({
          success: res => {
            wx.showToast({
              title: '已取消收藏'
            })
            this.isCollect = false
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '取消收藏失败'
            })
            console.error('[数据库] [删除记录] 失败：', err)
          }
        })
      },

      onQuery () {
        const db = wx.cloud.database()
        // 查询当前用户所有的 counters
        db.collection('ganks').where({
          _openid: this.openid,
          id: this.id
        }).get({
          success: res => {
            let result = res.data
            if (result.length > 0) {
              this.isCollect = true
              this._id = result[0]._id
            } else {
              this.isCollect = false
            }
          },
          fail: err => {
            console.log('query err:', err)
          }
        })
      },

      onGetOpenid () {
        let that = this
        // 调用云函数
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            console.log('[云函数] [login] user openid: ', res.result.openid)
            wx.setStorageSync('openid', res.result.openid)
            that.openid = res.result.openid
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      }
    },
    onLoad (options) {
      this._id = options._id === undefined ? '' : options._id
      this.isCollect = options._id !== undefined
      this.id = options.id
      this.url = options.url
      this.desc = options.desc
      this.time = options.time
      this.type = options.type
      this.who = options.who
      this.image = options.image

      try {
        let openid = wx.getStorageSync('openid')
        if (openid) {
          this.openid = openid
        } else {
          this.onGetOpenid()
        }
      } catch (e) {
        console.log(e)
        this.onGetOpenid()
      }

      if (!this.isCollect) {
        this.onQuery()
      }
    }
  }
</script>

<style>
  .content {
    display: flex;
    flex-flow: column;
    padding: 30rpx;
    background-color: white;
  }

  .title {
    font-size: 36rpx;
    line-height: 52rpx;
    color: #333;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .explan {
    margin-top: 30rpx;
    font-size: 28rpx;
    line-height: 45rpx;
    color: #666;
  }

  .url-text {
    margin-top: 30rpx;
    font-size: 24rpx;
    line-height: 38rpx;
    color: #666;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .operate-card {
    margin-top: 5rpx;
    display: flex;
    background: white;
    height: 100rpx;
    align-items: center;
  }

  .operate-btn {
    width: 374.5rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .operate-text {
    font-size: 30rpx;
    color: #3bb44c;
    margin-left: 10rpx;
  }

  .line {
    height: 60rpx;
    width: 0.5rpx;
    background: #f5f4f5
  }
</style>
