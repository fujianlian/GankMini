// pages/collect/collect.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    openid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
      this.getList()
    }
  },

  getList() {
    const db = wx.cloud.database()
    db.collection('ganks').where({
      _openid: this.data.openid,
    }).get({
      success: res => {
        this.setData({
          list: res.data
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  goDetail(event) {
    let index = event.currentTarget.dataset.index
    let content = this.data.list[index]
    wx.navigateTo({
      url: `/pages/detail/detail?id=${content.id}&desc=${content.title}&url=${content.link}&who=${content.who}&time=${content.time}&type=${content.type}&image=${content.image}&_id=${content._id}`,
    })
  },
})