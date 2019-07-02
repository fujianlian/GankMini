exports.install = function (Vue, options) {
  Vue.prototype.goDetail = function (content) {
    this.$router.push({
      path: '/pages/detail',
      query: {
        id: content._id,
        url: content.url,
        desc: content.desc,
        time: content.time,
        type: content.type,
        who: content.who,
        image: content.image
      }
    })
  }
  Vue.prototype.goDetailC = function (content) {
    this.$router.push({
      path: '/pages/detail',
      query: {
        _id: content._id,
        id: content.id,
        url: content.link,
        desc: content.title,
        time: content.time,
        type: content.type,
        who: content.who,
        image: content.image
      }
    })
  }
  Vue.prototype.getCurrentTime = function () {
    return Math.floor(((new Date()).getTime()) / 1000)
  }
}
