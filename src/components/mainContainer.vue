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
            :breakpoints="[
                { width: 315, cols: 1},
                { width: 630, cols: 2},
                { width: 945, cols: 3},
                { width: 1260, cols: 4},
                { width: 1575, cols: 5},
            ]">
                <template #default="{ item }">
                    <Card :post="item" @click="showPopup(item)" @resize="waterfallRef.layout()"/>
                </template>
            </Waterfall>
        </template> 
        <span class="message" :class="{center: !store.posts.length}" ref="messageRef">{{ message }}</span>
    </main>
   
</template>

<script setup>
import Waterfall from "@/components/waterfallLayout.vue";
import Card from "@/components/postCard.vue";
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
const needInstall = ref(false);
const needUpdate = ref(false);

const showPopup = (post) => {
    store.curPost = post;
    store.showPopup = true;
};

const getNextDiscussions = async () => {
    if (store.isLoading || store.hasNextPage === false) return;
    store.isLoading = true;
    try{
        const {nodes, pageInfo} = await window.searchDiscussion(store.searchQuery, store.endCursor);
        store.posts.push(
            ...nodes.filter(
                post => !store.posts.some(node => node.id === post.id)
            )
        );
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
    if (typeof window.version === 'undefined') needInstall.value = true;
    if (!needInstall.value && window.version !== '1.5.0') needUpdate.value = true;

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

@keyframes background-scroll {
    from {
        background-position: left bottom;
    }
    to {
     background-position: right top;
    }
}


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


