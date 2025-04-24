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
    <span style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
      <a href="https://raw.githubusercontent.com/claxmo/inter-knot/main/绳网跨域助手-0.1.0.user.js" class="download-link" v-if="store.posts.length <= 0">点击下载绳网跨域助手</a>
    </span>
    <postWaterfall v-if="store.posts.length" :items="store.posts" :itemWidth="300" :itemGap="25" />
  </main>
  <p class="message" v-if="showMessage">{{ message }}</p>
</template>

<script setup>
import userInfo from './components/userInfo.vue';
import navBar from './components/navBar.vue';
import postWaterfall from './components/postWaterfall.vue';
import postDetail from './components/postDetail.vue';
import { ref, onMounted,nextTick } from 'vue';
import { useConfigStore } from './stores/config';

const store = useConfigStore();
const isLoading = ref(false);
const message = ref("");
const showMessage = ref(false);

const getNextDiscussions = async () => {
  if (store.hasNextPage === false) {
    message.value = "已经到底了···\\[ O_X ]/";
    return;
  }
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  message.value = "正在努力加载···";

  try{
    const response = await window.getDiscussions(store.endCursor);
    const discussions = response.data.repository.discussions;
    const newPosts =  discussions.nodes.filter(post => 
        !store.posts.some(existingPost => existingPost.id === post.id)
    );
    store.posts.push(...newPosts);
    store.endCursor =  discussions.pageInfo.endCursor;
    store.hasNextPage =  discussions.pageInfo.hasNextPage;
  }catch{
    console.log("获取讨论列表失败!");
  }finally{
      nextTick(() => {
        message.value = '';
        isLoading.value = false;
    });   
  }
};

const scrollHandle = async (e) => {
  const target = e.target;
  const viewportHeight = target.clientHeight;
  const distanceToBottom = target.scrollHeight - (target.scrollTop + viewportHeight);
  if (distanceToBottom <= viewportHeight) {
    await getNextDiscussions();
  }
  showMessage.value = distanceToBottom <= 32;
};

onMounted(async () => {
  window.addEventListener('resize',scrollHandle);
  await getNextDiscussions();
  // const intervalId = setInterval(async () => { 
  //     if (store.hasNextPage === false) {
  //         clearInterval(intervalId);
  //         return;
  //     }
  //     await getNextDiscussions();

  // }, 3000);
});

</script>

<style lang="less" scoped>
.btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
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
  z-index: 10;
  position: fixed;
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 50px;
   
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

.message {
  position: fixed;
  width: 100%;
  bottom:36px;
  text-align: center;
  color: #5e5e5e;
  font-size: 24px;
  z-index: 1;

}

.download-link {
  font-size: 2.5rem;
  font-style: italic;
  color: #00f2ff;
  text-decoration: underline;
}

</style>