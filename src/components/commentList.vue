<template>
  <ul class="comment-list">
    <li class="comment-item" v-for="(comment, index) in props.comments" :key="comment.id" :class="{ 'is-owner': isOwner(comment) }" >
        <span class="avatar"><img :src="comment.author.avatarUrl" /></span>
        <div class="text">
            <span class="author-name">
                <span v-if="isLz(comment)">[楼主]</span>
                <span>{{ comment.author.login }}</span>
            </span>
            <div class="markdown-body" v-html="comment.bodyHTML"></div>
        </div>
        <span class="floor">{{ index + 1 }}F</span>
    </li>
</ul>    
</template>

<script setup>
import { defineProps } from 'vue';
import { useConfigStore } from '@/stores/config';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
    comments: {
        type: Array,
        required: true,
    }
});
const store = useConfigStore();

const isOwner = (comment) => {
    return comment.author.login === store.author.login;
}; 

const isLz = (comment) => {
    return comment.author.login === props.post.author.login;
};

</script>

<style scoped lang="less">
.comment-list {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .comment-item {
        position: relative;
        min-height: 70px;
        width: 100%;
        border-bottom: 2px solid @border-color;
        display: flex;
        padding: 4px 0;
        gap:8px;
        .avatar {
            height: 58px;
            aspect-ratio: 1/1;
            border-radius: 50px;
            border: 3px solid @border-color;
            img {
                height: 100%;
                aspect-ratio: 1/1;
                border-radius: 50px;
                object-fit: cover;
                border: 2px solid #000;
            }
        }
        .text{
            display: flex;
            flex-direction: column;
            justify-content: center;
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
            border-radius: 0 25px 25px 25px;
            color: #000;

        }
        &.is-owner {
            .text .author-name span{
                color: #fdc220;;
            }
            .floor {
                background-color: #fdc220;;
            }
        }
    }
}
</style>