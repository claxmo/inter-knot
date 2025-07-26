<template>
    <main>
        <div class="background-scroll">
            <section>
                <img src="@/assets/img/InterKnotPageBG2.png" v-for="i in 9" :key="i"/>
            </section>
            <section>
                <img src="@/assets/img/InterKnotPageBG1.png" v-for="i in 9" :key="i"/>             
            </section>
            <section>
                <img src="@/assets/img/InterKnotPageBG2.png" v-for="i in 9" :key="i"/>
            </section>
        </div>
        <template v-if="needUpdate">
            <span class="center">
                <a href="https://greasyfork.org/zh-CN/scripts/534939-绳网跨域助手" class="link">点击更新绳网跨域助手</a>
            </span>
        </template>
        <template v-else-if="needInstall">
            <span class="center">
                <a href="https://greasyfork.org/zh-CN/scripts/534939-绳网跨域助手" class="link">点击下载绳网跨域助手</a>
            </span>
        </template>
        <template v-else>
            <Waterfall 
            ref="waterfall" 
            :items="store.posts" 
            :width=285 
            :gap=30 
             :breakpoints="[
                { width: 315, cols: 1 },
                { width: 630, cols: 2 },
                { width: 945, cols: 3 },
                { width: 1260, cols: 4 },
                { width: 1575, cols: 5 },
            ]">
                <template #default="{ item }">
                    <Card :post="item" @click="showHandle(item)" @resize="waterfall.layout()"/>
                </template>
            </Waterfall>
        </template> 
        <div class="loading-more" :class="{center: !store.posts.length, nomore: !store.isLoading}" ref="loadingRef">
            <img class="spinner" src="@/assets/img/loading.gif" v-if="store.isLoading"/>
            <span>{{ store.isLoading ? '正在努力加载···' : '已经到底了···\\[ O_X ]/' }}</span>            
        </div>
    </main>
    <PopupDetail 
    :post="store.curPost" 
    :show="store.showDetail" 
    @hide="hideHandle" 
    @delete="deleteHandle" 
    />
    <SelectorBox :items="[
        { label: '全部', value: '' },
        { label: '我的', value: store.author?.login ? `author:${store.author.login}` : '' },
        { label: '公告', value: 'category:公告' },
        { label: '委托', value: 'category:委托' },
        { label: '灌水', value: 'category:灌水' },
        { label: 'R18', value: 'category:R18' },
        { label: '常规', value: 'category:常规' },
    ]"
    @change="searchDiscussion"/>
</template>

<script setup>
import Waterfall from "@/components/waterfallLayout.vue";
import Card from "@/components/postCard.vue";
import PopupDetail from "@/components/popupDetail.vue";
import SelectorBox from "./selectorBox.vue";
import { ref, onMounted, nextTick } from "vue";
import { useConfigStore } from '@/stores/config';
import { useToast } from 'vue-toastification';


const store = useConfigStore();
const waterfall = ref(null);
const needInstall = ref(false);
const needUpdate = ref(false);

const showHandle = async (post) => {
    store.curPost = post;
    store.showDetail = true;
    const url = new URL(location.href);
    url.searchParams.set("post", post.number + "");
    history.pushState(null, "", url);
    document.title = post.title;

    const eyesGroup = post.reactionGroups.find(group => group.content === "EYES");
    if (!eyesGroup.viewerHasReacted) {
        await window.addReaction(post.id, "EYES");
        eyesGroup.viewerHasReacted = true;
        post.reactions.totalCount += 1;
    }
};

const hideHandle = () => {
    // store.curPost = null;
    store.showDetail = false;
    const url = new URL(location.href);
    url.searchParams.delete("post");
    history.pushState(null, "", url);
    document.title = 'inter-knot';
};


const getNextDiscussions = async () => {
    if (store.isLoading || store.hasNextPage === false) return;
    store.isLoading = true;
    try{
        const {nodes, pageInfo} = await window.searchDiscussion(store.searchQuery, store.endCursor);
        store.posts.push(
            ...nodes.filter(
                node => !store.posts.some(post => node.id === post.id)
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

onMounted(async () => {
    window.addEventListener("popstate", async () => {
        const url = new URL(location.href);
        const number = url.searchParams.has("post");
        if (number) {
        if (store.curPost?.number === number) {
            if (store.showDetail === false) store.showDetail = true;
            return;
        }
        store.showDetail = true;
        try {
            const res = await window.getDiscussion(parseInt(number));
            if (res) {
                store.curPost = res;
                document.title = res.title;
            }else {
                useToast().error("帖子不存在!");
            }
        } catch (e) {
            useToast().error("获取帖子失败!");
            console.error(e);
        }
        } else {
        store.showDetail = false;
        }
    });
    const url = new URL(location.href);
    const number = url.searchParams.get("post");
    if (number) {
        store.showDetail = true;
        try {
            const res = await window.getDiscussion(parseInt(number));
            if (res) {
                store.curPost = res;
                document.title = res.title;
            }else {
                useToast().error("帖子不存在!");
            }
        } catch (e) {
        useToast().error("获取帖子失败!");
        console.error(e);
        }
    }
});

const searchDiscussion = async (query) => {
    nextTick(async () => {
        store.searchQuery = query;
        store.posts = [];
        store.endCursor = null;
        store.hasNextPage = null;
        await getNextDiscussions();
    });
};  

const loadingRef = ref(null);

onMounted(() => {
    if (typeof window.version === 'undefined') needInstall.value = true;
    if (!needInstall.value && window.version !== '1.7.1') needUpdate.value = true;    
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
        observer.observe(loadingRef.value);
    }); 
});

</script>

<style scoped lang="less">

main {
    position: relative;
    width: 100vw;
    height: 100vh;
    padding-top: 85px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none;
    z-index: 9;
}

.background-scroll {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: visible;
  gap: 80px;
  user-select: none;
  section {
    display: flex;
    transform-origin: center;
    animation: scroll 60s linear infinite;
    img {
        height: 100%;
        width: auto;
        flex-shrink: 0;
    }
    &:nth-child(odd) {
        height: 75vh;
    }
    &:nth-child(even) {
        height: 25vh;
    }
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0,0,0,0.9);
    background-image: repeating-linear-gradient(
      45deg,            
      rgba(0,0,0,0.38),             
      rgba(0,0,0,0.38) 3px,          
      transparent 4px,
      transparent 8px
    );
  }
  @keyframes scroll {
    from {
      transform: rotate(-15deg) translateX(0);
    }
    to {
      transform: rotate(-15deg) translateX(-100%);
    }
  }
}

.loading-more {
    margin: 32px 0 80px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .spinner {
        width: 3.5rem;
        height: 3.5rem;
    }
    span {
        font-size: 1.25rem;
    }
    &.nomore {
        color: @text-tertiary-color;
    }
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


