// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPhoto()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  getPhoto(callback) {
    let that = this
    wx.request({
      url: `https://gank.io/api/data/福利/4/1`,
      success(res) {
        let result = res.data.results
        for (let i = 0; i < result.length; i++) {
          result[i] = result[i].url
        }
        let photoList = that.data.photoList;
        photoList = result
        that.setData({
          photoList
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  previewImg(event) {
    let target = event.currentTarget
    let current = target.dataset.current
    let urls = this.data.photoList
    wx.previewImage({
      current: current,
      urls: urls
    })
  },
})