<template>
    <main @scroll="scrollHandle" ref="mainRef">
        <Waterfall v-if="store.posts.length" :items="store.posts" :itemWidth="300" :itemGap="25" />
    </main>
    <div class="control-container" ref="controlContainerRef">
        <queryControl />
        <div class='btn-container'>
            <button class="btn" title="刷新帖子" @click="refreshDiscussions"><img src="@/assets/svg/refresh.svg"></button>
            <button class="btn" title="写帖子"><a :href="`https://github.com/${store.name}/${store.repo}/discussions/new/choose`" target="_blank"><img src="@/assets/svg/write.svg"></a></button>
            <button class="btn" title="顶部" @click="scrollTop"><img src="@/assets/svg/arrow-up.svg"></button>
        </div>
    </div> 
    <span class="message" v-show="distanceToBottom <= 10">{{ store.message }}</span>

</template>

<script setup>
import Waterfall from "@/components/postWaterfall.vue";
import queryControl from "@/components/queryControl.vue";
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useToast } from 'vue-toastification';
import { useConfigStore } from '@/stores/config';

const store = useConfigStore();
const mainRef = ref(null);

const scrollTop = () => {
    mainRef.value.scrollTo({top: 0, behavior: 'smooth'});
};

const getNextDiscussions = async () => {
    if (store.isLoading || store.hasNextPage === false) return;

    store.isLoading = true;
    try{
        if (typeof window.getDiscussions === "undefined") throw new Error("window.getDiscussions is undefined");
        const discussions = await window.getDiscussions(store.endCursor, store.searchQuery);
        store.posts.push(...discussions.nodes.filter(post => 
            !store.posts.some(existing => existing.id === post.id)
        ));
        store.endCursor =  discussions.pageInfo.endCursor;
        store.hasNextPage =  discussions.pageInfo.hasNextPage;
    }catch(e){
        useToast().error("获取讨论列表失败!");
        console.error(e);
    }finally{
        nextTick(() => {
            store.isLoading = false;
        });   
    }
};

const refreshDiscussions = async () => {
    if (store.isLoading) return;
    store.isLoading = true;
    let endCursor = null;
    let flag = true;
    let totalNewPosts = [];
    try{
        while (flag){
            if (typeof window.getDiscussions === "undefined") throw new Error("window.getDiscussions is undefined");
            const discussions = await window.getDiscussions(endCursor,store.searchQuery);
            const newPosts = discussions.nodes.filter(post => 
                !store.posts.some(existing => existing.id === post.id)
            );
            totalNewPosts.push(...newPosts);
            endCursor = discussions.pageInfo.endCursor;
            flag = discussions.pageInfo.hasNextPage;
            if (newPosts.length === 0 || newPosts.length < discussions.nodes.length ) break;
        }   
        useToast().info(`发现 ${totalNewPosts.length} 篇新帖子`)       
        if (totalNewPosts.length > 0){
            store.posts.unshift(...totalNewPosts);
            scrollTop();
        }
    }catch(e){
        useToast().error("刷新讨论列表失败!");
        console.error(e);
    }finally{
        nextTick(() => {
            store.isLoading = false;
        });
    } 
};

const controlContainerRef = ref(null);
let scrollTimer = null;
const distanceToBottom = ref(0);

const scrollHandle = (e) => {
    const target = e.target;
    const viewportHeight = target.clientHeight;
    distanceToBottom.value = target.scrollHeight - (target.scrollTop + viewportHeight);
    if (distanceToBottom.value <= viewportHeight) {
        getNextDiscussions();
    }
    controlContainerRef.value.style.opacity = "0.3";
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        controlContainerRef.value.style.opacity = "1";
    }, 300);
};

onMounted(() => {
    window.addEventListener('resize',scrollHandle);
    getNextDiscussions(); 
});

onUnmounted(() => {
    window.removeEventListener('resize',scrollHandle);
});

watch(() => store.searchQuery, async () => {
    store.posts = [];
    store.endCursor = null;
    store.hasNextPage = null;
    await getNextDiscussions();
});

</script>

<style scoped lang="less">
main {
    width: 100vw;
    height: 100vh;
    padding: 100px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url('@/assets/img/background.png') no-repeat center center;
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