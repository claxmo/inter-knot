import { createApp, h } from 'vue';
import PopupDialogBox from '@/components/popupDialogBox.vue';

export function showDialog(content) {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const app = createApp({
      render() {
        return h(PopupDialogBox, {
          content,
          onClose(result) {
            resolve(result);      
            app.unmount();       
            container.remove();
          },
        });
      },
    });

    app.mount(container);
  });
}
