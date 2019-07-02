<template>
  <scroll-view scroll-y class='tab-wrapper'>
    <gank v-for="item in list" :key="item._id" :entity="item" :isCollect='true'>
    </gank>
  </scroll-view>
</template>

<script>
  import gank from '@/components/gank'

  export default {
    config: {
      'navigationBarTitleText': '收藏'
    },
    data () {
      return {
        list: [],
        openid: ''
      }
    },
    components: {
      gank
    },
    methods: {
      getList () {
        const db = wx.cloud.database()
        db.collection('ganks').where({
          _openid: this.openid
        }).orderBy('createTime', 'desc').get({
          success: res => {
            this.list = res.data
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

      onGetOpenid () {
        // 调用云函数
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            console.log('[云函数] [login] user openid: ', res.result.openid)
            wx.setStorageSync('openid', res.result.openid)
            this.openid = res.result.openid
            this.getList()
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      }
    },

    onShow () {
      if (this.openid) {
        this.getList()
      } else {
        try {
          let openid = wx.getStorageSync('openid')
          if (openid) {
            this.openid = openid
            this.getList()
          } else {
            this.onGetOpenid()
          }
        } catch (e) {
          console.log(e)
          this.onGetOpenid()
        }
      }
    }
  }
</script>

<style>
</style>
