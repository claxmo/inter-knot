<template>
    <header>
        <div class="left-wrapper">
            <userInfo />  
            <a 
            :href="`https://github.com/${store.owner}/${store.repo}/discussions/new/choose`" 
            target="_blank" 
            class="write-btn" 
            title="写帖子">
              <img src="@/assets/svg/write.svg">
            </a>
        </div>
        <div class="right-wrapper">
            <navBar :items="['推送', '日程', '历程', '绳网等级']"/>
        </div>
    </header>
</template>

<script setup>
import userInfo from "@/components/userInfo.vue";
import navBar from "@/components/navBar.vue";
import { useConfigStore } from "@/stores/config";

const store = useConfigStore();
</script>

<style scoped lang="less">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 90px;
  padding: 5px 40px;
  background-color: rgba(0, 0, 0, 0.7);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
}

.write-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  background: #000;
  border: 2px solid #000;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 0 0 4px @border-color; 
  &:active {
    animation: border-glow 0.5s linear infinite alternate;
  }
  img {
    width: 24px;
    height: 24px;
  }
}
.left-wrapper, 
.right-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

@media (max-width: 1280px) {
  header {
    justify-content: center;
  }
  .right-wrapper {
    display: none;
  }
}
</style>
