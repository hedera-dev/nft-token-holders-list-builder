import { toast } from 'sonner';
import dictionary from '@/dictionary/en.json';

export const copyToClipboard = async (textToCopy: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(textToCopy);
    toast.success(dictionary.copiedToClipboard);
    return;
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;

    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
};
