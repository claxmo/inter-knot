<template>
    <div class="post-card" 
    @click="$emit('click')" 
    :class="{
        delegate: post.category?.name === '委托', 
        // owner: post.author.login === store.author.login,
        R18: post.category?.name === 'R18'
    }">
        <span class="views">
            <img src="@/assets/svg/views.svg" />
            <span class="view-num">{{ post.comments.totalCount }}</span>
        </span>
        <img 
        class="cover"
        :src="isLoading || isError ? defaultCoverUrl : coverUrl" 
        loading="lazy" 
        @load="onLoad" 
        @error="onError"
        />
        <div class="footer">
            <div class="author-info">
                <span class="avatar"><img  :src="post.author.avatarUrl" /></span>
                <span class="author-name">{{ post.author.login }}</span>
            </div>
            <span class="post-title">
                <span class="label" v-if="post.category.name !== '常规'">{{ `[${post.category.name}]` }}</span>
                <span v-text="post.title"></span>
            </span>
            <span class="post-body" v-text="postBody"></span>
        </div>
    </div>
</template>

<script setup>
import { marked } from 'marked'
import { defineProps, onMounted, ref, defineEmits, toRef } from 'vue';
import defaultCoverUrl from '@/assets/svg/default-cover.svg';

const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
});

const post = toRef(props, "data");

const postBody = ref("");
const coverUrl = ref(null);
const isLoading = ref(true);
const isError = ref(false);

const emit = defineEmits(["click","imageLoaded"]);

const onLoad = () => {
    emit("imageLoaded");
    isLoading.value = false;
};

const onError = () => {
    isLoading.value = false;
    isError.value = true;
    
};

onMounted(() => {
    const matches = post.value.body.match(/!\[.*?\]\((.*?)\)/);
    coverUrl.value = matches ? matches[1] : defaultCoverUrl;
    postBody.value = marked(post.value.body).replace(/<[^>]*>/g, '');
    if (postBody.value.trim() === ""){
        postBody.value = "null";
    }
});

</script>

<style scoped lang="less">
.post-card {
    background-color: @color-gray-dark;
    border: 4px solid @color-black;
    border-radius: 30px 30px 0px 30px;
    cursor: pointer;
    transition: all 0.3s;
    overflow: hidden;
    font-size: 16px;
    position: relative;
    &:hover {
        animation: border-glow 0.5s linear infinite alternate;
    }
    .cover {
        width: 100%;
        object-fit: cover;
        max-height: 400px;
        min-height: 185px;
        display: block;
    }
}

.footer {
    background-color: @color-gray-dark;
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0 15px 8px;
    .author-info {
        width: 100%;
        height: 30px;
        overflow: visible;
        display: flex;
        margin-bottom: 5px;
        .avatar {
            position: relative;
            height: 65px;
            aspect-ratio: 1/1;
            border-radius: 50%;
            border: 4px solid @color-gray-dark;
            margin-top: -28px;
            z-index: 1;
            background-color: @color-gray-dark;
            &::before {
                position: absolute;
                content: "";
                top: -6px;
                left: -29.5px;
                width: 30px;
                height: 30px;
                background: transparent;
                border-radius: 50%;
                box-shadow: 15px 18px @color-gray-dark;
                z-index: 0;
            }
            &::after {
                position: absolute;
                content: "";
                top: -6px;
                right: -29.5px;
                width: 30px;
                height: 30px;
                background: transparent;
                border-radius: 50%;
                box-shadow: -15px 18px @color-gray-dark;
                z-index: 0;
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: relative;
                z-index: 1;
                border-radius: 50%;
            }
        }
        .author-name {
            font-size: 1em;
            flex: 1;
            color: @font-color-secoundary;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            margin-left: 5px;
            padding-left: 4px;
            padding-top: 2px;
            overflow: hidden;             
            text-overflow: ellipsis;
            &::before{
                content: "";
                position: absolute;
                height: 3px;
                width: 100%;
                background-color: @color-gray;
                bottom: 0px;
                left: 0px;
            }
        }
    }
    .post-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        text-overflow: ellipsis;
        white-space: normal;
        overflow: hidden;
        overflow-wrap: break-word;
        font-size: 1em;
        padding: 0 5px;
        .label {
            margin-right: 2px;
        }

    }
    .post-body {
        color: @font-color-secoundary;
        white-space: nowrap;          
        overflow: hidden;             
        text-overflow: ellipsis;
        font-size: 0.925em;
        padding: 0 5px;
    }
}

.views{
    position: absolute;
    top: 5px;
    left: 15px;
    z-index: 10;
    display: flex;
    gap: 4px;
    justify-content: center;
    align-items: center;
    .view-num{
        font-size: 1.125em;
        padding-bottom: 4px;
    }
    img {
        width: 24px;
        height: 24px;
    }
}

.post-card.viewed .post-title *{
    color: @font-color-secoundary;

}

.post-card.delegate:not(.viewed) .post-title *{
    background: linear-gradient(0deg, @color-blue, @color-blue-light); /* 渐变色定义 */
    -webkit-background-clip: text; /* 裁剪背景到文字 */
    -webkit-text-fill-color: transparent; /* 文字颜色透明 */
    background-clip: text;

}

// .post-card.owner .author-name{
//     color: @color-orange;
// }

.post-card.R18 .cover{
    filter: blur(25px);

}

.post-card.R18:not(.viewed) .post-title *{
    color: @color-pink-light;
}

</style>