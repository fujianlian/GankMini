<template>
  <div class="sort-items" @click='isCollect?goDetailC(entity):goDetail(entity)'>
    <div class="sort-item-texts">
      <span class='sort-item-title'>{{isCollect?entity.title:entity.desc}}</span>
      <div v-if='isCollect?entity.image.length:entity.images!==undefined'>
        <img class="sort-item-image" :src='isCollect?entity.image:entity.images[0]' mode='aspectFill' alt=""/>
      </div>
    </div>
    <div class='sort-item-date-wrapper'>
      <span class="sort-item-who">{{entity.author}} · {{entity.type}}</span>
      <span class="sort-item-date">{{isCollect?entity.time:entity.publishedAt}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['entity', 'isCollect']
  }
</script>

<style>
</style>
