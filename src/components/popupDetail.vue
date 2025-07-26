<template>
    <div class="post-detail-mask" :class="props.show ? 'show' : 'hide'" @click="$emit('hide')" >
        <div class="post-detail" @click.stop>
            <div class="background-scroll">
                <span v-for="index of 9" :key="index">ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO</span>
            </div>
            <header>
                <div class="author-info">
                    <a class="avatar" :href="post?.url" target="_blank"><img :src="post.author?.avatarUrl || defaultAvatarUrl"></a>
                    <div class="content">
                        <div class="author-name">{{ post.author?.login || "匿名用户" }}</div>
                        <div class="reaction-count">
                            <img class="icon" src="@/assets/img/IconFavorability.png" />
                            {{ post?.reactions?.totalCount || 0 }}
                        </div>
                    </div>
                </div>
                <img class="close-btn" src="@/assets/svg/close-btn.svg" alt="关闭" @click="$emit('hide')" />
            </header>
            <main>
                <div class="media-container">
                    <NImageGroup>
                        <NImage 
                        v-for="(url, index) in imgUrls" 
                        :key="index" 
                        :src="url" 
                        object-fit="contain" 
                        width="100%" 
                        v-show="imgIndex === index"/>
                    </NImageGroup>
                    <div class="prev-btn" @click="imgIndex = (imgIndex - 1 + imgUrls.length) % imgUrls.length" title="上一张">
                        <svg t="1753535057405" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8276" width="40" height="40"><path d="M294.408263 534.448268l353.697601-353.697601c18.73776-18.73776 49.092092-18.73776 67.828828 0s18.73776 49.092092 0 67.828828L430.065919 534.448268l285.868773 285.868773c18.73776 18.73776 18.73776 49.092092 0 67.828828s-49.092092 18.73776-67.828828 0L294.408263 534.448268z" fill="#bfbfbf" p-id="8277"></path></svg>
                    </div>
                    <div class="next-btn" @click="imgIndex = (imgIndex + 1) % imgUrls.length" title="下一张">
                        <svg t="1753534997819" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5774" width="40" height="40"><path d="M729.987756 534.448268 376.290155 888.145869c-18.73776 18.73776-49.092092 18.73776-67.828828 0s-18.73776-49.092092 0-67.828828l285.868773-285.868773L308.461327 248.579495c-18.73776-18.73776-18.73776-49.092092 0-67.828828s49.092092-18.73776 67.828828 0L729.987756 534.448268z" fill="#bfbfbf" p-id="5775"></path></svg>
                    </div>
                    <div class="index-info">{{ imgIndex + 1 }}/{{ imgUrls.length }}</div>
                </div>
                <div class="interaction-container">
                    <div class="post-title">
                        {{post.category?.name !== '常规' ? `[${post.category?.name}]` : ''}}{{ post.title }}
                    </div>
                    <div class="markdown-body post-body" v-html="bodyHTML"></div>
                    <div class="reply-box">
                        <textarea v-model="inputText" placeholder="输入回复..."></textarea>
                        <div class="actions">
                        <div class="submit" @click="addComment">发送</div>
                        </div>
                    </div>
                    <div class="comment-container">
                        <div class="comment-header">
                            <div class="comment-count">共 {{ comments.totalCount }} 条回复</div>
                            <div class="comment-order">
                                <span :class="{ active: isAsc }" @click="isAsc = true">正序</span>
                                <span :class="{ active: !isAsc }" @click="isAsc = false">倒序</span>
                            </div>
                        </div>
                        <ul class="comment-list">
                            <li 
                            class="comment-item" 
                            v-for="(comment, index) in comments.nodes" 
                            :key="comment.id" 
                            :class="{ 'is-owner': comment.authorAssociation === 'OWNER' }">
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
                                <div class="actions">
                                    <div class="delete-btn" @click="deleteComment(comment.id)" v-if="comment.viewerCanDelete">删除</div>
                                </div>
                            </li>
                        </ul>  
                        <div class="loading-more" :class="{nomore: !isLoading}" ref="loadingRef">
                            <img class="spinner" src="@/assets/img/loading.gif" v-if="isLoading"/>
                            <span>{{ isLoading ? '正在努力加载···' : '- 已无更多评论 -' }}</span>            
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import defaultAvatarUrl from '@/assets/svg/default-avatar.svg';
import { ref, watch, defineProps, toRefs, onMounted, nextTick, computed } from 'vue';
import { NImage, NImageGroup } from 'naive-ui';
import { useToast } from 'vue-toastification';
import { html2dom } from '@/utils/utils';

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
const imgIndex = ref(0);
const inputText = ref('');
const submitting = ref(false);
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

