<template>
    <div class="popup-container" :class="props.show ? 'show' : 'hide'" @click="$emit('hide')" >
        <div class="post-detail" @click.stop>
            <div class="main-background">
                <span>ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO</span>
                <span>ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO</span>
                <span>ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO</span>
            </div>
            <header>
                <div class="author-info">
                    <span class="avatar"><img :src="post.author?.avatarUrl || defaultAvatarUrl" /></span>
                    <div class="text">
                        <span class="author-name">{{ post.author?.login ?? "匿名用户" }}</span>
                        <ul class="meta">
                            <li class="meta-item"><img src="@/assets/svg/clock.svg">{{ new Date(post?.createdAt).toLocaleDateString("en-CA") }}</li>
                            <li class="meta-item"><img src="@/assets/svg/views.svg">{{ post.upvoteCount }}</li>
                            <li class="meta-item">#{{ post.number }}</li>
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
                        <div class="reply-box">
                            <input type="text" class="reply-input" v-model='replyBody' placeholder="写回复..." />
                            <input type="button" class="reply-submit" @click="addDiscussionComment(replyBody)" ref="replySubmit" value="发送">
                        </div>
                        <CommentList :post="post" :comments="comments" />
                        <span class="message" ref="messageRef">{{ message }}</span>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import ImageViewer from '@/components/imageViewer.vue';
import CommentList from '@/components/commentList.vue';
import defaultCoverUrl from '@/assets/svg/default-cover.svg';
import defaultAvatarUrl from '@/assets/svg/default-avatar.svg';
import { ref, watch, nextTick, defineProps, toRefs, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

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
const { post } = toRefs(props);
const comments = ref([]);
const hasNextPage = ref(null);
const endCursor = ref(null);




const isLoading = ref(false);
const bodyHTML = ref("");
const imgUrls = ref([]);
const messageRef = ref(null);
const message = computed(() => {
    if (isLoading.value){
        return "正在努力加载中···";
    }else if (hasNextPage.value === false){
        return "- 已无更多评论 -";
    }else{
        return "";
    }
});

const getNextComments = async () => {
    if (!post.value.id || isLoading.value || hasNextPage.value === false) return;
    isLoading.value = true;
    try{
        const {nodes, pageInfo} = await window.getComments(post.value.id, endCursor.value);
        comments.value.push(...nodes.filter(comment => !comments.value.some(c => c.id === comment.id)));
        hasNextPage.value = pageInfo.hasNextPage;
        endCursor.value = pageInfo.endCursor  
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
    comments.value = [];
    hasNextPage.value = null;
    endCursor.value = null;
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

const replyBody = ref('');
const replySubmit = ref(null);

const addDiscussionComment = async (body) => {
    if (!post.value.id) return;
    if (replyBody.value.trim() === ''){
        return useToast().warning('评论内容不能为空!');
    }
    try{
        replySubmit.value.disabled = true;
        replySubmit.value.value = "发送中···";
        const comment = await window.addDiscussionComment(post.value.id, body);
        comments.value.unshift(comment);
        replyBody.value = '';
        useToast().success('评论发送成功!');
    }catch (e){
        useToast().error('评论发送失败!');
        console.error(e);
    }finally {
        nextTick(() => {
            replySubmit.value.disabled = false;
            replySubmit.value.value = "发送";
        });
    }
};


</script>

<style scoped lang="less">

@keyframes scroll-left {
  0% { transform: rotate(-15deg) translateX(0); }
  100% { transform: rotate(-15deg) translateX(-35%); }
}

@keyframes scroll-right {
  0% { transform: rotate(-15deg) translateX(0); }
  100% { transform: rotate(-15deg) translateX(35%); }
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
    width: 75%;
    aspect-ratio: 1.8/1;
    transition: all 0.3s;
    border-radius: 50px 0px 50px 50px;
    overflow: hidden;
    background-image: linear-gradient(0, #000, @bg-primary-color);
    position: relative;
    border: 4px solid #000;
    box-shadow: 0 0 0 5px rgba(49,49,49,0.7);
    .main-background {
        position: absolute;
        inset: 0;
        overflow: visible;
        display: flex;
        flex-direction: column;
        z-index: -1;
        justify-content: center;
        align-items: center;
        span {
            line-height: 1;
            font-size: 420px;
            white-space: nowrap;
            transform: rotate(-15deg);
            .text-linear-gradient(0, @bg-secondary-color, @bg-primary-color);
        }
        span:nth-child(odd) {
            animation: scroll-left 60s linear infinite alternate;
        }

        span:nth-child(even) {
            animation: scroll-right 60s linear infinite alternate;
        }
    }
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
        background: linear-gradient(0deg, #000, rgba(0,0,0,0.3));    
    }
    main {
        display: flex;
        justify-content: space-around;
        padding: 125px 25px 35px 25px;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 0;
        background-image: url("@/assets/svg/point.svg");
        background-size: 8px;

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
    width: 30%;
    height: 100%;
    border: 4px solid @border-color;
    border-radius: 25px;
    background-color: #000;
    overflow: hidden;   
}

.interaction-container {
    width: 65%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
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
        .message {
            width: 100%;
            text-align: center;
            color: @text-secondary-color;
        }
    }
}


.reply-box {
    width: 100%;
    min-height: 50px;
    display: flex;
    gap: 8px;
    .reply-input {
        border: 4px solid @border-color;
        background-color: #000;
        border-radius: 50px;
        width: 75%;
        height: 100%;
        padding: 0 10px;
    }
    .reply-submit {
        border: 4px solid @border-color;
        background-color: #000;
        flex: 1;
        border-radius: 50px;
        height: 100%;
        cursor: pointer;
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

