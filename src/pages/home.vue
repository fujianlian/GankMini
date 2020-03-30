<template>
  <scroll-view scroll-y class='tab-wrapper'>
    <swiper style='height:46vw' indicator-active-color="#3bb44c" indicator-color="rgba(59, 180, 76, 0.3)" indicator-dots
            autoplay circular v-bind:interval="interval" v-bind:duration="duration">
      <block v-for="photo in photoList" v-bind:key="photo">
        <swiper-item @click='previewImg(home)'>
          <img class='banner-image' v-bind:src='photo' mode='aspectFill' alt=""/>
        </swiper-item>
      </block>
    </swiper>
    <gank v-for="item in homeList" v-bind:key="item" :entity="item">
    </gank>
  </scroll-view>
</template>

<script>
  import gank from '@/components/gank'

  export default {
    mpType: 'page',
    data () {
      return {
        photoList: [],
        homeList: [],
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        circular: true,
        interval: 2000,
        duration: 500,
        openid: ''
      }
    },
    components: {
      gank
    },
    methods: {
      getPhoto () {
        this.$http.get('v2/data/category/Girl/type/Girl/page/1/count/10').then(res => {
          let result = res.data.data
          let photos = []
          for (let i = 0; i < 5; i++) {
            if (i < result.length) {
              photos[i] = result[i].url
            }
          }
          this.photoList = photos
          try {
            wx.setStorageSync('photoList', JSON.stringify(this.photoList))
            wx.setStorageSync('photoTime', this.getCurrentTime())
          } catch (e) {
            console.log(e)
          }
        }).catch(err => {
          console.log(err.status + err.message)
        })
      },

      getHome () {
        this.$http.get('v2/hot/likes/category/Article/count/10').then(res => {
          let homeList = res.data.data
          for (let i = 0; i < homeList.length; i++) {
            homeList[i].publishedAt = homeList[i].publishedAt.substring(0, 10)
          }
          this.homeList = homeList
          try {
            wx.setStorageSync('homeList', JSON.stringify(this.homeList))
            wx.setStorageSync('homeTime', this.getCurrentTime())
          } catch (e) {
            console.log(e)
          }
        }).catch(err => {
          console.log(err.status + err.message)
        })
      },

      previewImg (current) {
        let urls = this.photoList
        wx.previewImage({
          current: current,
          urls: urls
        })
      },

      onGetOpenid () {
        // 调用云函数
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            console.log('[云函数] [login] user openid: ', res.result.openid)
            wx.setStorageSync('openid', res.result.openid)
            this.openid = res.result.openid
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      }
    },

    onLoad () {
      try {
        let photoTime = wx.getStorageSync('photoTime')
        let homeTime = wx.getStorageSync('homeTime')
        let photo = wx.getStorageSync('photoList')
        let home = wx.getStorageSync('homeList')
        let openid = wx.getStorageSync('openid')
        // 如果有数据缓存，24小时内不再重新请求
        if (photo && this.getCurrentTime() - photoTime < 60 * 60 * 24) {
          this.photoList = JSON.parse(photo)
        } else {
          this.getPhoto()
        }

        if (home && this.getCurrentTime() - homeTime < 60 * 60 * 24) {
          this.homeList = JSON.parse(home)
        } else {
          this.getHome()
        }

        if (openid) {
          this.openid = openid
        } else {
          this.onGetOpenid()
        }
      } catch (e) {
        console.log(e)
        this.getPhoto()
        this.getHome()
        this.onGetOpenid()
      }
    }
  }
</script>

<style>
  .banner-image {
    width: 100vw;
  }
</style>
