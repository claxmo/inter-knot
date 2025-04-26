<template>
  <postDetail />
  <header>
    <div style="display: flex; height: 100%; gap: 12px; align-items: center;">
      <userInfo />
      <a class="btn" 
         title="写帖子" 
         href="https://github.com/claxmo/inter-knot/discussions/new/choose" 
         target="_blank"><img src="./assets/svg/write.svg">
      </a>
    </div>
    <navBar />
  </header>
  <main @scroll="scrollHandle">
    <span style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;"  v-if="store.posts.length <= 0">
      <a href="https://raw.githubusercontent.com/claxmo/inter-knot/main/绳网跨域助手-0.1.0.user.js" class="download-link">点击下载绳网跨域助手</a>
    </span>
    <postWaterfall v-if="store.posts.length" :items="store.posts" :itemWidth="300" :itemGap="25" />
  </main>
  <span class="message" v-if="distanceToBottom <= 1">
    <p v-if="isLoading">正在努力加载···</p>
    <p v-else-if="store.hasNextPage === false">已经到底了···\[ O_X ]/</p>
  </span>
</template>

<script setup>
import userInfo from './components/userInfo.vue';
import navBar from './components/navBar.vue';
import postWaterfall from './components/postWaterfall.vue';
import postDetail from './components/postDetail.vue';
import { ref, onMounted,nextTick, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useConfigStore } from './stores/config';

const store = useConfigStore();
const isLoading = ref(false);

const getNextDiscussions = async () => {
  if (isLoading.value || store.hasNextPage === false) return;
  isLoading.value = true;
  try{
    const response = await window.getDiscussions(store.endCursor);
    const discussions = response.data.repository.discussions;
    const newPosts =  discussions.nodes.filter(post => 
        !store.posts.some(existingPost => existingPost.id === post.id)
    );
    store.posts = [...store.posts, ...newPosts];
    store.endCursor =  discussions.pageInfo.endCursor;
    store.hasNextPage =  discussions.pageInfo.hasNextPage;
  }catch{
    useToast().warning("获取讨论列表失败!");
  }finally{
      nextTick(() => {
        isLoading.value = false;
    });   
  }
};

const distanceToBottom = ref(null);

const scrollHandle = (e) => {
  const target = e.target;
  const viewportHeight = target.clientHeight;
  distanceToBottom.value = target.scrollHeight - (target.scrollTop + viewportHeight);
  if (distanceToBottom.value <= viewportHeight) {
    getNextDiscussions();
  }
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
.btn {
    height: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 3px solid #000;
    background: linear-gradient(#212121, #141414);
    box-shadow: inset 0 2px 2px #313431, inset 0 -2px 2px #181818;
    transition: all 0.3s;
    &:hover {
      border-color: yellow;
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
  p{
    color: #5e5e5e;
    font-size: 24px;
  }
}

.download-link {
  font-size: 2.5rem;
  font-style: italic;
  color: #00f2ff;
  text-decoration: underline;
}
</style>