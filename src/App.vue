<template>
  <audio ref="bgm" loop>
    <source src="./assets/audio/三Z-STUDIO,HOYO-MiX - 夏日盛典.mp3" type="audio/mpeg">
  </audio>
  <div class="btn-container" ref="btnContainer">
    <span class="btn" title="刷新帖子" @click="refreshDiscussions"><img src="./assets/svg/refresh.svg"></span>
    <a
      class="btn" 
      title="写帖子" 
      href="https://github.com/claxmo/inter-knot/discussions/new/choose" 
      target="_blank"><img src="./assets/svg/write.svg">
    </a>
    <span class="btn" title="顶部" @click="scrollTop"><img src="./assets/svg/arrow-up.svg"></span>

  </div>
  <postDetail />
  <header>
    <div style="display: flex; justify-content: center; align-items: center; gap: 5px;">
      <userInfo />  
      <span class="btn" @click="toggleMusic">
        <img src="./assets/svg/volume-2.svg" v-if="isPlaying">
        <img src="./assets/svg/volume-x.svg" v-else>
      </span>
    </div>
    <navBar />
  </header>
  <main @scroll="scrollHandle" ref="mainContainer">
    <span style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;"  v-if="store.posts.length <= 0">
      <a href="https://raw.githubusercontent.com/claxmo/inter-knot/main/绳网跨域助手-0.1.0.user.js" class="download-link">点击下载绳网跨域助手</a>
    </span>
    <postWaterfall v-if="store.posts.length" :items="store.posts" :itemWidth="300" :itemGap="25" :refreshFlag="store.refreshPostFlag" />
  </main>
  <span class="message" v-show="distanceToBottom <= 1">{{ message }}</span>
</template>

<script setup>
import userInfo from './components/userInfo.vue';
import navBar from './components/navBar.vue';
import postWaterfall from './components/postWaterfall.vue';
import postDetail from './components/postDetail.vue';
import { ref, onMounted,nextTick, onUnmounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useConfigStore } from './stores/config';

const store = useConfigStore();
const isLoading = ref(false);
const mainContainer = ref(null);

const message = computed(() => {
  if (isLoading.value) {
    return '正在努力加载···'
  } else if (store.hasNextPage === false) {
    return '已经到底了···\\[ O_X ]/'
  } else {
    return ''
  }
})

const fetchDiscussions = async (cursor = null) => {
  const response = await window.getDiscussions(cursor);
  const discussions = response.data.repository.discussions;
  return {
    posts: discussions.nodes,
    endCursor: discussions.pageInfo.endCursor,
    hasNextPage: discussions.pageInfo.hasNextPage
  };
};

const deduplicatePosts = (newPosts, existingPosts) => {
  return newPosts.filter(post => 
    !existingPosts.some(existing => existing.id === post.id)
  );
};


const getNextDiscussions = async () => {
  if (isLoading.value || store.hasNextPage === false) return;
  isLoading.value = true;
  try{
    const {posts, endCursor, hasNextPage} = await fetchDiscussions(store.endCursor);
    store.posts.push(...deduplicatePosts(posts, store.posts));
    store.endCursor =  endCursor;
    store.hasNextPage =  hasNextPage;
  }catch{
    useToast().warning("获取讨论列表失败!");
  }finally{
      nextTick(() => {
        isLoading.value = false;
    });   
  }
};

const refreshDiscussions = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let endCursor = null;
  let flag = true;
  let totalNewPosts = [];
  try{
    while (flag){
      const {posts, endCursor: nextCursor, hasNextPage} = await fetchDiscussions(endCursor);
      const newPosts = deduplicatePosts(posts, [...totalNewPosts, ...store.posts]);
      totalNewPosts.push(...newPosts);
      endCursor = nextCursor;
      flag = hasNextPage;
      useToast().info(`发现了 ${totalNewPosts.length} 篇新帖子`)      
      if (newPosts.length === 0) break;
        
      store.posts.unshift(...totalNewPosts);
      scrollTop();
    }   
  }catch{
    useToast().warning("刷新讨论列表失败!");
  }finally{
    nextTick(() => {
      isLoading.value = false;
    });
  } 
};

const scrollTop = () => {
  mainContainer.value.scrollTo({top: 0, behavior: 'smooth'});

};

const btnContainer = ref(null);
const distanceToBottom = ref(null);
let scrollTimer = null;

const scrollHandle = (e) => {
  const target = e.target;
  const viewportHeight = target.clientHeight;
  distanceToBottom.value = target.scrollHeight - (target.scrollTop + viewportHeight);
  if (distanceToBottom.value <= viewportHeight) {
    getNextDiscussions();
  }
  btnContainer.value.style.opacity = '0.3';
  if (scrollTimer) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    btnContainer.value.style.opacity = '1';
  }, 300);
};

const bgm = ref(null);
const isPlaying = ref(false);

const toggleMusic = () => {
  if (!bgm.value) return;

  if (isPlaying.value) {
    bgm.value.pause();
  } else {
    bgm.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

onMounted(() => {
  window.addEventListener('resize',scrollHandle);
  getNextDiscussions();
});

onUnmounted(() => {
  window.removeEventListener('resize',scrollHandle);
});

</script>

<style lang="less" scoped>
.btn-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  position: fixed;
  bottom: 35px;
  right: 25px;
  z-index: 10;
  transition: all 0.3s;
  }

.btn {
    height: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 3px solid @color-black;
    background: linear-gradient(#212121, #141414);
    box-shadow: inset 0 2px 2px #313431, inset 0 -2px 2px #181818;
    transition: all 0.3s;
    &:hover {
      border-color: @color-yellow;
    }
    img {
      width: 28px;
      height: 28px;
    }
  }

header{
  position: fixed;
  width: 100%;
  height: 90px;
  padding: 5px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;

  /* 半透明背景 + 磨砂效果 */
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.9);
}

@media (max-width: 1440px) {
    header{
        justify-content: center;
    }
}

main {
  width: 100vw;
  height: 100vh;
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('./assets/img/background.png') no-repeat center center;
  background-size: cover;
  background-position: left bottom;
  animation: bg-scroll 30s linear infinite;
  overflow-y: scroll;
  overflow-x: hidden;
  }


@keyframes bg-scroll {
    0% {
        background-position: left bottom;
    }
    100% {
        background-position: right top;
    }
}
 
.message{
  width: 100%;
  height: 75px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  left: 0;
  color: @font-color-secoundary;
  font-size: 1.5rem;
}

.download-link {
  font-size: 2.5rem;
  font-style: italic;
  color: @color-blue-light;
  text-decoration: underline;
}
</style>