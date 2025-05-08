<template>
    <main @scroll="scrollHandle" ref="mainRef">
        <Waterfall v-if="store.posts.length" :items="store.posts" :itemWidth="300" :itemGap="25" />
    </main>
</template>

<script setup>
import Waterfall from "@/components/postWaterfall.vue";
import { ref, onMounted, onUnmounted, nextTick, defineExpose, defineEmits } from "vue";
import { useToast } from 'vue-toastification';
import { useConfigStore } from '@/stores/config';

const store = useConfigStore();
const mainRef = ref(null);

const scrollTop = () => {
    mainRef.value.scrollTo({top: 0, behavior: 'smooth'});
};

defineExpose({
    scrollTop,
});

const emit = defineEmits(["scroll"]);

const getNextDiscussions = async () => {
    if (store.isLoading || store.hasNextPage === false) return;

    store.isLoading = true;
    try{
        const discussions = await window.getDiscussions(store.endCursor);
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

let distanceToBottom = 0;

const scrollHandle = (e) => {
    const target = e.target;
    const viewportHeight = target.clientHeight;
    distanceToBottom = target.scrollHeight - (target.scrollTop + viewportHeight);
    if (distanceToBottom <= viewportHeight) {
        getNextDiscussions();
    }
    emit("scroll",{distanceToBottom});
};

onMounted(() => {
    window.addEventListener('resize',scrollHandle);
    getNextDiscussions(); 
});

onUnmounted(() => {
    window.removeEventListener('resize',scrollHandle);
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

</style>