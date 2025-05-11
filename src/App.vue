<template>
  <audio ref="bgm" autoplay loop>
    <source src="@/assets/audio/三Z-STUDIO,HOYO-MiX - 夏日盛典.mp3" type="audio/mpeg">
  </audio>
  <span style="position:fixed; display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh;"  v-if="store.posts.length <= 0">
    <a style="font-size: 2.5rem; font-style: italic; text-decoration: underline; color: #10bff0" href="https://greasyfork.org/zh-CN/scripts/534939-%E7%BB%B3%E7%BD%91%E8%B7%A8%E5%9F%9F%E5%8A%A9%E6%89%8B">点击下载绳网跨域助手</a>
  </span>
  <postDetail />
  <headerContainer />
  <mainContainer />

</template>

<script setup>
import headerContainer from "@/components/headerContainer.vue";
import mainContainer from "@/components/mainContainer.vue";
import postDetail from "@/components/postDetail.vue";
import { useConfigStore } from '@/stores/config';

const store = useConfigStore();

</script>

