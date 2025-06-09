<template>
    <main>
        <div class="main-background"></div>
        <template v-if="needInstall || needUpdate">
            <span class="center">
                <a href="https://greasyfork.org/zh-CN/scripts/534939-绳网跨域助手" class="link">点击{{needUpdate ? '更新' : '下载'}}绳网跨域助手</a>
            </span>
        </template>
        <template v-else>
            <Waterfall 
            ref="waterfallRef" 
            :items="store.posts" 
            :width=285 
            :gap=30 
            :maxCols=5 
            :breakpoints="[
                { width: 300, itemWidth: 185, gap: 0 },
                { width: 400, itemWidth: 215, gap: 5 },
                { width: 500, itemWidth: 250, gap: 10 },
                { width: 600, itemWidth: 285, gap: 15 },
                { width: 1200, itemWidth: 285, gap: 30 },
            ]">
                <template #default="{ item }">
                    <Card :post="item" @click="showPopup(item)" @imageLoaded="waterfallRef.layout()"/>
                </template>
            </Waterfall>
        </template> 
        <span class="message" :class="{center: !store.posts.length}" ref="messageRef">{{ message }}</span>
    </main>
    <PopupDetail :post="store.curPost" :show="store.showPopup" @hide="store.showPopup = false"/>
    <QuerySelector :options="[
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
        return '正在努力加载···';
    } else if (store.hasNextPage === false) {
        return '已经到底了···\\[ O_X ]/';
    } else {
        return '';
    }
});
const needInstall = ref(typeof window.version === 'undefined');
const needUpdate = ref(!needInstall.value && window.version !== '1.4.5');

const showPopup = (post) => {
    store.curPost = post;
    store.showPopup = true;
};

const getNextDiscussions = async () => {
    if (store.isLoading || store.hasNextPage === false) return;
    store.isLoading = true;
    try{
        const {nodes, pageInfo} = await window.getDiscussions(store.endCursor, store.searchQuery);
        store.posts.push(...nodes.filter(post => 
            !store.posts.some(node => node.id === post.id)
        ));
        store.endCursor =  pageInfo.endCursor;
        store.hasNextPage =  pageInfo.hasNextPage;
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
    if (needInstall.value || needUpdate.value) return;
    nextTick(() => {
        const observer = new IntersectionObserver(async (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                await getNextDiscussions();
            }
        }, {
            root: null,
            threshold: 0.1
        });
        observer.observe(messageRef.value);
    }); 
});
</script>

<style scoped lang="less">
main {
    position: relative;
    width: 100vw;
    height: 100vh;
    padding-top: 85px;
    z-index: 9;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    overflow-x: hidden;
    .main-background {
        position: fixed;
        inset: 0;
        z-index: -1;
        background: url('@/assets/img/main-bg.png');
        background-size: cover;
        animation: background-scroll 30s linear infinite;
        &::after {
            content: '';
            position: absolute;
            inset: 0;
            background-image: repeating-linear-gradient(
                45deg,            
                rgba(14,14,14,0.5),             
                rgba(14,14,14,0.5) 2px,          
                transparent 4px,
                transparent 8px;
            );
        }
    }
}

.message {
    color: @text-tertiary-color;
    font-size: 1.25rem;
    padding: 2.25rem 0;
}

.link {
    color: #66ccff;
    font-size: 2rem;
}

.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>


