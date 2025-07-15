import { createApp, h } from 'vue';
import DialogBox from '@/components/dialogBox.vue';

export function showDialog(content, onConfirm) {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    function closeDialog(result) {
      resolve(result);
      app.unmount();
      container.remove();
    }

    const app = createApp({
      render() {
        return h(DialogBox, {
          content,
          onCancel(result) {
            closeDialog(result);
          },
          async onConfirm(result) {
            closeDialog(result);
            await onConfirm();
          }
        });
      }
    });

    app.mount(container);
  });
}
