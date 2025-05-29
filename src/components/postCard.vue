<template>
    <div class="post-card" @click="$emit('click')" :class="{delegate: isDelegate, R18: isR18}">
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
                <span class="avatar"><img :src="post.author.avatarUrl" /></span>
                <span class="author-name">{{ post.author.login }}</span>
            </div>
            <div class="post-title">
                <span class="label" v-if="post.category.name !== '常规'">{{ `[${post.category.name}]` }}</span> 
                <span v-text="post.title"></span>
            </div>
            <span class="post-body" v-text="post.bodyText || 'null'"></span>
        </div>
    </div>
</template>

<script setup>
import defaultCoverUrl from '@/assets/svg/default-cover.svg';
import { defineProps,ref, defineEmits, toRef, onMounted, computed} from 'vue';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    }
});
const post = toRef(props, "post");
const emit = defineEmits(["click","imageLoaded"]);
const coverUrl = ref(defaultCoverUrl);
const isDelegate = computed(() => post.value.category.name === '委托');
const isR18 = computed(() => post.value.category.name === 'R18');
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

onMounted(() => {
  const imgRegex = /<img[^>]+src=['"]([^'"]+)['"][^>]*>/i;
  const match = post.value.bodyHTML.match(imgRegex);
  if (match){
    coverUrl.value = match[1];
  }
});

</script>

<style scoped lang="less">

.post-card {
  position: relative;
  width: 300px;
  background-color: @bg-primary-color;
  border: 4px solid #000;
  border-radius: 30px 30px 0 30px;
  overflow: hidden;
  z-index: 9;
  cursor: pointer;
  transition: all 0.3s;
  &:active {
    animation: border-glow 0.5s linear infinite alternate;
  }
  .cover {
    display: block;
    width: 100%;
    max-height: 400px;
    min-height: 185px;
    object-fit: cover;
  }
  .footer {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 15px 8px;
    background-color: @bg-primary-color;
    .author-info {
      display: flex;
      width: 100%;
      height: 32px;
      margin-bottom: 5px;
      overflow: visible;
      .avatar {
        position: relative;
        height: 65px;
        aspect-ratio: 1 / 1;
        margin-top: -28px;
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
        margin-left: 5px;
        padding: 2px 0 0 4px;
        color: @text-secondary-color;
        border-bottom: 3px solid @border-color;
        .single-line-ellipsis();
      }
    }
    .post-title {
      padding: 0 5px;
     .multi-line-ellipsis(2);
      span {
        font-size: 1.125rem;
      }
    }
    .post-body {
      padding: 0 5px;
      color: @text-secondary-color;
      .single-line-ellipsis();
    }
  }
  .views {
    position: absolute;
    top: 5px;
    left: 15px;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    .view-num {
      font-size: 18px;
      padding-bottom: 3px;
    }
    img {
      width: 24px;
      height: 24px;
    }
  }
}

.post-card.viewed .post-title * {
  color: @text-secondary-color;
}

.post-card.delegate:not(.viewed) .post-title * {
  .text-linear-gradient(0, #4661fd, #10bff0);
}

.post-card.R18 .cover {
  filter: blur(25px);
}

.post-card.R18:not(.viewed) .post-title * {
  .text-linear-gradient(0, #FF386B, #fc7395);
}

</style>