const addComment = async () => {
    if (submitting.value || inputText.value.trim().length === 0) return;
    submitting.value = true;
    try{
        const comment = await window.addDiscussionComment(post.value.id, inputText.value);
        comments.value.nodes.unshift(comment);
        comments.value.totalCount += 1;
        inputText.value = '';
        useToast().success('评论发送成功!');
    }catch (e){
        useToast().error('评论发送失败!');
        console.error(e);
    } finally {
        submitting.value = false;
    }
};


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
        window.$showDialog("删除后不可恢复,是否删除?", async () => {
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

watch(() => isAsc.value, reloadComments);
watch(() => post.value, reloadComments);


watch(() => post.value, () => {
    if (!post.value) return;
    imgUrls.value = [];
    imgIndex.value = 0;
    bodyHTML.value = post.value.bodyHTML;
    const template = html2dom(bodyHTML.value);
    const aELs = template.content.querySelectorAll("a");
    aELs.forEach(a => {
        const img = a.querySelector("img");
        if (img) {
            if (img.src) imgUrls.value.push(img.src);
            const next = a.nextSibling;
            if (next && next.nodeType === 1 && next.tagName === "BR") { next.remove(); }
            a.remove();
        }
    });
    bodyHTML.value = template.innerHTML;
});

</script>

<style scoped lang="less">

.background-scroll {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: visible;
    z-index: -1;
    user-select: none;
    pointer-events: none;
    span {
        line-height: 1;
        font-size: 30rem;
        white-space: nowrap;
        color: rgba(49,49,49,0.5);
        margin-bottom: -3rem;
    }
    span:nth-child(odd) {
        animation: scroll-left 90s linear infinite alternate;
    }

    span:nth-child(even) {
        animation: scroll-right 90s linear infinite alternate;
    }
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
        background-image: linear-gradient(-30deg, rgba(0,0,0,0.9), transparent);
    }
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 2;
        background-image: url("@/assets/svg/point.svg");
        background-size: 8px;
    }
    @keyframes scroll-left {
        from { transform: rotate(-15deg) translateX(0); }
        to { transform: rotate(-15deg) translateX(-50%); }
        }

    @keyframes scroll-right {
        from { transform: rotate(-15deg) translateX(0); }
        to { transform: rotate(-15deg) translateX(50%); }
    }
}

.post-detail-mask {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    background-image: repeating-linear-gradient(
        45deg,            
        rgba(49,49,49,0.38),             
        rgba(49,49,49,0.38) 3px,          
        transparent 4px,
        transparent 8px
    );
    backdrop-filter: blur(5px);
    z-index: 11;
    transition: opacity 0.3s;
    &.show {
        opacity: 1;
        visibility: visible;
        .post-detail {
            animation: fade-in 0.3s ease forwards;
        }
    }
    &.hide {
        opacity: 0;
        visibility: hidden;
        .post-detail {
            animation: fade-out 0.3s ease forwards;
        }
    }

    @keyframes fade-in {
        from { transform: translateX(10%); }
        to { transform: translateX(0);}
    }
    @keyframes fade-out {
        from { transform: translateX(0); }
        to { transform: translateX(-10%);}     
    }
}

