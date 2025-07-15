<template>
    <div class="popup-container" :class="props.show ? 'show' : 'hide'" @click="$emit('hide')" >
        <div class="post-detail" @click.stop>
            <div class="main-background">
                <span v-for="index of 9" :key="index">ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO</span>
            </div>
            <header>
                <div class="author-info">
                    <a class="avatar" :href="post?.url" target="_blank"><img :src="post.author?.avatarUrl || defaultAvatarUrl"></a>
                    <div class="content">
                        <div class="author-name">{{ post.author?.login || "匿名用户" }}</div>
                        <div class="reaction-count">
                            <img class="icon" src="@/assets/img/IconFavorability.png" />
                            <div class="reaction-num">{{ post?.reactions?.totalCount || 0 }}</div>
                        </div>
                    </div>
                </div>
                <img class="close-btn" src="@/assets/svg/close.svg" alt="关闭" @click="$emit('hide')" />
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
                        v-show="curIndex === index"/>
                    </NImageGroup>
                    <span class="prev-btn" @click="prevImage" title="上一张" v-show="imgUrls.length > 1"></span>
                    <span class="next-btn" @click="nextImage" title="下一张" v-show="imgUrls.length > 1"></span>
                    <span class="cur-page" v-show="imgUrls.length > 1">{{ curIndex + 1 }}/{{ imgUrls.length }}</span>
                </div>
                <div class="interaction-container">
                    <div class="container">
                        <div class="post-title">
                            {{post.category?.name !== '常规' ? `[${post.category?.name}]` : ''}}{{ post.title }}
                        </div>
                        <div class="markdown-body post-body" v-html="bodyHTML"></div>
                        <CommentContainer :post="post" />
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import CommentContainer from '@/components/commentContainer.vue';
import defaultAvatarUrl from '@/assets/svg/default-avatar.svg';
import { ref, watch, defineProps, toRefs } from 'vue';
import { NImage, NImageGroup } from 'naive-ui';
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
const curIndex = ref(0);

const prevImage = () => {
 curIndex.value = (curIndex.value - 1 + imgUrls.value.length) % imgUrls.value.length;
};

const nextImage = () => {
 curIndex.value = (curIndex.value + 1) % imgUrls.value.length;
};

watch(imgUrls, () => {
  curIndex.value = 0;
});

watch(() => post.value, () => {
    if (!post.value) return;
    imgUrls.value = [];
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

.main-background {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: visible;
    z-index: -1;
    user-select: none;
    span {
        line-height: 1;
        font-size: 20rem;
        white-space: nowrap;
        color: rgba(49,49,49,0.58);
    }
    span:nth-child(odd) {
        animation: scroll-left 60s linear infinite alternate;
    }

    span:nth-child(even) {
        animation: scroll-right 60s linear infinite alternate;
    }
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
        background-image: linear-gradient(-30deg, rgba(0,0,0,0.9), transparent);
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

.popup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.78);
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

.popup-container .post-detail {
    width: 80%;
    aspect-ratio: 1.8/1;
    transition: all 0.3s;
    border-radius: 25px 0px 25px 25px;
    overflow: hidden;
    position: relative;
    border: 4px solid #000;
    box-shadow: 0 0 0 5px rgba(49,49,49,0.78);
    background-image: linear-gradient(-10deg, #000, @bg-primary-color);
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        position: fixed;
        width: 100%;
        height: 100px;
        padding: 15px 25px;
        background-image: linear-gradient(rgba(32,32,32,0.7), #000);
  
        .author-info {
            height: 100%;
            width: 100%;
            display: flex;
            gap: 12px;
            align-items: center;
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
                overflow: hidden;
                .author-name{
                    font-size: 1.5rem;
                    color: @text-tertiary-color;
                    line-height: 1;
                    .single-line-ellipsis();

                }
                .reaction-count {
                    user-select: none;
                    color: #000;
                    padding: 0 10px 0 6px;
                    background-color: rgba(255,255,255, 0.38);
                    border-radius: @max-radius;
                    width: fit-content;
                    display: flex;
                    justify-content: center;
                    align-items: center;  
                    .icon {
                        filter: invert(1);
                        width: 24px;
                        height: 24px;
                    }
                    .reaction-num {
                        line-height: 0;
                        font-size: 1.125rem;
                    }
                }
            }
        }
        .close-btn {
            cursor: pointer;
            height: 100%;
            aspect-ratio: 1/1;
            user-select: none;
        }
    }
    main {
        display: flex;
        justify-content: space-around;
        gap: 24px;
        padding: 130px 20px 25px 20px;
        width: 100%;
        height: 100%;
        background-image: url("@/assets/svg/point.svg");
        background-size: 8px;
        z-index: 0;
        .media-container {
            width: 35%;
            height: 100%;
            border: 4px solid @border-color;
            border-radius: 25px;
            background-color: #000;
            overflow: hidden;   
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            .cur-page {
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
                width: 35%;
                height: 100%;
                cursor: pointer;
                z-index: 999;
                top: 0;
                &:active {
                    background-color: rgba(0,0,0,0.38);
                }
            }
            .prev-btn {
                left: 0;
            }
            .next-btn {
                right: 0;
            }         
        }
        .interaction-container {
            height: 100%;
            flex: 1;
            background-color: rgba(0, 0, 0, 0.78);
            border-radius: 25px;
            position: relative;
            overflow: hidden;
            .container {
                width: 100%;
                height: 100%;
                padding: 20px;
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
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.78), transparent 24px),
                        linear-gradient(to top, rgba(0, 0, 0, 0.78), transparent 24px);

                }
         
                .post-title {
                    font-size: 1.25rem;
                }
                .post-body {
                    font-size: 1.125rem;
                    margin-bottom: 32px;
                }                         
            }
        }
    }
}

@media (max-width: 1200px) {
    .popup-container .post-detail {
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

