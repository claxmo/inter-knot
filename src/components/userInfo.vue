<template>
    <div class="user-info" @click="clickHandle" :title="author?.login ? '已登录' : '点击登录'">
        <img class="avatar" :src="author?.avatar_url ?? defaultAvatarUrl">
        <div class="info-text">
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

const isLogin = ref(localStorage.getItem("accessToken") !== null);

const clickHandle = () => {
    if (author.value?.login) {
        window.open(author.value.html_url,"_blank");
    } else {
        window.authLogin();
    }
};

onMounted(async () => {
    if (isLogin.value) {
      try{
        if (typeof window.getUserProfile === "undefined") throw new Error("window.getUserProfile is undefined");
        author.value = await window.getUserProfile();
      }catch(e){
        useToast().error("获取用户信息失败!");
        console.error(e);
      }
    }else{
      window.authLogin();
    }
});

</script>

<style scoped lang="less">
.user-info {
  width: 300px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 5px 15px 5px 5px;
  border: 3px solid @color-black;
  border-radius: 50px;
  background: linear-gradient(#212121, #141414);
  box-shadow: inset 0 2px 2px #313431, inset 0 -2px 2px #181818;
  color: inherit;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
  &:hover {
    animation: border-glow 0.5s linear infinite alternate;
  }
  .avatar {
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    flex-shrink: 0;
    border: 2px solid @color-black;
  }
  .info-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;

    .username {
      display: flex;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .experience {
      height: 14px;
      width: 100%;
      border-radius: 50px;
      background: @color-gray-dark;
      box-shadow: inset 0 2px 2px #131313, inset 0 -2px 2px @color-gray;
      .bar {
        height: 100%;
        max-width: 100%;
        border-radius: 50px;
        background: linear-gradient(90deg, @color-blue, @color-blue-light);
        padding: 0 2px;
        display: flex;
        align-items: center;
        font-size: 0.875em;
        .cur-exp,
        .total-exp {
          font-size: 0.875em;
          text-align: center;
        }
      }
    }
  }
  .level {
    height: 100%;
    text-align: center;
    .level-num {
      font-size: 1.5em;
      margin-bottom: -5px;
    }
    .level-text {
      font-size: 0.5em;
      color: @font-color-secoundary;
    }
  }
}
</style>



