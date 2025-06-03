<template>
    <div class="post-card" @click="clickHandle" :class="{delegate: isDelegate, R18: isR18, viewed: viewed}">
        <span class="views">
            <img src="@/assets/svg/views.svg" />
            <span class="view-num">{{ post.upvoteCount }}</span>
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
                <span class="icon" v-if="isDelegate">!</span>
                <span class="text">{{post.category.name !== '常规' ? `[${post.category.name}]` : ''}}{{ post.title }}</span>
            </div>
            <span class="post-body" v-text="post.bodyText || 'null'"></span>
        </div>
    </div>
</template>

<script setup>
import defaultCoverUrl from '@/assets/svg/default-cover.svg';
import { defineProps,ref, defineEmits, toRefs, onMounted, computed} from 'vue';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    }
});
const { post } = toRefs(props);
const emit = defineEmits(["click","imageLoaded"]);
const coverUrl = ref(defaultCoverUrl);
const isDelegate = computed(() => post.value.category.name === '委托');
const isR18 = computed(() => post.value.category.name === 'R18');
const isLoading = ref(true);
const isError = ref(false);
const viewed = ref(false);

const clickHandle = () => {
  emit('click');
  viewed.value = true;
};


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
  width: 100%;
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
    max-height: 350px;
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
      align-items: center;
      overflow: visible;
      .avatar {
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
        margin-left: 9px;
        color: @text-secondary-color;
        height: 100%;
        border-bottom: 3px solid @border-color;
        .single-line-ellipsis();
      }
    }
    .post-title {
      padding: 0 5px;
      display: flex;
      align-items: center;
      .multi-line-ellipsis(2);
      .text {
        font-size: 1.05rem;
      }
      .icon {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 20px;
        width: 20px;
        flex-shrink: 0;
        border-radius: 4px;
        background: linear-gradient(0, #4661fd, #10bff0);
        color: #10bff0;
        font-weight: bold;
        font-size: 16px;
        margin-right: 6px;
        font-style: italic;
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

.post-card.viewed .post-title {
  .icon {
    background: linear-gradient(0, #bcbcbc, #6e6e6e);
    color: #000;
  }
  .text{
    color: @text-tertiary-color;
    // .text-linear-gradient(0, #6e6e6e, #bcbcbc);
  }
}

.post-card.delegate:not(.viewed) .post-title {
  .text {
    .text-linear-gradient(0, #4661fd, #10bff0);
  }
}

.post-card.R18 .cover {
  filter: blur(25px);
}

.post-card.R18:not(.viewed) .post-title {
  .text{
    .text-linear-gradient(0, #FF386B, #fc7395);
  }
}

</style>
