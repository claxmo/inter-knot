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
            <div class="level-num">{{ author?.public_repos ?? 0 }}</div>
            <div class="level-text">LEVEL</div>
        </div>
    </div>
</template>

<script setup>
import defaultAvatarUrl from '@/assets/svg/default-avatar.svg';
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/stores/config';
import { useToast } from 'vue-toastification';

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

const clickHandle = async () => {
  if (author.value?.html_url){
    window.open(author.value.html_url,'_blank');
  }else {
    try{
      author.value = await window.getUserProfile();
    }catch(e){
      useToast().error("获取用户信息失败!");
      console.error(e);
    }
  }
};

</script>

<style scoped lang="less">

.user-info {
  width: 320px;
  height: 64px;
  padding: 8px;
  display: flex;
  gap: 8px;
  border: 3px solid #000;
  border-radius: @max-radius;
  background: linear-gradient(#222222, #141414);
  box-shadow: inset 0 2px 2px #323232, inset 0 -2px 2px #181818;
  cursor: pointer;
  flex-shrink: 0;
  &:active {
    animation: border-color 0.7s linear infinite alternate;
  }
  .avatar {
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    user-select: none;
  }
  .user-info-text {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;
    min-width: 0;
    .username {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; 
    }
    .experience {
      user-select: none;
      height: 16px;
      width: 100%;
      border-radius: @max-radius;
      background: linear-gradient(#141414, #222222);
      box-shadow: inset 0 2px 2px #181818, inset 0 -2px 2px #323232;
      .bar {
        height: 100%;
        max-width: 100%;
        padding: 0 4px;
        border-radius: @max-radius;
        background: linear-gradient(90deg, #4661fd, #10bff0);
        display: flex;
        align-items: center;
        .cur-exp,
        .total-exp {
          font-size: 12px;
         
        }
      }
    }
  }
  .level {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    user-select: none;
    .level-num {
      font-size: 24px;
      line-height: 1;
    }
    .level-text {
      font-size: 10px;
      line-height: 1;
      color: @text-tertiary-color;
      font-family: sans-serif;
      font-weight: bold;
    }
  }
}
</style>



