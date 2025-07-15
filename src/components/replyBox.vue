<template>
  <div class="reply-btn" @click="showModal = true">
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M9.243 18.997H21v2H3v-4.243l9.9-9.9l4.242 4.243zm5.07-13.557l2.122-2.121a1 1 0 0 1 1.414 0l2.829 2.828a1 1 0 0 1 0 1.415l-2.122 2.121z"></path>
    </svg>
    写回复
    </div>
  <n-modal v-model:show="showModal" preset="dialog" :show-icon="false" style="width: 500px;" :closable="false" >
    <template #default>
      <n-space vertical :size="16" style="width: 100%;">
        <n-input
          v-model:value="comment"
          type="textarea"
          placeholder="请输入回复内容..."
          maxlength="200"
          show-count
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" :loading="submitting" @click="submitHandle">发布</n-button>
        </n-space>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { NButton, NModal, NInput, NSpace } from 'naive-ui'

const props = defineProps({
  handler: {
    type: Function,
    required: true
  }
})

const showModal = ref(false);
const comment = ref('');
const submitting = ref(false);

const submitHandle = async () => {
    if (submitting.value) return
    submitting.value = true
    try {
        await props.handler(comment.value);
        comment.value = '';
        showModal.value = false;
    }catch (e) {
        console.error(e);
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped lang="less">
.reply-btn {
    cursor: pointer;
    width: 100%;
    height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
    border: 2px solid #000;
    box-shadow:
      inset 1px 1px 1px rgba(255, 255, 255, 0.3),
      inset 0 0 0 4px @border-color; 
    border-radius: @max-radius;
}
</style>