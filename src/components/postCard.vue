<template>
    <div class="post-card" @click="$emit('click')">
        <span class="views"><img src="../assets/svg/views.svg" />{{ post.comments.totalCount }}</span>
        <img 
            class="cover" 
            :src="isLoading || isError ? defaultCoverUrl : coverUrl" 
            loading="lazy" 
            @load="onLoad" 
            @error="onError"
        />
        <div class="footer">
            <div class="author-info">
                <span class="avatar"><img :src="post.author.avatarUrl" /></span>
                <span class="author-name">{{ post.author.login }}</span>
            </div>
            <span class="post-title" v-text="post.title"></span>
            <span class="post-body" v-text="postBody"></span>
        </div>
    </div>
</template>


<script setup>
import defaultCoverUrl from '../assets/svg/default-cover.svg'
import { marked } from 'marked'
import { defineProps, nextTick, ref, defineEmits } from 'vue'

const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
});

const post = ref(props.data);
const isLoading = ref(true);
const isError = ref(false);
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
        border-color: #fbfe00;
    }
    100% {
        // scale: 1.05;
        border-color:#aefe00;
    }
}

.post-card {
    background: #1f1f1f;
    border-radius: 30px 30px 0px 30px;
    border: 5px solid #000;
    cursor: pointer;
    transition: all 0.3s;
    overflow: hidden;
    font-size: 16px;
    &:hover {
        animation: border-glow 0.5s linear infinite alternate;
    }
    .cover {
        width: 100%;
        object-fit: cover;
        max-height: 400px;
    }
}

.footer {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0 15px 3px;
    .author-info {
        width: 100%;
        height: 30px;
        overflow: visible;
        display: flex;
        margin-bottom: 5px;
        .avatar {
            position: relative;
            width: 65px;
            height: 65px;
            border-radius: 50%;
            border: 5px solid #1f1f1f;
            margin-top: -32px;
            z-index: 1;
            &::before {
                position: absolute;
                content: "";
                top: -6px;
                left: -30px;
                width: 30px;
                height: 30px;
                background: transparent;
                border-radius: 50%;
                box-shadow: 15px 18px #1f1f1f;
                z-index: 0;
            }
            &::after {
                position: absolute;
                content: "";
                top: -6px;
                right: -30px;
                width: 30px;
                height: 30px;
                background: transparent;
                border-radius: 50%;
                box-shadow: -15px 18px #1f1f1f;
                z-index: 0;
            }
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
                position: relative;
                z-index: 1;
            }
        }
        .author-name {
            font-size: 1.125em;
            flex: 1;
            color: #5e5e5e;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            margin-left: 5px;
            &::before{
                content: "";
                position: absolute;
                height: 3px;
                width: 100%;
                background-color: #343434;
                bottom: 0px;
                left: 0px;
            }
        }
    }
    .post-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        text-overflow: ellipsis;
        white-space: normal;
        overflow: hidden;
        overflow-wrap: break-word;
        font-size: 1.125em;
        margin-bottom: 2px;
    }
    .post-body {
        color: #9e9e9e;
        white-space: nowrap;          
        overflow: hidden;             
        text-overflow: ellipsis;
        font-size: 1em;
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
</style>
