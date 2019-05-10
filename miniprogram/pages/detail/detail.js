// pages/detail/detail.js
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
    isCollect: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    let url = options.url
    let desc = options.desc
    this.setData({
      id: id,
      url: url,
      desc: desc
    })
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
        link: this.data.url
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
    db.collection('ganks').doc("988c1b1b5cd12eae0d8c28bb31c4de80").remove({
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
        let result = JSON.stringify(res.data, null, 2)
        this.setData({
          isCollect: result.length
        })
      },
      fail: err => {

      }
    })
  },
})