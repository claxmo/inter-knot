import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import '@/assets/style.less';

const app = createApp(App)

app.use(createPinia())

app.use(Toast, {
    // 通知显示的位置（支持 top-right, top-center, top-left, bottom-right, bottom-center, bottom-left）
    position: "top-right",
  
    // 通知显示时长（毫秒），0 表示永久不消失
    timeout: 3000,
  
    // 点击通知时是否关闭
    closeOnClick: true,
  
    // 切换 tab 或窗口失焦时是否暂停倒计时
    pauseOnFocusLoss: true,
  
    // 鼠标悬停时是否暂停倒计时
    pauseOnHover: true,
  
    // 是否允许拖动关闭通知
    draggable: true,
  
    // 拖动的百分比（0.6 表示拖动 60% 以上才关闭）
    draggablePercent: 0.6,
  
    // 悬停时是否显示关闭按钮
    showCloseButtonOnHover: true,
  
    // 是否隐藏底部的进度条
    hideProgressBar: false,
  
    // 是否显示关闭按钮（可以传 `false`、`true` 或自定义组件）
    closeButton: true,
  
    // 是否显示默认图标（你也可以在 toast 里单独传 icon）
    icon: true,
  
    // 是否启用从右向左显示（适合阿拉伯语等 RTL 语言）
    rtl: false,
  }
);
  
setTimeout(() => {
  app.mount('#app')
}, 100);
