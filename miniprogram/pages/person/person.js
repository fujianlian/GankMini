// pages/person/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  copyGithub(){
    wx.setClipboardData({
      data: 'https://github.com/fujianlian',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '已复制'
            })
          }
        })
      }
    })
  },

  goAbout() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  }
})