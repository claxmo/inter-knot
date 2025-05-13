<template>
    <div class="mask" :class="store.isOpenPostDetail ? 'open' : 'close'" @click="store.closePostDetail">
        <div class="post-detail" @click.stop>
            <header>
                <div class="author-info">
                    <span class="avatar"><img :src="post.author?.avatarUrl ?? defaultAvatarUrl" /></span>
                    <div class="text">
                        <span class="author-name">{{ post.author?.login ?? "匿名用户" }}</span>
                        <ul class="meta">
                            <li><img src="@/assets/svg/clock.svg" />{{ new Date(post?.createdAt).toLocaleDateString("en-CA") }}</li>
                            <li><img src="@/assets/svg/views.svg" />{{ post.comments?.totalCount ?? 0 }}</li>
                            <li><img src="@/assets/svg/pictures.svg" />{{ imgUrls.length }}</li>
                        </ul>
                    </div>
                </div>
                <img class="close-btn" src="@/assets/svg/close-btn-right.svg" alt="关闭" @click="store.closePostDetail" />
            </header>
            <main>
                <div class="media-container">
                    <span class="prev-btn" @click="prevImage" title="上一张" v-show="imgUrls.length > 1"></span>
                    <img 
                    v-for="(url, index) in imgUrls"
                    v-show="index === currentIndex"
                    :src="url" 
                    :key="url" />
                    <span class="next-btn" @click="nextImage" title="下一张" v-show="imgUrls.length > 1"></span>
                    <span class="cur-page" v-show="imgUrls.length > 1">{{ currentIndex + 1 }}/{{ imgUrls.length }}</span>
                </div>
                <div class="interaction-container">
                    <span class="post-title">
                        <span class="label" v-show="post.category?.name !== '常规'">{{ `[${post.category?.name}]` }}</span>
                        <span v-text="post.title"></span>
                    </span>
                    <div class="markdown-body" v-html="postBody"></div>
                    <a class="reply-btn"
                       :href="`https://github.com/${store.name}/${store.repo}/discussions/${post.number}`" 
                       target="_blank" 
                       title="写评论"><img src="../assets/svg/write.svg" width="20" height="20"/>&nbsp;写评论</a>   
                    <ul class="comment-list">
                        <li class="comment-item" 
                            v-for="(comment, index) in comments.nodes"
                            :key="comment.id"
                            :class="{ owner: comment.author.login === store.author.login }" >
                            <span class="avatar"><img :src="comment.author.avatarUrl" /></span>
                            <div class="text">
                                <span class="author-name">
                                    <span class="label" v-if="comment.author.login === post.author.login">[楼主]</span>
                                    <span>{{ comment .author.login }}</span>
                                </span>
                                <!-- <span class="createAt">{{ new Date(comment.createdAt).toLocaleDateString("en-CA") }}</span> -->
                                <div class="markdown-body" v-html="marked(comment.body)"></div>
                            </div>
                            <span class="floor">{{ index + 1 }}F</span>
                        </li>
                    </ul>      
                    <span class="message">
                        <p v-if="isLoading">正在努力加载中···</p>
                        <p v-else-if="comments.pageInfo?.hasNextPage === false">- 已无更多评论 -</p>
                        <p v-else @click="getNextComments" style="cursor: pointer;">- 点击加载更多 -</p>            
                    </span>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import defaultCoverUrl from '@/assets/svg/default-cover.svg';
import defaultAvatarUrl from '@/assets/svg/default-avatar.svg';
import { marked } from 'marked';
import { computed, ref, watch, nextTick } from 'vue';
import { useToast } from 'vue-toastification';
import { useConfigStore } from '@/stores/config';

const store = useConfigStore();
const post = computed(() => store.posts[store.curPostIndex] ?? {});
const comments = ref({
        nodes: [],
        pageInfo: {
            hasNextPage: true,
            endCursor: null,
        }
    });
const isLoading = ref(false);

const imgUrls = ref([]);
const postBody = ref("");
const currentIndex = ref(0);

const getNextComments = async () => {
    if (isLoading.value || comments.value.pageInfo?.hasNextPage === false) return;
    isLoading.value = true;
    try{
        if (typeof window.getComments === "undefined") throw new Error("window.getComments is undefined");
        const commentNode = await window.getComments(post.value.id, comments.value.pageInfo?.endCursor);
        comments.value.nodes.push(...commentNode.comments.nodes.filter(
            comment => !comments.value.nodes.some(c => c.id === comment.id)
        ));
        comments.value.pageInfo = commentNode.comments.pageInfo;
    }catch(e){
        useToast().error("获取评论列表失败!");
        console.error(e);
    }finally{
        nextTick(() => {
            isLoading.value = false;
        });
    }       
};

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + imgUrls.value.length) % imgUrls.value.length;
};

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % imgUrls.value.length;
};

const imgRegx = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;

