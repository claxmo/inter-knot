<template>
    <div class="post-card" @click="viewed = true" :class="{mission: post.category.name === '委托', viewed: viewed}">               
        <img 
        class="cover"
        :style="{
          filter: filter,
        }"
        :src="post.cover === undefined ? defaultCoverUrl : post.cover" 
        loading="lazy" 
        @load="isLoaded = true" 
        @error="isError = true"
        ref="cover"
        />
        <div class="reaction-count">
            <svg t="1729428731220" class="icon" viewBox="0 0 1316 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8355" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24">
              <path d="M658.139429 365.129143c-38.838857 0-75.410286 15.140571-102.985143 42.715428a144.676571 144.676571 0 0 0-42.715429 102.985143c0 38.912 15.140571 75.483429 42.715429 103.058286s64.146286 42.715429 102.985143 42.715429c38.838857 0 75.410286-15.140571 102.985142-42.715429s42.715429-64.146286 42.715429-103.058286c0-38.765714-15.140571-75.337143-42.715429-102.985143a144.457143 144.457143 0 0 0-102.985142-42.715428z m644.973714 146.432c-0.365714-8.045714-12.653714-47.542857-29.842286-88.722286-17.554286-42.422857-47.250286-103.862857-88.429714-155.062857A587.044571 587.044571 0 0 0 987.428571 107.812571C892.708571 60.342857 781.897143 36.278857 658.139429 36.278857c-123.611429 0-234.422857 24.137143-329.142858 71.68a590.921143 590.921143 0 0 0-197.485714 159.744C90.477714 319.122286 60.928 380.562286 43.373714 422.985143c-17.188571 41.179429-29.257143 80.749714-29.696 88.722286v0.585142c0.365714 8.045714 12.653714 47.542857 29.842286 88.868572 17.700571 42.422857 47.250286 103.862857 88.283429 154.989714A587.044571 587.044571 0 0 0 329.142857 915.968c95.305143 47.762286 205.970286 71.899429 329.142857 71.899429 123.318857 0 234.057143-24.137143 329.142857-71.899429a590.482286 590.482286 0 0 0 197.485715-159.670857c41.106286-51.273143 70.802286-112.713143 88.356571-155.136 17.188571-41.179429 29.476571-80.749714 29.842286-88.722286v-0.292571-0.585143zM658.139429 758.491429a247.881143 247.881143 0 0 1-247.588572-247.588572A247.954286 247.954286 0 0 1 658.139429 263.314286a247.954286 247.954286 0 0 1 247.588571 247.515428 247.881143 247.881143 0 0 1-247.588571 247.588572z" fill="currentColor" p-id="8356"></path>
            </svg>
            <span>{{ post.reactions.totalCount }}</span>
        </div> 
        <div class="footer">
            <div class="author-info">
                <span class="avatar"><img :src="post.author.avatarUrl" /></span>
                <span class="author-name">{{ post.author.login }}</span>
            </div>
            <div class="post-title">
              <img class="icon" v-if="post.category.name === '委托'" :src="viewed ? iconMissionViewed : iconMission" />           
              <span class="text">
                {{ post.category.name !== '常规' ? `[${post.category.name}]` : ''}}{{ post.title }}
              </span>
            </div>
            <div class="post-body" v-text="post.bodyText || 'null'"></div>
        </div>
    </div>
</template>

<script setup>
import defaultCoverUrl from '@/assets/svg/default-cover.svg';
import iconMission from '@/assets/img/IconInterknotMission.png';
import iconMissionViewed from '@/assets/img/IconInterknotMission02.png';
import { useElementSize, useElementVisibility } from '@vueuse/core';
import { defineProps,ref, defineEmits, toRefs, onMounted, watch } from 'vue';
import { isNSFW } from '@/utils/nsfw';
import { html2dom } from '@/utils/utils';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    }
});
const { post } = toRefs(props);
const cover = ref(null);
const isLoaded = ref(false);
const isError = ref(false);
const viewed = ref(false);
const filter = ref("none");

const emit = defineEmits(["resize"]);
const { height } = useElementSize(cover);
watch(height, () => {
  emit('resize');
});

const coverVisibility = useElementVisibility(cover);
watch(coverVisibility, async (visible) => {
  if (!visible) return;
  if (post.value.isNSFW !== undefined) return;
  if (await isNSFW(cover.value)) {
    post.value.isNSFW = true;
    filter.value = "blur(20px)";
  }else {
    post.value.isNSFW = false;
    filter.value = "none";
  }
});

onMounted(async () => {
  const template = html2dom(post.value.bodyHTML);
  const img = template.content.querySelector("img");
  if (img) {
    try {
      post.value.cover = URL.createObjectURL(await window.getBlob(img.src));
    } catch {
      post.value.cover = defaultCoverUrl;
      isError.value = true;
    }
  }
});
</script>

<style scoped lang="less">

.post-card {
  position: relative;
  width: 100%;
  background-color: @bg-primary-color;
  border: 4px solid #000;
  border-radius: 30px 30px 0 30px;
  overflow: hidden;
  z-index: 9;
  cursor: pointer;
  transition: all 0.3s;
  &:active {
    animation: border-color 0.7s linear infinite alternate;
  }
  .cover {
    display: block;
    width: 100%;
    object-fit: cover;
    max-height: 400px;
    min-height: 185px;
  }
  .footer {
    position: relative;
    width: 100%;
    padding: 0 16px 8px;
    background-color: @bg-primary-color;
    .author-info {
      display: flex;
      width: 100%;
      height: 32px;
      align-items: center;
      overflow: visible;
      .avatar {
        user-select: none;
        position: relative;
        height: 65px;
        aspect-ratio: 1 / 1;
        margin-bottom: 22px;
        z-index: 1;
        border-radius: 50%;
        border: 4px solid @bg-primary-color;
        background-color: @bg-primary-color;
        &::before,
        &::after {
          content: "";
          position: absolute;
          top: -6px;
          width: 30px;
          height: 30px;
          background: transparent;
          border-radius: 50%;
          z-index: 0;
        }
        &::before {
          left: -29.5px;
          box-shadow: 15px 18px @bg-primary-color;
        }
        &::after {
          right: -29.5px;
          box-shadow: -15px 18px @bg-primary-color;
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
        flex: 1;
        position: relative;
        margin-left: 8px;
        padding-left: 4px;
        color: @text-tertiary-color;
        height: 100%;
        border-bottom: 3px solid @border-color;
        .single-line-ellipsis();
      }
    }
    .post-title {
      width: 100%;
      padding: 0 4px;
      .multi-line-ellipsis(3);
      .icon {
        width: 22px;
        height: 22px;
        margin-right: 8px;
        vertical-align: middle;
      }
      .text {
        font-size: 1.125em;
        line-height: 0;
        vertical-align: middle;

      }
    }
    .post-body {
      width: 100%;
      padding: 0 4px;
      color: @text-secondary-color;
      .single-line-ellipsis();
    }
  }
  .reaction-count {
    position: absolute;
    top: 5px;
    left: 15px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.post-card.viewed .post-title .text{
  color: @text-secondary-color;
}

.post-card.mission:not(.viewed) .post-title .text{
  .text-linear-gradient(0, #4661fd, #10bff0);
}

</style>
