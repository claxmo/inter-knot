<template>
  <header>
    <UserInfo />  
    <WriteBtn />    
    <TabContainer :items="['推送', '日程', '历程', '绳网等级']"/>
  </header>
</template>

<script setup>
import UserInfo from "@/components/userInfo.vue";
import WriteBtn from "@/components/writeBtn.vue";
import TabContainer from "@/components/tabContainer.vue";

</script>

<style scoped lang="less">
header {
  z-index: 10;
  position: fixed;
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 40px;
  background-color: rgba(0,0,0,0.7);
  box-shadow: 0 4px 10px rgba(0,0,0,0.9);
  backdrop-filter: blur(10px);
}

@media (max-width: 1200px) {
  header {
    justify-content: center;
  }
}
</style>
