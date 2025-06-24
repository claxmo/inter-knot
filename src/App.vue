<template>
  <HeaderContainer />
  <MainContainer />
  <PopupDetail :post="store.curPost" :show="store.showPopup" @hide="store.showPopup = false" @delete="(postId) => store.posts = store.posts.filter(post => post.id !== postId) "/>
  <QuerySelector 
    :items="[
      { label: '全部', query: '' },
      { label: '我的', query: store.author?.login ? `author:${store.author.login}` : '' },
      { label: '公告', query: 'category:公告' },
      { label: '委托', query: 'category:委托' },
      { label: '灌水', query: 'category:灌水' },
      { label: 'R18', query: 'category:R18' },
      { label: '常规', query: 'category:常规' },
    ]"
    @change="(query) => {store.searchQuery = query}"
  />
</template>

<script setup>
import HeaderContainer from "@/components/headerContainer.vue";
import MainContainer from "@/components/mainContainer.vue";
import PopupDetail from "@/components/popupDetail.vue";
import QuerySelector from "@/components/querySelector.vue";
import { useConfigStore } from "@/stores/config";

const store = useConfigStore();

</script>


