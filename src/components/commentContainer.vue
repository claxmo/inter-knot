<template>      
    <ReplyBox :handler="addComment"/>
    <div class="comment-container">
        <div class="comment-header">
            <div class="comment-count">共 {{ comments.totalCount }} 条回复</div>
            <div class="comment-order">
                <span :class="{ active: isAsc }" @click="isAsc = true">正序</span>
                <span :class="{ active: !isAsc }" @click="isAsc = false">倒序</span>
            </div>
        </div>
        <ul class="comment-list">
            <li class="comment-item" v-for="(comment, index) in comments.nodes" :key="comment.id" :class="{ 'is-owner': comment.authorAssociation === 'OWNER' }">
                <div class="floor">F{{ isAsc ? index + 1 : comments.totalCount - index }}</div>
                <div class="author-info">
                    <a class="avatar" :href="comment.url" target="_blank"><img :src="comment.author?.avatarUrl || defaultAvatarUrl"></a>
                    <div class="content">
                        <span class="author-name">
                            {{ post.author?.login === comment.author?.login ? '[楼主]' : '' }}{{ comment.author?.login }}
                        </span>
                        <span class="markdown-body comment-body" v-html="comment.bodyHTML"></span>
                    </div>
                </div>
                <div class="comment-control">
                    <div class="comment-createdAt">{{ new Date(comment.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
                    <div class="delete-btn" @click="deleteComment(comment.id)" v-if="comment.viewerCanDelete">删除</div>
                </div>
            </li>
        </ul>  
         <div class="loading-more" :class="{nomore: !isLoading}" ref="loadingRef">
            <img class="spinner" src="@/assets/img/loading.gif" v-if="isLoading"/>
            <span>{{ isLoading ? '正在努力加载···' : '- 已无更多评论 -' }}</span>            
        </div>
    </div>
</template>

<script setup>
import ReplyBox from '@/components/replyBox.vue';
import { ref, defineProps, toRefs, computed, nextTick, onMounted, watch } from 'vue';
import { showDialog } from '@/utils/dialog';
import { useToast } from 'vue-toastification';

const props = defineProps({
    post: Object,
});

const { post } = toRefs(props);
const comments = ref({
    nodes: [],
    totalCount: 0,
    pageInfo: {
      startCursor: null,
      hasPreviousPage: null,
      endCursor: null,
      hasNextPage: null
        }
    }
);

const cursor = computed(() => isAsc.value ? comments.value.pageInfo.endCursor : comments.value.pageInfo.startCursor );
const hasPage = computed(() => isAsc.value ? comments.value.pageInfo.hasNextPage : comments.value.pageInfo.hasPreviousPage );

const isLoading = ref(false);
const loadingRef = ref(null);

const isAsc = ref(true);

const getNextComments = async () => {
    if (!post.value.id) return;
    if (isLoading.value || hasPage.value === false) return;
    isLoading.value = true;
    try{
        const newComments = await window.getDiscussionComments(post.value.id, cursor.value, isAsc.value);
        const newNodes = newComments.nodes.filter(
            comment => !comments.value.nodes.some(c => c.id === comment.id)
        )
        if (isAsc.value){
            comments.value.nodes.push(...newNodes);
        }else {
            comments.value.nodes.push(...newNodes.reverse());
        }
        comments.value.pageInfo = newComments.pageInfo;
        comments.value.totalCount = newComments.totalCount;
    }catch(e){
        useToast().error("获取评论列表失败!");
        console.error(e);
    }finally{
        nextTick(() => {
            isLoading.value = false;
        });
    }       
};

const deleteComment = async (postId) => {
    try {
        await showDialog("删除后不可恢复,是否删除?", async () => {
            await window.deleteDiscussionComment(postId);
            comments.value.nodes = comments.value.nodes.filter(c => c.id !== postId);
            comments.value.totalCount -= 1;
            useToast().success('评论删除成功!');
        });  
    } catch(e) {
        useToast().error('评论删除失败!');
        console.error(e);
    }
};

const addComment = async (content) => {
    try{
        const comment = await window.addDiscussionComment(post.value.id, content);
        comments.value.nodes.unshift(comment);
        comments.value.totalCount += 1;
        useToast().success('评论发送成功!');
    }catch (e){
        useToast().error('评论发送失败!');
        console.error(e);
    }
}; 

const reloadComments = async () => {
    comments.value = {
    nodes: [],
    totalCount: 0,
    pageInfo: {
      startCursor: null,
      hasPreviousPage: null,
      endCursor: null,
      hasNextPage: null
    }
  };
  isLoading.value = false;
  await getNextComments();
};

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
        observer.observe(loadingRef.value);
    });
});

watch(() => isAsc.value, () => {reloadComments();});
watch(() => post.value, () => {reloadComments();});



</script>

<style scoped lang="less">

.comment-container{
    width: 100%;
    .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        .comment-count {
            color: @text-tertiary-color;
            font-size: 16px;
        }
        .comment-order {
            display: flex;
            gap: 12px;
            span {
                color: @text-tertiary-color;
                cursor: pointer;
                padding: 2px 4px;
                font-size: 16px;
            }
            .active {
                color: @text-primary-color;
                border-bottom: 2px solid @text-primary-color;
            }
        }

    }
    .comment-list {
        width: 100%;
        list-style: none;
        .comment-item {
            position: relative;
            min-height: 70px;
            width: 100%;
            padding: 4px 0;
            border-bottom: 2px solid @border-color;
            .author-info {
                flex: 1;
                display: flex;
                gap: 8px;
                .avatar {
                    height: 58px;
                    aspect-ratio: 1/1;
                    border-radius: 50px;
                    border: 3px solid @border-color;
                    img {
                        height: 100%;
                        aspect-ratio: 1/1;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 2px solid #000;
                    }
                }
                .content {
                    flex: 1;
                    .author-name {
                        color: @text-secondary-color;
                        .single-line-ellipsis(); 
                    }
                    .comment-body {
                        white-space: normal;
                        word-break: break-word;
                        overflow-wrap: break-word;
                    }
                }
            }
            .comment-control {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-left: 66px;
                .comment-createdAt {
                    color: @text-tertiary-color;
                    font-size: 14px;
                }
                .delete-btn {
                    font-size: 14px;
                    color: rgb(255,77,77);
                    cursor: pointer;
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
                .author-info .content .author-name{
                    color: #fdc220;
                }
                .floor {
                    background-color: #fdc220;
                }
            }
        }
    }
}
.loading-more {
    padding: 32px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .spinner {
        width: 2rem;
        height: 2rem;
    }
    .span {
        font-size: 1rem;
    }
    &.nomore {
        color: @text-tertiary-color;
    }
}
</style>