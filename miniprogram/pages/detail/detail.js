// pages/detail/detail.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: "",
    openid: "",
    id: "",
    url: "",
    desc: "",
    time: "",
    type: "",
    who: "",
    images: "",
    isCollect: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    let url = options.url
    let desc = options.desc
    let time = options.time
    let type = options.type
    let who = options.who
    let image = options.image
    let _id = options._id === undefined ? "" : options._id
    let isCollect = options._id === undefined ? false : true
    this.setData({
      id: id,
      url: url,
      desc: desc,
      time: time,
      type: type,
      who: who,
      image: image,
      openid: app.globalData.openid,
      _id: _id,
      isCollect: isCollect
    })
    if (!isCollect) {
      this.onQuery()
    }
  },

  copy() {
    wx.setClipboardData({
      data: this.data.url,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  collect() {
    if (this.data.isCollect) {
      this.cancelCollect()
    } else {
      this.addCollect()
    }
  },

  addCollect() {
    const db = wx.cloud.database()
    db.collection('ganks').add({
      data: {
        id: this.data.id,
        title: this.data.desc,
        link: this.data.url,
        time: this.data.time,
        type: this.data.type,
        who: this.data.who,
        image: this.data.image
      },
      success: res => {
        this.setData({
          _id: res._id,
          isCollect: true
        })
        wx.showToast({
          title: '收藏成功',
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

  cancelCollect() {
    const db = wx.cloud.database()
    db.collection('ganks').doc(this.data._id).remove({
      success: res => {
        wx.showToast({
          title: '已取消收藏',
        })
        this.setData({
          isCollect: false
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '取消收藏失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },

  onQuery() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('ganks').where({
      _openid: this.data.openid,
      id: this.data.id
    }).get({
      success: res => {
        let result = res.data
        if (result.length > 0) {
          this.setData({
            isCollect: true,
            _id: result[0]._id
          })
        } else {
          this.setData({
            isCollect: false
          })
        }
      },
      fail: err => {
        console.log("query err:", err)
      }
    })
  },
})