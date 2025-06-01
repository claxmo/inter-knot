<template>
    <div class="user-info" @click="clickHandle">
        <img class="avatar" :src="author?.avatar_url ?? defaultAvatarUrl">
        <div class="user-info-text">
            <span class="username">{{ author?.login ?? "传奇绳匠" }}</span>
            <div class="experience">
                <div class="bar" :style="{ width }">
                    <span class="cur-exp">{{ curExp }}&nbsp;/&nbsp;</span>
                    <span class="total-exp">{{ totalExp }}</span>
                </div>
            </div>
        </div>
        <div class="level">
            <div class="level-num">{{ Math.min(60, author?.public_repos ?? 0) }}</div>
            <div class="level-text">LEVEL</div>
        </div>
    </div>
</template>

<script setup>
import defaultAvatarUrl from '@/assets/svg/default-avatar.svg';
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { useConfigStore } from '@/stores/config';

const store = useConfigStore();
const { author } = storeToRefs(store);

const curExp = ref(7890);
const totalExp = ref(10000);
const width = computed(() => `${Math.min(100, (curExp.value / totalExp.value) * 100)}%`);

onMounted(async () => {
  try{
    author.value = await window.getUserProfile();
  }catch(e){
    useToast().error("获取用户信息失败!");
    console.error(e);
  }
});

const clickHandle = () => {
  if (author.value?.html_url){
    window.open(author.value.html_url,'_blank');
  }
};

</script>

<style scoped lang="less">

.user-info {
  display: flex;
  gap: 8px;
  width: 300px;
  height: 60px;
  padding: 5px;
  padding-right: 15px;
  border: 3px solid #000;
  border-radius: 50px;
  background: linear-gradient(#212121, #141414);
  box-shadow: inset 0 2px 2px #313431, inset 0 -2px 2px #181818;
  cursor: pointer;
  &:active {
    animation: border-glow 0.5s linear infinite alternate;
  }
  .avatar {
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
  }
  .user-info-text {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;
    min-width: 0;
    .username {
      font-size: 16px;
      .single-line-ellipsis();
    }
    .experience {
      height: 14px;
      width: 100%;
      border-radius: 50px;
      background: linear-gradient(#141414, #212121);
      box-shadow: inset 0 2px 2px #181818, inset 0 -2px 2px #313431;
      .bar {
        height: 100%;
        max-width: 100%;
        border-radius: 50px;
        background: linear-gradient(90deg, #4661fd, #10bff0);
        padding: 0 2px;
        display: flex;
        align-items: center;
        .cur-exp,
        .total-exp {
          font-size: 12px;
          text-align: center;
        }
      }
    }
  }
  .level {
    height: 100%;
    text-align: center;
    .level-num {
      font-size: 24px;
      margin-bottom: -6px;
    }
    .level-text {
      font-size: 8px;
      color: @text-secondary-color;
    }
  }
}
</style>



