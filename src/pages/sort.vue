<template>
  <div class="tab-wrapper contain">
    <scroll-view scroll-x class='top-nav-wrapper' v-bind:scroll-left="scrollLeft">
      <block v-for="(top, index) in topNavs" v-bind:key='index'>
        <div v-if="currentActiveNavIndex === index" class='tab-item active'
             @click='topNavChange(index)'>
          {{top}}
        </div>
        <div v-else class='tab-item unactive' @click='topNavChange(index)'>
          {{top}}
        </div>
      </block>
    </scroll-view>
    <swiper class="swiper-wrapper" @change="swiperChange" :current='currentActiveNavIndex'>
      <block v-for="(list,index) in newsList" v-bind:key='index'>
        <swiper-item style="overflow: scroll">
          <gank v-for="(item, index1) in list" v-bind:key="list[index1]._id" :entity="item">
          </gank>
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script>
  import gank from '@/components/gank'

  export default {
    config: {
      'navigationBarTitleText': '分类'
    },
    data () {
      return {
        /**
         * 导航数据
         */
        topNavs: ['Android', 'iOS', '前端', '拓展资源', 'App', '瞎推荐', '休息视频'],

        /**
         * 页面数据
         */
        newsList: [
          [],
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
      }
    },
    components: {
      gank
    },
    methods: {
      /**
       * 获取分类列表
       *
       * callback 请求完成回调
       */
      getList () {
        let type = this.topNavs[this.currentActiveNavIndex]
        this.$http.get('data/' + type + '/20/1').then(res => {
          let result = res.data.results
          for (let i = 0; i < result.length; i++) {
            result[i].publishedAt = result[i].publishedAt.substring(0, 10)
          }
          this.$set(this.newsList, this.currentActiveNavIndex, result)
        }).catch(err => {
          console.log(err.status + err.message)
        })
      },

      /**
       * 顶部导航改变事件，即被点击了
       * 1、如果2次点击同一个当航，则不做处理
       * 2、需要记录本次点击和上次点击的位置
       */
      topNavChange (index) {
        let currentIndex = this.currentActiveNavIndex
        if (currentIndex !== index) {
          this.currentActiveNavIndex = index
          this.prevActiveNavIndex = currentIndex
          this.judgeRequest()
        }
      },

      /**
       * swiper滑动时触发
       * 1、prevIndex != currentIndex 表示的是用手滑动 swiper组件
       * 2、prevIndex = currentIndex  表示的是通过点击顶部的导航触发的
       */
      swiperChange (e) {
        let prevIndex = this.currentActiveNavIndex
        let currentIndex = e.mp.detail.current
        this.currentActiveNavIndex = currentIndex
        if (prevIndex !== currentIndex) {
          this.prevActiveNavIndex = prevIndex
        }
        this.scrollTopNav()
        this.judgeRequest()
      },

      /**
       * 滚动顶部的导航栏
       * 1、这个地方是大致估算的
       */
      scrollTopNav () {
        /**
         * 当激活的当航小于4个时，不滚动
         */
        if (this.currentActiveNavIndex <= 3 && this.scrollLeft >= 0) {
          this.scrollLeft = 0
        } else {
          /**
           * 当超过4个时，需要判断是向左还是向右滚动，然后做相应的处理
           */
          let plus = this.currentActiveNavIndex > this.prevActiveNavIndex ? 60 : -60
          this.scrollLeft = this.scrollLeft + plus
        }
      },

      /**
       * 判断页面切换是否需要请求数据
       */
      judgeRequest () {
        if (this.newsList[this.currentActiveNavIndex].length === 0) {
          this.getList()
        }
      }
    },
    onLoad () {
      this.getList()
    }
  }
</script>

<style>
  .contain {
    display: flex;
  }

  .top-nav-wrapper {
    background-color: #3bb44c;
    white-space: nowrap;
    overflow: hidden;
  }

  .tab-item {
    display: inline-block;
    position: relative;
    margin: 20rpx 25rpx;
  }

  .active {
    color: white;
    font-size: 32rpx;
    line-height: 45rpx;
    height: 50rpx;
    border-bottom: 4rpx solid rgba(255, 255, 255, 0.8);
  }

  .unactive {
    color: white;
    font-size: 30rpx;
    line-height: 42rpx;
    opacity: 0.8;
    height: 50rpx;
  }

  .swiper-wrapper {
    flex-grow: 1;
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
  }
</style>
