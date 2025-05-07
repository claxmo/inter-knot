<template>
    <div class="post-card" 
    @click="$emit('click')" 
    :class="{
        delegate: post.category?.name === '委托', 
        owner: post.author.login === store.author.login,
        R18: post.category?.name === 'R18'
    }">
        <span class="views"><img src="@/assets/svg/views.svg" />{{ post.comments.totalCount }}</span>
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
            <span class="post-title" v-text="postTitle"></span>
            <span class="post-body" v-text="postBody"></span>
        </div>
    </div>
</template>

<script setup>
import { marked } from 'marked'
import { defineProps, nextTick, ref, defineEmits, computed, toRef } from 'vue';
import { useConfigStore } from '@/stores/config';
import defaultCoverUrl from '@/assets/svg/default-cover.svg';

const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
});

const store = useConfigStore();
const post = toRef(props, "data");

const postTitle = computed(() => {
    if (post.value.category.name !== "常规"){
        return `[ ${post.value.category.name} ]` + post.value.title;
    }else{
        return post.value.title;
    }
});
const postBody = ref("");
const coverUrl = ref(null);

nextTick(() => {
    const matches = post.value.body.match(/!\[.*?\]\((.*?)\)/);
    coverUrl.value = matches ? matches[1] : defaultCoverUrl;
    postBody.value = marked(post.value.body).replace(/<[^>]*>/g, '');
    if (postBody.value.trim() === ""){
        postBody.value = "null";
    }

});

const emit = defineEmits(["click","imageLoaded"]);
const isLoading = ref(true);
const isError = ref(false);

const onLoad = () => {
    emit("imageLoaded");
    isLoading.value = false;
};

const onError = () => {
    isLoading.value = false;
    isError.value = true;
    
};

</script>

<style scoped lang="less">
@keyframes border-glow {
    0% {
        border-color: @color-yellow;
    }
    100% {
        // scale: 1.05;
        border-color: @color-green;
    }
}

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
                bottom: 2px;
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
        margin-bottom: 2px;
        padding: 0 5px;
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
    top: 10px;
    left: 24px;
    z-index: 10;
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: center;
    z-index: 9;
    font-size: 1.125em;
    img {
        width: 24px;
        height: 24px;
    }
}

.post-card.viewed .post-title {
    color: @font-color-secoundary;
}

.post-card.delegate:not(.viewed) .post-title{
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


</style>