.post-detail {
    width: 80%;
    aspect-ratio: 1.8/1;
    transition: all 0.3s;
    border-radius: 25px 0px 25px 25px;
    overflow: hidden;
    position: relative;
    border: 4px solid #000;
    box-shadow: 0 0 0 5px rgba(49,49,49,0.7);
    background-image: linear-gradient(-10deg, #000, @bg-primary-color);
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        position: fixed;
        width: 100%;
        height: 100px;
        padding: 10px 15px;
        background-image: linear-gradient(rgba(32,32,32,0.7), #000);
  
        .author-info {
            height: 100%;
            flex: 1;
            display: flex;
            gap: 8px;
            .avatar {
                border: 4px solid @border-color;
                height: 100%;
                aspect-ratio: 1/1;
                border-radius: 50%;
                user-select: none;
                img {
                    width: 100%;
                    height: 100%;
                    border: 2px solid #000;
                    border-radius: 50%;
                }
            }
            .content {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 8px;
                .author-name{
                    font-size: 1.5rem;
                    color: @text-tertiary-color;
                    line-height: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .reaction-count {
                    user-select: none;
                    color: #000;
                    padding: 0 10px 0 8px;
                    background-color: rgba(255,255,255, 0.3);
                    border-radius: @max-radius;
                    width: fit-content;
                    display: flex;
                    justify-content: center;
                    align-items: center;  
                    line-height: 1;
                    .icon {
                        filter: invert(1);
                        width: 24px;
                        height: 24px;
                    }
                }
            }
        }
        .close-btn {
            cursor: pointer;
            height: 100%;
            aspect-ratio: 1/1;
            user-select: none;
            flex-shrink: 0;
        }
    }
    main {
        display: flex;
        justify-content: space-around;
        gap: 24px;
        padding: 130px 20px 25px 20px;
        width: 100%;
        height: 100%;
        z-index: 0;
        .media-container {
            width: auto;
            height: 100%;
            aspect-ratio: 3 / 4;
            border: 4px solid @border-color;
            border-radius: 15px;
            background-color: #000;
            overflow: hidden;   
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            .index-info {
                position: absolute;
                right: 5px;
                bottom: 5px;
                font-size: 0.75rem;
                padding: 0 6px;
                background-color: rgba(0,0,0,0.38);
                border-radius: @max-radius;
                user-select: none;
                pointer-events: none;
            }
            .prev-btn,
            .next-btn {
                position: absolute;
                width: 48px;
                height: 48px;
                background-color: rgba(0,0,0,0.7);
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                transition: all 0.3s;
                opacity: 0;
                &:hover {
                    background-color: lighten(rgba(0,0,0,0.7), 20%);
                }
            }
            .prev-btn {
                padding-right: 2px;
                left: 5px;
            }
            .next-btn {
                padding-left: 2px;
                right: 5px;
            }  
            &:hover {
                .prev-btn,
                .next-btn {
                    opacity: 1;
                }
            }       
        }
        .interaction-container {
            height: 100%;
            flex: 1;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 15px;
            position: relative;
            overflow: hidden;
            padding: 20px;
            padding-bottom: 75px;
            overflow-y: scroll;
            overflow-x: hidden;    
            box-shadow: inset 0 -2px 2px @border-color; 
            .post-title {
                font-size: 1.25rem;
            }
            .post-body {
                font-size: 1.125rem;
                margin-bottom: 32px;
            }   
            .reply-box {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 8px;
                border: 2px dashed @border-color;
                backdrop-filter: blur(2px);
                border-radius: 15px;
                padding: 8px;
                textarea {
                    width: 100%;
                    background-color: transparent;
                    resize: none;
                    font-size: 1em;
                    border: none;
                    color: @text-primary-color;
                    padding: 0 4px;
                }
                .actions {
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    gap: 8px;
                    .submit {
                        font-size: 1rem;
                        padding: 4px 20px;
                        border-radius: @max-radius;
                        background-color: @bg-secondary-color;
                        color: @text-secondary-color;
                        cursor: pointer;
                        font-family: sans-serif;
                        font-weight: bold;
                        &:active {
                            background-color: lighten(@bg-secondary-color, -5%);
                        }
                    }
                }
            }   
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
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                                .comment-body {
                                    white-space: normal;
                                    word-break: break-word;
                                    overflow-wrap: break-word;
                                }
                            }
                        }
                        .actions {
                            display: flex;
                            justify-content: end;
                            align-items: center;
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
        }
    }
}

@media (max-width: 1200px) {
    .post-detail-mask .post-detail {
        height: 100vh;
        width: 100vw;
        border-radius: 0;
        main {
            flex-direction: column;
            padding: 100px 0 0 0;
            gap: 15px;
            .media-container {
                width: 100%;
                height: auto;
                aspect-ratio: 4 / 3;
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

