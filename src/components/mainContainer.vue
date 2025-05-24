<template>
    <main>
        <div class="main-background"></div>
        <span v-if="needInstall" class="center">
            <a href="https://greasyfork.org/zh-CN/scripts/534939-%E7%BB%B3%E7%BD%91%E8%B7%A8%E5%9F%9F%E5%8A%A9%E6%89%8B" class="link">点击下载绳网跨域助手</a>
        </span>
        <Waterfall v-else ref="waterfallRef" :items="store.posts" :width=300 :gap=25 >
            <template #default="{ item }">
                <Card :post="item" @click="showPopup(item)" @imageLoaded="waterfallRef.layout()"/>
            </template>
        </Waterfall>
        <span class="message" ref="messageRef" :class="{center: !store.posts.length}">{{ message }}</span>
    </main>
    <PopupDetail :post="store.curPost" :show="store.showPopup" @hide="store.showPopup = false"/>
    <QuerySelector :items="[
        { label: '全部', query: '' },
        { label: '我的', query: store.author?.login ? `author:${store.author.login}` : '' },
        { label: '公告', query: 'category:公告' },
        { label: '委托', query: 'category:委托' },
        { label: '灌水', query: 'category:灌水' },
        { label: 'R18', query: 'category:R18' },
        { label: '常规', query: 'category:常规' },
    ]"/>
</template>

<script setup>
import Waterfall from "@/components/waterfallLayout.vue";
import Card from "@/components/postCard.vue";
import PopupDetail from "@/components/popupDetail.vue";
import QuerySelector from "@/components/querySelector.vue";
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useToast } from 'vue-toastification';
import { useConfigStore } from '@/stores/config';

const store = useConfigStore();
const waterfallRef = ref(null);
const messageRef = ref(null);

const message = computed(() => {
    if (store.isLoading) {
        return '正在努力加载···'
    } else if (store.hasNextPage === false) {
        return '已经到底了···\\[ O_X ]/'
    } else {
        return ''
    }
});
const needInstall = ref(true);

const showPopup = (post) => {
    store.curPost = post;
    store.showPopup = true;
};

const getNextDiscussions = async () => {
    if (store.isLoading || store.hasNextPage === false) return;
    store.isLoading = true;
    try{
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

watch(() => store.searchQuery, async () => {
    store.posts = [];
    store.endCursor = null;
    store.hasNextPage = null;
    await getNextDiscussions();
});

onMounted(() => {
    if (typeof window.getDiscussions !== "undefined"){
        needInstall.value = false;
    }
    nextTick(() => {
        const observer = new IntersectionObserver(async (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                await getNextDiscussions();
            }
        }, {
            root: null, // 默认是视口
            threshold: 0.1 // 元素 10% 可见时触发
        });
        observer.observe(messageRef.value);
    });
});
</script>

<style scoped lang="less">
@keyframes bg-scroll {
  0% {
    background-position: left bottom;
  }
  100% {
    background-position: right top;
  }
}

main {
    position: relative;
    width: 100vw;
    min-height: 100vh;
    padding-top: 100px;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 9;
    display: flex;
    flex-direction: column;
    align-items: center;
    .main-background {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        background: url('@/assets/img/background.png') no-repeat center center;
        background-size: cover;
        background-position: left bottom;
        animation: bg-scroll 30s linear infinite alternate;
        &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: url('@/assets/svg/fill-black.svg') repeat center center;
        background-size: 14px;
    }
  }
}


.message {
    color: @text-secondary-color;
    font-size: 1.5rem;
    padding: 48px 0;
}

.link {
    color: #66ccff;
    font-size: 32px;
}

.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>


