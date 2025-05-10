<template>
  <span style="position:fixed; display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh;"  v-if="store.posts.length <= 0">
    <a style="font-size: 2.5rem; font-style: italic; text-decoration: underline; color: #10bff0" href="https://greasyfork.org/zh-CN/scripts/534939-%E7%BB%B3%E7%BD%91%E8%B7%A8%E5%9F%9F%E5%8A%A9%E6%89%8B">点击下载绳网跨域助手</a>
  </span>
  <div class="control-container" ref="controlContainerRef">
    <queryControl />
    <div class="btn-container">
      <button class="btn" title="刷新帖子" @click="refreshDiscussions"><img src="@/assets/svg/refresh.svg"></button>
      <button class="btn" title="写帖子"><a :href="`https://github.com/${store.name}/${store.repo}/discussions/new/choose`" target="_blank"><img src="@/assets/svg/write.svg"></a></button>
      <button class="btn" title="顶部" @click="mainContainerRef.scrollTop"><img src="@/assets/svg/arrow-up.svg"></button>
    </div>
  </div>
  <postDetail />
  <headerContainer />
  <mainContainer ref="mainContainerRef" @scroll="scrollHandle"/>
  <span class="message" v-show="showMessage">{{ store.message }}</span>

</template>

<script setup>
import headerContainer from "@/components/headerContainer.vue";
import mainContainer from "@/components/mainContainer.vue";
import postDetail from "@/components/postDetail.vue";
import queryControl from "@/components/queryControl.vue";
import { nextTick, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useConfigStore } from '@/stores/config';

const store = useConfigStore();
const mainContainerRef = ref(null);
const controlContainerRef = ref(null);
const showMessage = ref(false);
let scrollTimer = null;

const scrollHandle = ({distanceToBottom}) => {
  showMessage.value = distanceToBottom <= 1;
  controlContainerRef.value.style.opacity = "0.3";
  if (scrollTimer) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    controlContainerRef.value.style.opacity = "1";
  }, 300);
};

const refreshDiscussions = async () => {
    if (store.isLoading) return;
    store.isLoading = true;
    let endCursor = null;
    let flag = true;
    let totalNewPosts = [];
    try{
        while (flag){
          const discussions = await window.getDiscussions(endCursor,store.searchQuery);
          const newPosts = discussions.nodes.filter(post => 
              !store.posts.some(existing => existing.id === post.id)
          );
          totalNewPosts.push(...newPosts);
          endCursor = discussions.pageInfo.nextCursor;
          flag = discussions.pageInfo.hasNextPage;
          useToast().info(`发现了 ${totalNewPosts.length} 篇新帖子`)      
          if (newPosts.length === 0) break;
          store.posts.unshift(...totalNewPosts);
          mainContainerRef.value.scrollTop();
        }   
    }catch{
        useToast().warning("刷新讨论列表失败!");
    }finally{
        nextTick(() => {
            store.isLoading = false;
        });
    } 
};

</script>

<style scoped lang="less">
.control-container {
  position: fixed;
  bottom: 25px;
  right: 80px;
  display: flex;
  justify-content: end;
  align-items: end;
  z-index: 10;
  transition: all 0.3s;
  .btn-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    gap: 8px;
    align-items: center;
    right: -65px;
  }

}

.message{
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 34px;
  left: 0;
  color: @font-color-secoundary;
  font-size: 1.5rem;
  z-index: 1;
}
</style>

