<template>
    <div class="popup-container">
        <div class="dialog-box">
            <div class="content">{{ props.content }}</div>
            <div class="control">
            <span class="cancel-btn" @click="emitResult('cancel')"><img class="icon" src="@/assets/svg/cancel.svg">取消</span>
            <span class="confirm-btn" @click="emitResult('confirm')"><img class="icon" src="@/assets/svg/confirm.svg">确认</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  content: String,
});

const emit = defineEmits(['close']);


function emitResult(result) {
  emit('close', result);
}

</script>

<style scoped lang="less">
    @keyframes background-scroll {
        from {
            background-position: left bottom;
        }
        to {
        background-position: right top;
        }
    }

    .popup-container {
        position: fixed;
        inset: 0;
        background-color: rgba(0,0,0,0.5);
        z-index: 12;
        .dialog-box {
            width: 100%;
            height: 200px;
            background: url('@/assets/img/main-bg.png') repeat;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border: 4px solid #000;
            box-shadow: 0 0 0 5px rgba(49,49,49,0.7);
            animation: background-scroll 30s linear infinite;
            position: relative;
            &::before {
                content: '';
                position: absolute;
                inset: 0;
                background: url('@/assets/svg/point.svg') center repeat;
                background-size: 10px;
                z-index: -1;
            }
            .content {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2rem;
            }
            .control {
                position: absolute;
                width: 100%;
                top: 100%;
                display: flex;
                gap: 32px;
                justify-content: center;
                align-items: center;
                transform: translateY(-40%);
                .cancel-btn,
                .confirm-btn {
                    width: 285px;
                    height: 65px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 14px;
                    border: 2px solid #000;
                    box-shadow:
                        inset 1px 1px 1px rgba(255, 255, 255, 0.3),
                        inset 0 0 0 4px @border-color; 
                    border-radius: 50px;
                    background: url('@/assets/svg/point.svg') center repeat;
                    background-size: 6px;
                    background-color: #000;
                    cursor: pointer;
                    font-style: italic;
                    font-size: 1.5rem;
                    position: relative;
                    padding-left: 40px;
                    .icon {
                        width: 62px;
                        height: 62px;
                        position: absolute;
                        left: 0;
                        border-radius: 50%;
                        padding: 12px;
                        box-shadow:
                            inset 1px 1px 1px rgba(255, 255, 255, 0.3),
                            inset 0 0 0 4px @border-color; 
                    }            
                }
            }
        }
    }

</style>