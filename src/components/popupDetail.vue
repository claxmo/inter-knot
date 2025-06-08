<template>
    <div class="popup-container" :class="props.show ? 'show' : 'hide'" @click="$emit('hide')" >
        <div class="post-detail" @click.stop>
            <div class="main-background">
                <span>ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO</span>
                <span>ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO</span>
                <span>ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO</span>
                <span>ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO</span>
                <span>ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO</span>
            </div>
            <header>
                <div class="author-info">
                    <span class="avatar">
                        <a :href="post.url" target="_blank"><img :src="post.author?.avatarUrl" /></a>
                    </span>
                    <div class="text">
                        <span class="author-name" target="_blank">{{ post.author?.login }}</span>
                        <ul class="meta">
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
                        <div class="text">
                            <span class="post-title">
                                <span class="label" v-show="post.category?.name !== '常规'">[{{ post.category?.name }}]</span>
                                <span v-text="post.title"></span>
                            </span>
                            <div class="markdown-body" v-html="bodyHTML"></div>
                        </div>
                        <a class="reply-btn" :href="post.url" target="_blank"><img src="@/assets/svg/write.svg" />写回复</a>
                        <CommentList :postId="post.id" :postAuthor="post.author" />
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
import { ref, watch, defineProps, toRefs } from 'vue';

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
const bodyHTML = ref("");
const imgUrls = ref([]);

watch(() => props.show, (newValue) => {
    if (!newValue) return;
    imgUrls.value = [defaultCoverUrl];
    bodyHTML.value = post.value.bodyHTML;
    const imgRegx = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;
    const matches = [...bodyHTML.value.matchAll(imgRegx)];
    if (matches.length){
        imgUrls.value = matches.map(match => match[1]);
        bodyHTML.value = bodyHTML.value.replace(imgRegx, '');
    }
});

</script>

<style scoped lang="less">

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-35%); }
}

@keyframes scroll-right {
  0% { transform: translateX(0); }
  100% { transform: translateX(35%); }
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
    width: 70%;
    aspect-ratio: 1.8/1;
    transition: all 0.3s;
    border-radius: 50px 0px 50px 50px;
    overflow: hidden;
    position: relative;
    border: 4px solid #000;
    box-shadow: 0 0 0 5px rgba(49,49,49,0.7);
    background-image: linear-gradient(-10deg, #000, @bg-primary-color);
    .main-background {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transform: rotate(-10deg);
        overflow: visible;
        z-index: -1;
        span {
            line-height: 1;
            font-size: 300px;
            white-space: nowrap;
            .text-linear-gradient(0, rgba(32,32,32,0.5), rgba(49,49,49,0.5));
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
        padding: 0 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
        background-image: linear-gradient(0, #101010, rgba(14, 14, 14, 0.7));
        z-index: 1;
        &::after{
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.3));
            z-index: -1;
        }
    }
    main {
        display: flex;
        justify-content: space-around;
        gap: 24px;
        padding: 110px 20px 25px 20px;
        width: 100%;
        height: 100%;
        background-image: url("@/assets/svg/point.svg");
        background-size: 6px;
        z-index: 0;
    }
}

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

.media-container {
    width: 35%;
    height: 100%;
    border: 4px solid @border-color;
    border-radius: 25px;
    background-color: #000;
    overflow: hidden;   
}

.interaction-container {
    height: 100%;
    flex: 1;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 25px;
    position: relative;
    overflow: hidden;
    .container {
        width: 100%;
        height: 100%;
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
                linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent 32px),
                linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent 32px);

        }
        .text {
            width: 100%;
            margin-bottom: 36px;
            .post-title span{
                font-size: 1.125rem;
            }
        }
    }
}

.reply-btn {
    width: 100%;
    height: 50px;
    border: 4px solid @border-color;
    background: #000;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 18px;
    img {
        width: 24px;
        height: 24px;
    }
}

@media (max-width: 1080px) {
    .post-detail {
        height: 100vh;
        width: 100vw;
        border-radius: 0;
        main {
            flex-direction: column;
            padding: 100px 0 0 0;
            gap: 15px;
            .media-container {
                width: 100%;
                height: 35%;
                flex-shrink: 0;
            }

            .interaction-container {
                width: 100%;
                flex: 1;
            }
        }
    }  
}
</style>

