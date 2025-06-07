<template>
    <div class="comments-container">
        <ul class="comment-list">
            <li class="comment-item" v-for="(comment, index) in comments" :key="comment.id" :class="{ 'is-owner': isOwner(comment) }" >
                <span class="avatar">
                    <a :href="comment.url" target="_blank"><img :src="comment.author.avatarUrl" /></a>
                </span>
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
        <span class="message" ref="messageRef">{{ message }}</span>
    </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, onMounted, nextTick, toRefs } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from 'vue-toastification';

const props = defineProps({
    postId: {
        type: String,
        required: true,
    },
    postAuthor: {
        type: Object,
        required: true,
    }
});
const store = useConfigStore();
const { postId, postAuthor } = toRefs(props);
const comments = ref([]);
const commentCount = ref(0);
const hasNextPage = ref(null);
const endCursor = ref(null);
const isLoading = ref(false);
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

const isOwner = (comment) => {
    return comment.author.login === store.author.login;
}; 

const isLz = (comment) => {
    return comment.author.login === postAuthor.value.login;
};

const getNextComments = async () => {
    if (!postId.value || isLoading.value || hasNextPage.value === false) return;
    isLoading.value = true;
    try{
        const {nodes, pageInfo, totalCount} = await window.getComments(postId.value, endCursor.value);
        comments.value.push(...nodes.filter(comment => !comments.value.some(c => c.id === comment.id)));
        commentCount.value = totalCount;
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

watch(() => postId.value, () => {
    comments.value = [];
    endCursor.value = null;
    hasNextPage.value = null;
    isLoading.value = false;
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
.comments-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: visible;
    gap: 8px;
}

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

.message {
    color: @text-secondary-color;
}

</style>