watch(() => store.isOpenPostDetail, async (newValue) => {
    if (!newValue) return;
    if(!post.value || !post.value.id) return;
    comments.value = {
        nodes: [],
        pageInfo: {
            hasNextPage: true,
            endCursor: null,
        }
    };
    isLoading.value = false;
    currentIndex.value = 0;
    imgUrls.value = [defaultCoverUrl];
    postBody.value = marked(post.value.body);
    const matches = [...postBody.value.matchAll(imgRegx)];
    if (matches.length){
        imgUrls.value = matches.map(match => match[1]);
        postBody.value = postBody.value.replace(imgRegx, '');
    }
    await getNextComments();
});

</script>

<style scoped lang="less">
.mask {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('@/assets/svg/mask.svg') repeat center center;
    background-size: 12px;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 11;
    transition: all 0.3s;

    &.open {
        opacity: 1;
        visibility: visible;

        .post-detail {
            transform: translateX(0%);
        }
    }

    &.close {
        opacity: 0;
        visibility: hidden;

        .post-detail {
            transform: translateX(10%);
        }
    }
}

@keyframes scroll {
    0% {
        background-position: left bottom;

    }

    100% {
        background-position: right top;

    }
}

.post-detail {
    width:75%;
    height: 75%;
    transition: all 0.3s;
    border-radius: 50px 0px 50px 50px;
    border: 4px solid @color-gray;
    overflow: hidden;
    background: url('@/assets/img/background.png') no-repeat center center;
    background-size: cover;
    animation: scroll 30s linear infinite;
    header {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        justify-content: center;
        width: 100%;
        height: 85px;
        padding: 5px 36px;
        background-color: rgba(0, 0, 0, 0.7);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.9);
        .backdrop-blur(10px);
        .close-btn {
            cursor: pointer;
            height: 100%;
            aspect-ratio: 1/1;
        }
        .author-info {
            height: 90%;
            display: flex;
            gap: 10px;
            flex: 1;
            align-items: center;
            .avatar {
                height: 100%;
                aspect-ratio: 1/1;
                border-radius: 50%;
                border: 4px solid @color-gray;
                img {
                    height: 100%;
                    aspect-ratio: 1/1;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid @color-black;
                }
            }
            .text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 5px;
                .author-name {
                    font-size: 22px;
                    color: @font-color-secoundary;
                }
                .meta {
                    display: flex;
                    gap: 8px;
                    li {
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
            }
        }
    }

    main {
        display: flex;
        justify-content: space-around;
        background: url("../assets/svg/point.svg");
        background-size: 8px;
        padding: 125px 25px 35px 25px;
        width: 100%;
        height: 100%;
        border: 4px solid @color-black;
        border-radius: 50px 0px 50px 50px;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 0;
    }
}

.media-container {
    width: 35%;
    height: 100%;
    border: 4px solid @color-gray;
    border-radius: 25px;
    background-color: @color-black;
    overflow: hidden;
    position: relative;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .prev-btn,
    .next-btn {
        position: absolute;
        width: 50%;
        height: 100%;
        cursor: pointer;
        &:active {
            background-color: rgba(0,0,0,0.3);
        }
    }
    .prev-btn {
        left: 0;
    }
    .next-btn {
        right: 0;
    }
    .cur-page{
        position: absolute;
        right: 8px;
        bottom: 4px;
        text-align: center;
        color: rgba(255,255,255,0.3);
    }
}

.interaction-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 60%;
    padding: 16px 24px;
    padding-bottom: 75px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 25px;
    overflow-y: scroll;
    overflow-x: hidden;
    overflow-wrap: break-word;
    .post-title {
        span {
            font-size: 1.125rem;
        }
         .label {
            margin-right: 2px;
        }
    }
    .reply-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: @color-black;
        border: 4px solid @color-gray;
        border-radius: 50px;
        min-height: 45px;
        width: 100%;
        cursor: pointer;
        margin: 8px 0;

    }
    .comment-list {
        width: 100%;
        height: auto;
        .comment-item {
            min-height: 70px;
            width: 100%;
            border-bottom: 2px solid @color-gray;
            display: flex;
            padding: 4px 0;
            position: relative;
            .avatar {
                height: 58px;
                aspect-ratio: 1/1;
                border-radius: 50px;
                border: 3px solid @color-gray;
                img {
                    height: 100%;
                    border-radius: 50px;
                    object-fit: cover;
                    border: 2px solid @color-black;
                }
            }
            .text{
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 2px;
                margin-left: 5px;
                flex: 1;
                min-height: 100%;
                .author-name {
                    color: @font-color-secoundary;
                }           
                .label {
                    margin-right: 2px;
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
                color: @color-black;

            }
            &.owner {
                .text .author-name *{
                    color: @color-orange;
                }
                .floor {
                    background-color: @color-orange;
                }
            }
        }
    }
    .message {
        width: 100%;
        height: auto;
        p {
            text-align: center;
            color: @font-color-secoundary;
            font-size: 1rem;
        }
    }
}

@media (max-width: 1080px) {

    .post-detail {
        height: 100vh;
        width: 100vw;
        main {
            flex-direction: column;
            overflow-y: scroll;
            overflow-x: hidden;


            .media-container {
                width: 100%;
                min-height: 35%;
            }

            .interaction-container {
                width: 100%;
                flex: 1;
                overflow: visible;

            }
        }
    }
}
</style>

