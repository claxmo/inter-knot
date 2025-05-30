<template>
    <div class="popup-container" :class="props.show ? 'show' : 'hide'" @click="$emit('hide')" >
        <div class="post-detail" @click.stop>
            <header>
                <div class="author-info">
                    <span class="avatar"><img :src="post.author?.avatarUrl || defaultAvatarUrl" /></span>
                    <div class="text">
                        <span class="author-name">{{ post.author?.login ?? "匿名用户" }}</span>
                        <ul class="meta">
                            <li class="meta-item"><img src="@/assets/svg/clock.svg">{{ new Date(post?.createdAt).toLocaleDateString("en-CA") }}</li>
                            <li class="meta-item"><img src="@/assets/svg/views.svg">{{ post.upvoteCount }}</li>
                        </ul>
                    </div>
                </div>
                <img class="close-btn" src="@/assets/svg/close.svg" alt="关闭" @click="$emit('hide')" />
            </header>
            <main>
                <div class="media-container">
                   <ImageViewer :urls="imgUrls" />
                </div>
                <div class="interaction-container">
                    <div class="container">
                        <span class="post-title">
                            <span class="label" v-show="post.category?.name !== '常规'">[{{ post.category?.name }}]</span>
                            <span v-text="post.title"></span>
                        </span>
                        <div class="markdown-body" v-html="bodyHTML"></div>
                        <a :href="post.url" target="_blank" title="写回复" class="reply-btn">
                            <img src="@/assets/svg/write.svg"/>&nbsp;写回复
                        </a>
                        <ul class="comment-list">
                            <li 
                            class="comment-item" 
                            v-for="(comment, index) in comments?.nodes"
                            :key="comment.id"
                            :class="{ owner: comment.author.login === store.author.login }" >
                                <span class="avatar"><img :src="comment.author.avatarUrl" /></span>
                                <div class="text">
                                    <span class="author-name">
                                        <span class="label" v-if="comment.author.login === post.author.login">[楼主]</span>
                                        <span>{{ comment.author.login }}</span>
                                    </span>
                                    <div class="markdown-body" v-html="comment.bodyHTML"></div>
                                </div>
                                <span class="floor">{{ index + 1 }}F</span>
                            </li>
                        </ul>    
                        <span class="message" ref="messageRef">{{ message }}</span>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import ImageViewer from '@/components/imageViewer.vue';
import defaultCoverUrl from '@/assets/svg/default-cover.svg';
import defaultAvatarUrl from '@/assets/svg/default-avatar.svg';
import { ref, watch, nextTick, defineProps, toRefs, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useConfigStore } from '@/stores/config';

const props = defineProps({
    post: {
        type: Object,
        required: true
    },
    show: {
        type: Boolean,
        required: true
    }
});

const store = useConfigStore();
const { post } = toRefs(props);
const comments = ref(null);
const isLoading = ref(false);
const bodyHTML = ref("");
const imgUrls = ref([]);
const messageRef = ref(null);
const message = computed(() => {
    if (isLoading.value){
        return "正在努力加载中···";
    }else if (comments.value?.pageInfo?.hasNextPage === false){
        return "- 已无更多评论 -";
    }else{
        return "";
    }
});

const getNextComments = async () => {
    if (!post.value.id) return;
    if (isLoading.value || comments.value?.pageInfo?.hasNextPage === false) return;
    isLoading.value = true;
    try{
        const nextComments = await window.getComments(post.value.id, comments.value?.pageInfo?.endCursor);
        if (!comments.value){
            comments.value = nextComments;
        }else{
            comments.value.nodes.push(...nextComments.nodes.filter(
                comment => !comments.value.nodes.some(c => c.id === comment.id)
            ));
            comments.value.pageInfo = nextComments.pageInfo;
            comments.value.totalCount = nextComments.totalCount;
        }  
    }catch(e){
        useToast().error("获取评论列表失败!");
        console.error(e);
    }finally{
        nextTick(() => {
            isLoading.value = false;
        });
    }       
};

watch(() => props.show, (newValue) => {
    if (!newValue) return;
    isLoading.value = false;
    imgUrls.value = [defaultCoverUrl];
    bodyHTML.value = post.value.bodyHTML;
    comments.value = null;
    const imgRegx = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;
    const matches = [...bodyHTML.value.matchAll(imgRegx)];
    if (matches.length){
        imgUrls.value = matches.map(match => match[1]);
        bodyHTML.value = bodyHTML.value.replace(imgRegx, '');
    }
    getNextComments();

});

