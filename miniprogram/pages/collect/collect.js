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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.openid) {
      this.getList()
    } else {
      try {
        let openid = wx.getStorageSync('openid')
        if (openid) {
          this.setData({
            openid: openid
          })
          this.getList()
        } else {
          this.onGetOpenid()
        }
      } catch (e) {
        console.log(e)
        this.onGetOpenid()
      };
    }
  },

  getList() {
    const db = wx.cloud.database()
    db.collection('ganks').where({
      _openid: this.data.openid,
    }).orderBy('createTime', 'desc').get({
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

  onGetOpenid() {
    let that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        wx.setStorageSync('openid', res.result.openid)
        that.setData({
          openid: res.result.openid
        })
        that.getList()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})