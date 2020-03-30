// pages/sort/sort.js
const self = this

Page({
  data: {
    /** 
     * 导航数据 
     */
    topNavs: ['Android', 'iOS', 'Flutter', '前端', '后端', 'App'],

    topTypes: ['Android', 'iOS', 'Flutter', 'frontend', 'backend', 'app'],

    /** 
     * 当前页数下标
     */
    pageIndexs: [1, 1, 1, 1, 1, 1],

    /**
     * 页面数据
     */
    newsList: [
      [],
      [],
      [],
      [],
      [],
      []
    ],

    /** 
     * 当前激活的当航索引 
     */
    currentActiveNavIndex: 0,

    /** 
     * 上一个激活的当航索引 
     */
    prevActiveNavIndex: -1,

    /** 
     * scroll-view 横向滚动条位置 
     */
    scrollLeft: 0
  },

  onLoad: function(options) {
    this.getList()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    this.getList(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  /**
   * 获取分类列表
   * 
   * callback 请求完成回调
   */
  getList(callback) {
    let that = this;
    let type = this.data.topTypes[this.data.currentActiveNavIndex]
    let pageIndex = this.data.pageIndexs[this.data.currentActiveNavIndex]
    var url = ""
    if (type == "app") {
      url = `https://gank.io/api/v2/data/category/GanHuo/type/${type}/page/${pageIndex}/count/20`
    } else {
      url = `https://gank.io/api/v2/data/category/Article/type/${type}/page/${pageIndex}/count/20`
    }
    wx.request({
      url: url,
      success(res) {
        let result = res.data.data
        for (let i = 0; i < result.length; i++) {
          result[i].publishedAt = result[i].publishedAt.substring(0, 10)
        }
        let list = that.data.newsList;
        list[that.data.currentActiveNavIndex] = result
        that.setData({
          newsList: list
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  /** 
   * 顶部导航改变事件，即被点击了 
   * 1、如果2次点击同一个当航，则不做处理 
   * 2、需要记录本次点击和上次点击的位置 
   */
  topNavChange: function(e) {
    var nextActiveIndex = e.currentTarget.dataset.currentIndex,
      currentIndex = this.data.currentActiveNavIndex;
    if (currentIndex != nextActiveIndex) {
      this.setData({
        currentActiveNavIndex: nextActiveIndex,
        prevActiveNavIndex: currentIndex
      });
      this.judgeRequest()
    }
  },

  /** 
   * swiper滑动时触发 
   * 1、prevIndex != currentIndex 表示的是用手滑动 swiper组件 
   * 2、prevIndex = currentIndex  表示的是通过点击顶部的导航触发的 
   */
  swiperChange: function(e) {
    var prevIndex = this.data.currentActiveNavIndex,
      currentIndex = e.detail.current;
    this.setData({
      currentActiveNavIndex: currentIndex
    });
    if (prevIndex != currentIndex) {
      this.setData({
        prevActiveNavIndex: prevIndex
      })
    }
    this.scrollTopNav()
    this.judgeRequest()
  },

  /** 
   * 滚动顶部的导航栏 
   * 1、这个地方是大致估算的 
   */
  scrollTopNav: function() {
    /** 
     * 当激活的当航小于4个时，不滚动 
     */
    if (this.data.currentActiveNavIndex <= 3 && this.data.scrollLeft >= 0) {
      this.setData({
        scrollLeft: 0
      });
    } else {
      /** 
       * 当超过4个时，需要判断是向左还是向右滚动，然后做相应的处理 
       */
      var plus = this.data.currentActiveNavIndex > this.data.prevActiveNavIndex ? 60 : -60;
      this.setData({
        scrollLeft: this.data.scrollLeft + plus
      });
    }
  },

  /**
   * 判断页面切换是否需要请求数据
   */
  judgeRequest() {
    if (this.data.newsList[this.data.currentActiveNavIndex].length === 0) {
      this.getList()
    }
  },

  goDetail(event) {
    let index = event.currentTarget.dataset.index
    let content = this.data.newsList[this.data.currentActiveNavIndex][index]
    let image = content.images !== undefined && content.images.length ? content.images[0] : ""
    wx.navigateTo({
      url: `/pages/detail/detail?id=${content._id}&desc=${content.desc}&url=${content.url}&who=${content.who}&time=${content.publishedAt}&type=${content.type}&image=${image}`,
    })
  },
})