onMounted(() => {
    nextTick(() => {
        const observer = new IntersectionObserver(async (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                await getNextComments();
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
@keyframes bg-scroll {
  0% {
    background-position: left bottom;
  }
  100% {
    background-position: right top;
  }
}

.popup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    background-image: repeating-linear-gradient(
        45deg,            
        rgba(57,57,57,0.3),             
        rgba(57,57,57,0.3) 4px,          
        transparent 4px,
        transparent 8px
    );
    z-index: 11;
    transition: all 0.3s;
    &.show {
        opacity: 1;
        visibility: visible;
        .post-detail {
            transform: translateX(0%);
        }
    }
    &.hide {
        opacity: 0;
        visibility: hidden;
        .post-detail {
            transform: translateX(10%);
        }
    }
}

.post-detail {
    border: 4px solid @border-color;
    width: 75%;
    aspect-ratio: 1.7/1;
    transition: all 0.3s;
    border-radius: 50px 0px 50px 50px;
    overflow: hidden;
    background: url('@/assets/img/main-bg.png') no-repeat center center;
    background-size: cover;
    background-position: left bottom;
    animation: bg-scroll 30s linear infinite;
    position: relative;
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 85px;
        padding: 5px 36px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
        z-index: 1;
        background: linear-gradient(0deg, #000, transparent);    
    }
    main {
        display: flex;
        justify-content: space-around;
        background: url("@/assets/svg/point.svg");
        background-size: 8px;
        padding: 125px 25px 35px 25px;
        width: 100%;
        height: 100%;
        border: 4px solid #000;
        border-radius: 50px 0px 50px 50px;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 0;
    }
}

.post-detail header{
    .author-info {
        height: 70px;
        display: flex;
        flex: 1;
        min-width: 0;
        gap: 8px;
        .avatar {
            border: 4px solid @border-color;
            height: 100%;
            aspect-ratio: 1/1;
            border-radius: 50%;
            img {
                height: 100%;
                aspect-ratio: 1/1;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #000;
            }
        }
        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
            flex: 1;
            min-width: 0;
            .author-name {
                font-size: 22px;
                color: @text-secondary-color;
                .single-line-ellipsis();
            }   
        }
    }

    .meta {
        display: flex;
        gap: 8px;
        .meta-item {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 3px;
            height: 20px;
            white-space: nowrap;          
            overflow: hidden;             
            text-overflow: ellipsis;
            font-size: 14px;
            background-color: rgba(255,255,255,0.3);
            border-radius: 50px;
            padding: 0 8px;
            img {
                width: 18px;
                height: 18px;
            }
        }
    }

    .close-btn {
        cursor: pointer;
        height: 100%;
        aspect-ratio: 1/1;
    }
}

.media-container {
    width: 35%;
    height: 100%;
    border: 4px solid @border-color;
    border-radius: 25px;
    background-color: #000;
    overflow: hidden;   
}

.interaction-container {
    width: 60%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 25px;
    position: relative;
    overflow: hidden;
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px; 
        padding: 16px 24px;
        padding-bottom: 75px;
        overflow-y: scroll;
        overflow-x: hidden;
        &::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            background: 
                linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent 24px),
                linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent 24px);

        }
        .post-title {
            span {
                font-size: 1.125rem;
            }
        }
        .reply-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #000;
            border: 4px solid @border-color;
            border-radius: 50px;
            min-height: 50px;
            width: 100%;
            cursor: pointer;
            margin: 8px 0;
            img {
                width: 24px;
                height: 24px;
            }
        }
    
        .message {
            width: 100%;
            text-align: center;
            color: @text-secondary-color;
        }
    }
}

.interaction-container .container .comment-list {
    width: 100%;
    height: auto;
    .comment-item {
        min-height: 70px;
        width: 100%;
        border-bottom: 2px solid @border-color;
        display: flex;
        padding: 4px 0;
        position: relative;
        gap:8px;
        .avatar {
            height: 58px;
            aspect-ratio: 1/1;
            border-radius: 50px;
            border: 3px solid @border-color;
            img {
                height: 100%;
                border-radius: 50px;
                object-fit: cover;
                border: 2px solid #000;
            }
        }
        .text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 5px;
            flex: 1;
            min-width: 0;
            min-height: 100%;
            .author-name {
                color: @text-secondary-color;
                .single-line-ellipsis(); 
            }           
        }
        .floor {
            position: absolute;
            top: 12px;
            right: 0;
            z-index: 1;
            font-size: 12px;
            background-color: rgba(255,255,255,0.3);
            padding: 0 12px;
            border-radius: 25px;
            border-top-left-radius: 0;
            color: #000;

        }
        &.owner {
            .text .author-name *{
                color: #fdc220;;
            }
            .floor {
                background-color: #fdc220;;
            }
        }
    }
}


@media (max-width: 960px) {

    .post-detail {
        height: 100vh;
        width: 100vw;
        border-radius: 0;
        main {
            flex-direction: column;
            gap: 10px;
            border-radius: 0;
            .media-container {
                width: 100%;
                min-height: 35%;
                height: 35%;
            }

            .interaction-container {
                width: 100%;
                height: auto;
                flex: 1;
            }
        }
    }
}
</style>

